import { Player, RuleProfile, GamePhase } from '../engine/types';
import { getLegalMoves } from '../engine/moveGenerator';
import { executeSowing } from '../engine/sowing';
import { evaluatePosition } from './evaluation';
import { checkPhaseTransition } from '../engine/phaseManager';

export interface MinimaxSearchResult {
  bestMovePitId: string | null;
  bestScore: number;
  nodesEvaluated: number;
}

/**
 * Pesquisa Minimax com poda Alfa-Beta para o Ntxuva
 */
export function minimaxAlphaBeta(
  board: Record<string, number>,
  capturedMe: number,
  capturedOpp: number,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  me: Player,
  phase: GamePhase,
  profile: RuleProfile
): { score: number; bestPitId: string | null; nodes: number } {
  const currentActor: Player = isMaximizing ? me : (me === 'A' ? 'B' : 'A');
  const legalMoves = getLegalMoves(board, currentActor, phase, profile);

  // Caso terminal ou profundidade limite
  if (depth === 0 || legalMoves.length === 0) {
    const score = evaluatePosition(board, capturedMe, capturedOpp, me, phase, profile);
    return { score, bestPitId: null, nodes: 1 };
  }

  let totalNodes = 1;
  let bestPitId: string | null = legalMoves[0].pitId;

  if (isMaximizing) {
    let maxEval = -Infinity;
    // Ordenar jogadas dando prioridade a capturas (move ordering melhora poda alfa-beta)
    legalMoves.sort((a, b) => b.expectedCaptures - a.expectedCaptures);

    for (const move of legalMoves) {
      const sim = executeSowing(board, move.pitId, currentActor, phase, profile);
      const newCapturedMe = capturedMe + sim.capturedCount;
      const nextPhaseCheck = checkPhaseTransition(sim.boardAfter, me === 'A' ? 'B' : 'A', phase, profile);

      const evaluation = minimaxAlphaBeta(
        sim.boardAfter,
        newCapturedMe,
        capturedOpp,
        depth - 1,
        alpha,
        beta,
        false,
        me,
        nextPhaseCheck.newPhase,
        profile
      );

      totalNodes += evaluation.nodes;

      if (evaluation.score > maxEval) {
        maxEval = evaluation.score;
        bestPitId = move.pitId;
      }
      alpha = Math.max(alpha, evaluation.score);
      if (beta <= alpha) {
        break; // Poda Beta
      }
    }

    return { score: maxEval, bestPitId, nodes: totalNodes };
  } else {
    let minEval = Infinity;
    legalMoves.sort((a, b) => b.expectedCaptures - a.expectedCaptures);

    for (const move of legalMoves) {
      const sim = executeSowing(board, move.pitId, currentActor, phase, profile);
      const newCapturedOpp = capturedOpp + sim.capturedCount;
      const nextPhaseCheck = checkPhaseTransition(sim.boardAfter, me, phase, profile);

      const evaluation = minimaxAlphaBeta(
        sim.boardAfter,
        capturedMe,
        newCapturedOpp,
        depth - 1,
        alpha,
        beta,
        true,
        me,
        nextPhaseCheck.newPhase,
        profile
      );

      totalNodes += evaluation.nodes;

      if (evaluation.score < minEval) {
        minEval = evaluation.score;
        bestPitId = move.pitId;
      }
      beta = Math.min(beta, evaluation.score);
      if (beta <= alpha) {
        break; // Poda Alfa
      }
    }

    return { score: minEval, bestPitId, nodes: totalNodes };
  }
}
