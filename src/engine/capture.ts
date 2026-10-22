import { Player, RuleProfile } from './types';
import { getOpposingPits } from './boardMapping';

export interface CaptureEvaluation {
  canCapture: boolean;
  attackPitId: string | null;
  attackSeeds: number;
  defensePitId: string | null;
  defenseSeeds: number;
  totalCaptured: number;
  capturedPitIds: string[];
}

/**
 * Avalia se o pouso numa casa de ataque desencadeia captura de peças do adversário
 */
export function evaluateCapture(
  landingPitId: string,
  board: Record<string, number>,
  profile: RuleProfile
): CaptureEvaluation {
  const { facingAttack, facingDefense } = getOpposingPits(landingPitId);

  if (!facingAttack) {
    return {
      canCapture: false,
      attackPitId: null,
      attackSeeds: 0,
      defensePitId: null,
      defenseSeeds: 0,
      totalCaptured: 0,
      capturedPitIds: [],
    };
  }

  const attackSeeds = board[facingAttack] || 0;
  const defenseSeeds = facingDefense ? (board[facingDefense] || 0) : 0;

  // Regra padrão: A linha de ataque do adversário deve conter sementes (>= 1)
  if (profile.captureRequiresAttackOccupied && attackSeeds === 0) {
    return {
      canCapture: false,
      attackPitId: facingAttack,
      attackSeeds: 0,
      defensePitId: facingDefense,
      defenseSeeds,
      totalCaptured: 0,
      capturedPitIds: [],
    };
  }

  const capturedPitIds: string[] = [];
  let totalCaptured = 0;

  if (attackSeeds > 0) {
    capturedPitIds.push(facingAttack);
    totalCaptured += attackSeeds;
  }

  if (profile.captureScope === 'attack_and_defense' && facingDefense && defenseSeeds > 0) {
    capturedPitIds.push(facingDefense);
    totalCaptured += defenseSeeds;
  }

  return {
    canCapture: totalCaptured > 0,
    attackPitId: facingAttack,
    attackSeeds,
    defensePitId: facingDefense,
    defenseSeeds,
    totalCaptured,
    capturedPitIds,
  };
}
