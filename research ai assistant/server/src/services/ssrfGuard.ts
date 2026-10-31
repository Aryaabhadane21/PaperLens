import dns from 'dns/promises';
import ipaddr from 'ipaddr.js';

export interface SSRFValidationResult {
  isValid: boolean;
  reason?: string;
  resolvedIp?: string;
}

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  '169.254.169.254', // AWS/GCP/Azure instance metadata
  'metadata.google.internal',
  'instance-data',
]);

/**
 * Validates a target URL against SSRF attacks before any network request is issued.
 */
export async function validateUrlAgainstSSRF(urlString: string): Promise<SSRFValidationResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { isValid: false, reason: `Malformed URL: ${message}` };
  }

  // Only allow http: and https:
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      reason: `Prohibited protocol: ${parsedUrl.protocol}. Only http: and https: are permitted.`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Check direct blocked hostname match
  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { isValid: false, reason: `Access to restricted internal host (${hostname}) is forbidden.` };
  }

  // If the hostname itself is an IP literal
  if (ipaddr.isValid(hostname)) {
    const addr = ipaddr.parse(hostname);
    if (isPrivateOrRestrictedIp(addr)) {
      return { isValid: false, reason: `Target IP (${hostname}) falls within restricted private ranges.` };
    }
  }

  // Resolve hostname via DNS
  try {
    const lookupResult = await dns.lookup(hostname, { all: true });
    if (!lookupResult || lookupResult.length === 0) {
      return { isValid: false, reason: `Could not resolve hostname ${hostname}` };
    }

    for (const record of lookupResult) {
      if (ipaddr.isValid(record.address)) {
        const addr = ipaddr.parse(record.address);
        if (isPrivateOrRestrictedIp(addr)) {
          return {
            isValid: false,
            reason: `Resolved IP (${record.address}) for ${hostname} falls within restricted private/internal ranges.`,
            resolvedIp: record.address,
          };
        }
      }
    }

    return { isValid: true, resolvedIp: lookupResult[0].address };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { isValid: false, reason: `DNS lookup failed for ${hostname}: ${message}` };
  }
}

function isPrivateOrRestrictedIp(addr: ipaddr.IPv4 | ipaddr.IPv6): boolean {
  const range = addr.range();
  const restrictedRanges = [
    'loopback',
    'private',
    'linkLocal',
    'uniqueLocal',
    'carrierGradeNat',
    'broadcast',
    'reserved',
    'unspecified',
  ];
  return restrictedRanges.includes(range);
}
