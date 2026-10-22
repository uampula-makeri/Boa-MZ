import { PitDefinition, Player, PitType } from './types';

/**
 * Definições e Mapeamento de Casas do Tabuleiro do Ntxuva (4x8 = 32 casas)
 * 
 * Fila 0: Jogador B - Defesa  [B0..B7]
 * Fila 1: Jogador B - Ataque  [B8..B15]
 * Fila 2: Jogador A - Ataque  [A8..A15]
 * Fila 3: Jogador A - Defesa  [A0..A7]
 */

export const PITS: Record<string, PitDefinition> = {};
export const TRACK_A: string[] = [];
export const TRACK_B: string[] = [];

// Inicializar definições para Jogador A
// Fila 3: Defesa A0..A7 (col 0 a 7)
for (let col = 0; col < 8; col++) {
  const id = `A${col}`;
  PITS[id] = {
    id,
    player: 'A',
    row: 3,
    col,
    type: 'defense',
    trackIndex: col, // 0..7
  };
}
// Fila 2: Ataque A8..A15 (col 0 a 7, mas percurso anti-horário vai de col 7 para col 0: A15 down to A8)
for (let col = 0; col < 8; col++) {
  const id = `A${8 + col}`;
  // No percurso anti-horário: A0..A7 (índices 0..7), depois A15 (col 7, idx 8) até A8 (col 0, idx 15)
  const trackIdx = 8 + (7 - col);
  PITS[id] = {
    id,
    player: 'A',
    row: 2,
    col,
    type: 'attack',
    trackIndex: trackIdx,
  };
}

// Inicializar definições para Jogador B
// Fila 0: Defesa B0..B7 (col 0 a 7)
// Fila 1: Ataque B8..B15 (col 0 a 7)
// No percurso anti-horário de B:
// Começa na linha de ataque B8..B15 (col 0 a 7, índices 0..7)
// Sobe para B7 (col 7, idx 8) e percorre B7..B0 (col 7 down to 0, índices 8..15)
for (let col = 0; col < 8; col++) {
  const attackId = `B${8 + col}`;
  PITS[attackId] = {
    id: attackId,
    player: 'B',
    row: 1,
    col,
    type: 'attack',
    trackIndex: col, // 0..7
  };
  
  const defId = `B${col}`;
  const defTrackIdx = 8 + (7 - col); // 8..15
  PITS[defId] = {
    id: defId,
    player: 'B',
    row: 0,
    col,
    type: 'defense',
    trackIndex: defTrackIdx,
  };
}

// Preencher arrays ordenados de percurso TRACK_A e TRACK_B
for (let i = 0; i < 16; i++) {
  const pitA = Object.values(PITS).find(p => p.player === 'A' && p.trackIndex === i);
  if (pitA) TRACK_A.push(pitA.id);
  
  const pitB = Object.values(PITS).find(p => p.player === 'B' && p.trackIndex === i);
  if (pitB) TRACK_B.push(pitB.id);
}

/**
 * Obtém a próxima casa no circuito anti-horário do jogador
 */
export function getNextPit(pitId: string): string {
  const pit = PITS[pitId];
  if (!pit) throw new Error(`Casa inválida: ${pitId}`);
  
  const track = pit.player === 'A' ? TRACK_A : TRACK_B;
  const currentIdx = pit.trackIndex;
  const nextIdx = (currentIdx + 1) % 16;
  return track[nextIdx];
}

/**
 * Retorna as casas correspondentes do adversário para efeito de captura
 * Quando um jogador cai na sua linha de ataque (Row 2 para A, Row 1 para B):
 * - facingAttackPit: casa de ataque do adversário na mesma coluna
 * - facingDefensePit: casa de defesa do adversário na mesma coluna
 */
export function getOpposingPits(pitId: string): { facingAttack: string | null; facingDefense: string | null } {
  const pit = PITS[pitId];
  if (!pit) return { facingAttack: null, facingDefense: null };
  
  if (pit.type !== 'attack') {
    return { facingAttack: null, facingDefense: null };
  }
  
  const col = pit.col;
  if (pit.player === 'A') {
    return {
      facingAttack: `B${8 + col}`, // Fila 1 de B
      facingDefense: `B${col}`,   // Fila 0 de B
    };
  } else {
    return {
      facingAttack: `A${8 + col}`, // Fila 2 de A
      facingDefense: `A${col}`,   // Fila 3 de A
    };
  }
}

/**
 * Retorna todas as casas de um jogador
 */
export function getPlayerPits(player: Player): PitDefinition[] {
  return Object.values(PITS).filter(p => p.player === player);
}

/**
 * Retorna as casas de ataque de um jogador
 */
export function getPlayerAttackPits(player: Player): PitDefinition[] {
  return Object.values(PITS).filter(p => p.player === player && p.type === 'attack');
}

/**
 * Retorna as casas de defesa de um jogador
 */
export function getPlayerDefensePits(player: Player): PitDefinition[] {
  return Object.values(PITS).filter(p => p.player === player && p.type === 'defense');
}
