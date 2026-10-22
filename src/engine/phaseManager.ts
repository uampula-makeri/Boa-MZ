import { GamePhase, Player, RuleProfile } from './types';
import { getPlayerPits } from './boardMapping';

/**
 * Verifica se um jogador ou o jogo deve transitar para a Fase 2 (Peças Individuais)
 */
export function checkPhaseTransition(
  board: Record<string, number>,
  player: Player,
  currentPhase: GamePhase,
  profile: RuleProfile
): { newPhase: GamePhase; changed: boolean; reason?: string } {
  if (currentPhase === 'phase2_singles') {
    // Já está na fase 2
    return { newPhase: 'phase2_singles', changed: false };
  }

  if (!profile.autoPhase2Transition) {
    return { newPhase: currentPhase, changed: false };
  }

  // Verificar se o jogador tem alguma casa com >= 2 sementes
  const playerPits = getPlayerPits(player);
  const hasGroups = playerPits.some(p => (board[p.id] || 0) >= 2);

  if (!hasGroups) {
    const totalSeeds = playerPits.reduce((acc, p) => acc + (board[p.id] || 0), 0);
    if (totalSeeds > 0) {
      return {
        newPhase: 'phase2_singles',
        changed: true,
        reason: `Jogador ${player} ficou apenas com peças isoladas (sem grupos >= 2). Activação da Fase 2.`
      };
    }
  }

  return { newPhase: 'phase1_groups', changed: false };
}

/**
 * Determina se uma casa com semente única pode ser movida pelo jogador
 */
export function canMoveSingleSeed(
  board: Record<string, number>,
  player: Player,
  currentPhase: GamePhase,
  profile: RuleProfile
): boolean {
  if (currentPhase === 'phase2_singles') {
    return true;
  }
  
  if (profile.allowSingleSeedWhenNoGroups) {
    const playerPits = getPlayerPits(player);
    const hasGroups = playerPits.some(p => (board[p.id] || 0) >= 2);
    return !hasGroups; // Se não tem grupos, pode mover sementes únicas
  }
  
  return false;
}
