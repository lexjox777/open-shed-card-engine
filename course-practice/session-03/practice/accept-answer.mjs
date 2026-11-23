import { coachScenario } from '../src/scenarios.mjs';

// Input is untrusted JSON text; return true only for the exact scenario contract.
export function acceptAnswer(text, scenarioId) {
  const scenario = coachScenario(scenarioId);
  if (!scenario) return false;

  let answer;
  try {
    answer = JSON.parse(text);
  } catch {
    return false;
  }

  if (answer === null || typeof answer !== 'object' || Array.isArray(answer)) {
    return false;
  }

  const fields = ['kind', 'ruleId', 'cardId', 'explanation'];
  const keys = Object.keys(answer);
  if (keys.length !== fields.length || !fields.every(field => Object.hasOwn(answer, field))) {
    return false;
  }

  const cardId = scenario.id === 'suggest' ? 'practice-red-3' : null;
  return answer.kind === scenario.kind
    && answer.ruleId === scenario.rule
    && answer.cardId === cardId
    && typeof answer.explanation === 'string'
    && answer.explanation.length >= 10
    && answer.explanation.length <= 1200;
}
