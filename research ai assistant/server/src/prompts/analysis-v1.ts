/**
 * Prompt Version 1 (v1) - Baseline Zero-Shot Prompt
 * Basic direct extraction prompt without schema conditioning or negative constraints.
 */
export const ANALYSIS_PROMPT_V1 = `
You are an academic assistant. Read the provided research paper text and extract a structured analysis.
Return valid JSON with the following fields:
{
  "title": "Title of paper",
  "executiveSummary": "A concise 2-3 sentence summary",
  "problem": {
    "statement": "What problem does the paper address?",
    "contextAndSignificance": "Why is it important?",
    "literatureGap": "What was missing previously?",
    "keyChallenges": ["List of challenges"]
  },
  "objectives": {
    "primaryObjective": "Main goal",
    "secondaryObjectives": ["Secondary goals"],
    "hypotheses": ["Tested hypotheses"]
  },
  "methodology": {
    "researchDesign": "Design overview",
    "datasetOrParticipants": "Data or subjects used",
    "toolsAndFrameworks": ["Tools used"],
    "experimentalProcedure": "Step by step procedure",
    "evaluationMetrics": ["Metrics used"]
  },
  "findings": {
    "keyResults": ["Primary findings"],
    "quantitativeMetrics": [
      { "metricName": "Metric", "value": "Result value", "baselineOrComparison": "Baseline comparison" }
    ],
    "mainTakeaways": ["Main takeaways"],
    "unexpectedObservations": ["Any surprises"]
  },
  "limitations": {
    "methodologicalLimitations": ["Limitations"],
    "threatsToValidity": ["Threats"],
    "unaddressedAvenues": ["Unaddressed topics"],
    "futureResearchDirections": ["Future work"]
  }
}

RESEARCH PAPER TEXT:
`;
