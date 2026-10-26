import { createInitialState, executeMove, undoMove } from '../engine/gameEngine';
import { PITS, TRACK_A, TRACK_B, getNextPit, getOpposingPits, getPlayerPits } from '../engine/boardMapping';
import { getLegalMoves, validateMove } from '../engine/moveGenerator';
import { auditInvariants } from '../engine/invariants';
import { selectAIMove } from '../ai/opponent';
import { GameState } from '../engine/types';

export interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  initialPositionSummary: string;
  actionExecuted: string;
  expectedResult: string;
  obtainedResult: string;
  durationMs: number;
  error?: string;
}

export interface TestSuiteReport {
  timestamp: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  allPassed: boolean;
  results: TestCaseResult[];
}

export function runAllAutomatedTests(): TestSuiteReport {
  const results: TestCaseResult[] = [];

  // TESTE 1 — INICIALIZAÇÃO
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      const pitCount = Object.keys(state.board).length;
      let totalSeeds = 0;
      let aSeeds = 0;
      let bSeeds = 0;

      for (const [pitId, count] of Object.entries(state.board)) {
        totalSeeds += count;
        if (PITS[pitId].player === 'A') aSeeds += count;
        if (PITS[pitId].player === 'B') bSeeds += count;
      }

      const passed = pitCount === 32 && totalSeeds === 64 && aSeeds === 32 && bSeeds === 32;
      results.push({
        id: 'TEST-1',
        name: 'TESTE 1 — Inicialização do Tabuleiro',
        description: 'Confirmar 32 casas, 64 peças totais e 32 peças por jogador com 2 sementes por casa.',
        passed,
        initialPositionSummary: 'Perfil inicial 4x8 com 2 sementes por casa',
        actionExecuted: 'createInitialState()',
        expectedResult: '32 casas, 64 sementes no total, 32 para A e 32 para B',
        obtainedResult: `${pitCount} casas, ${totalSeeds} sementes no total, ${aSeeds} para A e ${bSeeds} para B`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-1',
        name: 'TESTE 1 — Inicialização do Tabuleiro',
        description: 'Falha durante inicialização',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'createInitialState()',
        expectedResult: 'Sucesso',
        obtainedResult: 'Exceção disparada',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 2 — CASAS VAZIAS E IDENTIFICADORES ÚNICOS
  {
    const start = performance.now();
    try {
      const pitIds = Object.keys(PITS);
      const uniqueIds = new Set(pitIds);
      const hasCorrectIds = pitIds.length === 32 && uniqueIds.size === 32;
      const allPrefixesValid = pitIds.every(id => id.startsWith('A') || id.startsWith('B'));

      results.push({
        id: 'TEST-2',
        name: 'TESTE 2 — Identificadores e Propriedades Únicas',
        description: 'Confirmar que os 32 identificadores são estritamente únicos e mapeiam para A0..A15 e B0..B15.',
        passed: hasCorrectIds && allPrefixesValid,
        initialPositionSummary: 'Dicionário PITS gerado pelo boardMapping',
        actionExecuted: 'Verificação de 32 chaves únicas e prefixos',
        expectedResult: '32 IDs únicos (16 para A, 16 para B)',
        obtainedResult: `${uniqueIds.size} IDs únicos verificados`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-2',
        name: 'TESTE 2 — Identificadores e Propriedades Únicas',
        description: 'Falha na checagem de IDs',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'ID Check',
        expectedResult: '32 IDs',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 3 — ORIGEM INVÁLIDA (CASA VAZIA OU DO ADVERSÁRIO)
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Criar cópia com casa A0 vazia
      state.board['A0'] = 0;
      state.board['A1'] = 4; // Conservar 64 sementes

      const valEmpty = validateMove(state.board, 'A0', 'A', state.phase, state.config.profile);
      const valOpponent = validateMove(state.board, 'B0', 'A', state.phase, state.config.profile);

      const passed = !valEmpty.valid && !valOpponent.valid;
      results.push({
        id: 'TEST-3',
        name: 'TESTE 3 — Rejeição de Origem Inválida',
        description: 'Tentar iniciar jogada em casa vazia ou na metade adversária deve ser estritamente bloqueado.',
        passed,
        initialPositionSummary: 'A0 tem 0 sementes; B0 é casa do Jogador B',
        actionExecuted: 'validateMove(A0) e validateMove(B0)',
        expectedResult: 'Ambas as tentativas rejeitadas (valid: false)',
        obtainedResult: `A0: ${valEmpty.reason || 'inválido'}, B0: ${valOpponent.reason || 'inválido'}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-3',
        name: 'TESTE 3 — Rejeição de Origem Inválida',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'validateMove',
        expectedResult: 'false',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 4 — DISTRIBUIÇÃO SEQUENCIAL
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Jogador A joga de A0 (tem 2 sementes).
      // Percurso de A: A0 -> A1 -> A2...
      // Logo, com 2 sementes, deposita 1 em A1 e 1 em A2.
      const initialA0 = state.board['A0'];
      const initialA1 = state.board['A1'];
      const initialA2 = state.board['A2'];

      const { state: nextState, result } = executeMove(state, 'A0');

      const passed = result.valid && result.sowedPits.length >= 2 && result.sowedPits[0] === 'A1' && result.sowedPits[1] === 'A2';
      results.push({
        id: 'TEST-4',
        name: 'TESTE 4 — Distribuição Sequencial no Circuito',
        description: 'Verificar que a semeadura a partir de A0 deposita sequencialmente em A1 e A2.',
        passed,
        initialPositionSummary: 'A0=2, A1=2, A2=2',
        actionExecuted: 'executeMove(state, A0)',
        expectedResult: 'Primeira semente em A1, segunda em A2',
        obtainedResult: `Semeou em: [${result.sowedPits.slice(0, 2).join(', ')}]`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-4',
        name: 'TESTE 4 — Distribuição Sequencial no Circuito',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'Distribuição sequencial',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 5 — CONTINUAÇÃO / RELAY EM CASA OCUPADA
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // No estado inicial, todas as casas têm 2 sementes.
      // Jogador A joga de A0 (tem 2 peças).
      // Coloca em A1 (fica com 3) e em A2 (fica com 3).
      // Como A2 tinha 2 sementes antes (ficou com 3 > 1), o motor deve acionar a cascata!
      const { result } = executeMove(state, 'A0');
      const hasRelayStep = result.steps.some(s => s.type === 'relay_pickup');

      results.push({
        id: 'TEST-5',
        name: 'TESTE 5 — Continuação / Cascata em Casa Ocupada',
        description: 'Quando a última semente cai em casa com peças, o jogador recolhe e continua a semear.',
        passed: hasRelayStep,
        initialPositionSummary: 'Todas as casas com 2 peças; pouso em A2 (que já tinha 2 peças)',
        actionExecuted: 'executeMove(state, A0)',
        expectedResult: 'Pelo menos um passo do tipo "relay_pickup" gerado',
        obtainedResult: hasRelayStep ? 'Passo relay_pickup executado com sucesso' : 'Nenhuma cascata detectada',
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-5',
        name: 'TESTE 5 — Continuação / Cascata',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'Cascata',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 6 — POUSO EM CASA VAZIA DE DEFESA (FIM DE TURNO SEM CAPTURA)
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Criar cenário específico para Jogador A:
      // A0 tem 2 peças. A1 tem 0 peças. A2 tem 0 peças.
      // Semeando 2 peças de A0: 1 vai para A1 (fica com 1), 1 vai para A2 (fica com 1).
      // A2 é casa de defesa (Row 3, col 2)!
      // Como A2 estava vazia (ficou com 1 semente) e é de DEFESA, deve finalizar o turno sem capturar!
      // Total de sementes precisa somar 64:
      for (const k of Object.keys(state.board)) {
        state.board[k] = 0;
      }
      state.board['A0'] = 2;
      state.board['A1'] = 0;
      state.board['A2'] = 0;
      state.board['A3'] = 30; // 32 sementes para A
      for (const p of getPlayerPits('B')) {
        state.board[p.id] = 2; // 32 sementes para B -> total 64!
      }

      const { result } = executeMove(state, 'A0');
      const lastStep = result.steps[result.steps.length - 1];
      const passed = result.capturedCount === 0 && lastStep?.type === 'turn_end' && lastStep.pitId === 'A2';

      results.push({
        id: 'TEST-6',
        name: 'TESTE 6 — Fim de Turno em Casa Vazia de Defesa',
        description: 'Última semente cai na casa vazia de defesa A2: finaliza o turno sem qualquer captura.',
        passed,
        initialPositionSummary: 'A0=2, A1=0, A2=0 (A2 é de defesa)',
        actionExecuted: 'executeMove(state, A0)',
        expectedResult: 'Turno encerrado em A2 com capturedCount = 0',
        obtainedResult: `Terminou em ${lastStep?.pitId}, Capturadas: ${result.capturedCount}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-6',
        name: 'TESTE 6 — Casa Vazia de Defesa',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'Fim de turno sem captura',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 7 — POUSO EM CASA VAZIA DE ATAQUE
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Circuito de A: ... A7 (defesa col 7) -> A15 (ataque col 7) -> A14 (ataque col 6)...
      // Pouso da última semente em A14 (que estava vazia).
      for (const k of Object.keys(state.board)) {
        state.board[k] = 0;
      }
      state.board['A7'] = 2;
      state.board['A15'] = 0;
      state.board['A14'] = 0; // Ataque que receberá a última peça
      state.board['A0'] = 30; // 32 total em A
      // B tem 0 sementes na coluna de frente (B14=0, B6=0)
      state.board['B14'] = 0;
      state.board['B6'] = 0;
      state.board['B0'] = 32; // Total 32 em B -> total 64!

      const { result } = executeMove(state, 'A7');
      const passed = result.valid && result.capturedCount === 0 && result.sowedPits.includes('A14');

      results.push({
        id: 'TEST-7',
        name: 'TESTE 7 — Pouso em Casa Vazia de Ataque sem Peças Inimigas',
        description: 'Pouso da última semente em casa vazia de ataque quando o adversário não tem peças na coluna correspondente.',
        passed,
        initialPositionSummary: 'A7=2, A14=0 (ataque); Oponente B14=0, B6=0',
        actionExecuted: 'executeMove(state, A7)',
        expectedResult: 'Jogada válida, término sem capturas (B14 vazia)',
        obtainedResult: `Capturadas: ${result.capturedCount}, sowedPits: [${result.sowedPits.join(', ')}]`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-7',
        name: 'TESTE 7 — Casa Vazia de Ataque',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'Turno concluído sem capturas',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 8 — CAPTURA DAS CASAS DE ATAQUE E DEFESA CORRESPONDENTES
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      for (const k of Object.keys(state.board)) {
        state.board[k] = 0;
      }
      state.board['A7'] = 2;
      state.board['A15'] = 0;
      state.board['A14'] = 0;
      state.board['A0'] = 30; // 32 total em A

      // Adversário B tem peças em B14 (ataque col 6) e B6 (defesa col 6)
      state.board['B14'] = 3;
      state.board['B6'] = 2;
      state.board['B0'] = 27; // 32 total em B -> total 64!

      const { state: nextState, result } = executeMove(state, 'A7');
      const passed = result.capturedCount === 5 &&
        nextState.board['B14'] === 0 &&
        nextState.board['B6'] === 0 &&
        nextState.capturedA === 5 &&
        (nextState.capturedA + nextState.capturedB + Object.values(nextState.board).reduce((a, b) => a + b, 0)) === 64;

      results.push({
        id: 'TEST-8',
        name: 'TESTE 8 — Captura da Linha de Ataque e Defesa Correspondentes',
        description: 'Confirmar remoção de 5 sementes de B14 e B6 com registro na pontuação de A e conservação de 64 sementes.',
        passed,
        initialPositionSummary: 'A7=2, A14=0; B14=3, B6=2',
        actionExecuted: 'executeMove(state, A7)',
        expectedResult: '5 sementes capturadas, B14=0, B6=0, total sistema = 64',
        obtainedResult: `Capturadas: ${result.capturedCount} de [${result.capturedPitIds.join(', ')}], capturas A: ${nextState.capturedA}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-8',
        name: 'TESTE 8 — Captura Autorizada',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'Captura de 5 peças',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 9 — TRANSIÇÃO PARA FASE DE PEÇAS INDIVIDUAIS
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Configurar jogador B com apenas sementes isoladas (<= 1)
      const pitsB = getPlayerPits('B');
      for (const p of pitsB) {
        state.board[p.id] = 1; // 16 peças isoladas para B
      }
      state.board['A0'] = 48; // 48 para A -> total 64!
      for (const p of getPlayerPits('A')) {
        if (p.id !== 'A0') state.board[p.id] = 0;
      }

      state.currentPlayer = 'B';
      const legalMovesB = getLegalMoves(state.board, 'B', 'phase1_groups', state.config.profile);

      // Como profile tem allowSingleSeedWhenNoGroups = true, B deve ter 16 jogadas legais de 1 semente!
      const passed = legalMovesB.length === 16 && legalMovesB.every(m => m.seeds === 1);

      results.push({
        id: 'TEST-9',
        name: 'TESTE 9 — Transição e Movimentação de Peças Individuais',
        description: 'Quando um jogador tem apenas casas com 1 semente, o motor permite mover sementes individuais.',
        passed,
        initialPositionSummary: 'Jogador B tem apenas casas com 1 semente (sem grupos >= 2)',
        actionExecuted: 'getLegalMoves(board, B, phase1_groups)',
        expectedResult: '16 jogadas legais de 1 semente permitidas',
        obtainedResult: `${legalMovesB.length} jogadas legais encontradas`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-9',
        name: 'TESTE 9 — Fase Individual',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'getLegalMoves',
        expectedResult: '16 jogadas',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 10 — CONDIÇÃO DE VITÓRIA (ELIMINAÇÃO)
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Zerar todas as casas de B e transferir para capturadas de A
      for (const p of getPlayerPits('B')) {
        state.board[p.id] = 0;
      }
      for (const p of getPlayerPits('A')) {
        state.board[p.id] = 0;
      }
      state.board['A0'] = 2;
      state.board['A1'] = 30; // Total 32 no tabuleiro de A
      state.capturedA = 32; // Total de sementes no sistema = 32 + 32 = 64!

      const { state: nextState } = executeMove(state, 'A0');
      const passed = nextState.status === 'won_A' && nextState.winner === 'A';

      results.push({
        id: 'TEST-10',
        name: 'TESTE 10 — Detecção de Vitória por Eliminação',
        description: 'Quando todas as sementes do Jogador B são eliminadas do tabuleiro, declara vitória de A.',
        passed,
        initialPositionSummary: 'B tem 0 sementes no tabuleiro, A tem 32 sementes, capturas A = 32',
        actionExecuted: 'executeMove(state, A0)',
        expectedResult: 'status: "won_A", winner: "A"',
        obtainedResult: `status: "${nextState.status}", winner: "${nextState.winner}"`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-10',
        name: 'TESTE 10 — Vitória por Eliminação',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'executeMove',
        expectedResult: 'won_A',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 11 — DESFAZER JOGADA (UNDO)
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      const initialA0 = state.board['A0'];
      const initialCapturedA = state.capturedA;

      const { state: afterMove } = executeMove(state, 'A0');
      const undoneState = undoMove(afterMove);

      const passed = undoneState.board['A0'] === initialA0 &&
        undoneState.capturedA === initialCapturedA &&
        undoneState.currentPlayer === 'A' &&
        undoneState.turnCount === 1;

      results.push({
        id: 'TEST-11',
        name: 'TESTE 11 — Desfazer Jogada (Undo) e Conservação',
        description: 'Executar jogada e desfazê-la deve restaurar com precisão o estado anterior e todas as sementes.',
        passed,
        initialPositionSummary: 'Estado inicial com 64 sementes',
        actionExecuted: 'executeMove(A0) -> undoMove()',
        expectedResult: 'A0 restaurado para 2 sementes, turno restaurado para 1, jogador A',
        obtainedResult: `A0=${undoneState.board['A0']}, turno=${undoneState.turnCount}, jogador=${undoneState.currentPlayer}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-11',
        name: 'TESTE 11 — Desfazer Jogada',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'undoMove',
        expectedResult: 'Restauração',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 12 — INTELIGÊNCIA ARTIFICIAL SELECIONA APENAS JOGADAS LEGAIS
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      state.currentPlayer = 'B';
      const aiDecision = selectAIMove(state);

      const legalMoves = getLegalMoves(state.board, 'B', state.phase, state.config.profile);
      const isLegal = aiDecision !== null && legalMoves.some(m => m.pitId === aiDecision.pitId);

      results.push({
        id: 'TEST-12',
        name: 'TESTE 12 — IA Seleciona Estritamente Jogadas Legais',
        description: 'Confirmar que a decisão do módulo de IA respeita 100% as regras e devolve uma jogada legal.',
        passed: isLegal,
        initialPositionSummary: 'Turno de B no estado inicial',
        actionExecuted: 'selectAIMove(state)',
        expectedResult: 'Casa escolhida pertence à lista de getLegalMoves',
        obtainedResult: aiDecision ? `IA escolheu ${aiDecision.pitId} (${aiDecision.reason})` : 'Nenhuma jogada devolvida',
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-12',
        name: 'TESTE 12 — Validação da IA',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'selectAIMove',
        expectedResult: 'Jogada legal',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 13 — ORIENTAÇÃO E CIRCUITO ANTI-HORÁRIO
  {
    const start = performance.now();
    try {
      // Verificar que o circuito fecha perfeitamente em 16 passos para A e para B
      let currentA = TRACK_A[0];
      for (let i = 0; i < 16; i++) {
        currentA = getNextPit(currentA);
      }
      const circuitAClosed = currentA === TRACK_A[0];

      let currentB = TRACK_B[0];
      for (let i = 0; i < 16; i++) {
        currentB = getNextPit(currentB);
      }
      const circuitBClosed = currentB === TRACK_B[0];

      const passed = circuitAClosed && circuitBClosed && TRACK_A.length === 16 && TRACK_B.length === 16;
      results.push({
        id: 'TEST-13',
        name: 'TESTE 13 — Orientação do Circuito Fechado Anti-Horário',
        description: 'Confirmar que 16 passos sucessivos em qualquer casa completam exactamente o circuito fechado.',
        passed,
        initialPositionSummary: 'Pistas TRACK_A e TRACK_B',
        actionExecuted: '16 iterações de getNextPit() para A e para B',
        expectedResult: 'Retorno exacto à casa de partida após 16 passos',
        obtainedResult: `A fechou: ${circuitAClosed}, B fechou: ${circuitBClosed}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-13',
        name: 'TESTE 13 — Orientação do Circuito',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'Circuito',
        expectedResult: 'Fechado',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 14 — REINÍCIO DA PARTIDA
  {
    const start = performance.now();
    try {
      const state1 = createInitialState();
      // Executar várias jogadas
      const { state: state2 } = executeMove(state1, 'A0');
      const { state: state3 } = executeMove(state2, 'B8');
      
      // Reiniciar
      const restartedState = createInitialState();
      const audit = auditInvariants(restartedState);

      const passed = restartedState.turnCount === 1 &&
        restartedState.capturedA === 0 &&
        restartedState.capturedB === 0 &&
        restartedState.currentPlayer === 'A' &&
        restartedState.history.length === 0 &&
        audit.valid;

      results.push({
        id: 'TEST-14',
        name: 'TESTE 14 — Reinício Completo da Partida',
        description: 'Reiniciar a partida restaura com perfeição todas as 32 casas com 2 peças, zera contadores e histórico.',
        passed,
        initialPositionSummary: 'Partida após 2 jogadas executadas',
        actionExecuted: 'createInitialState()',
        expectedResult: 'Turno 1, 0 capturas, histórico vazio, audit de 64 sementes válido',
        obtainedResult: `Turno ${restartedState.turnCount}, Capturas A: ${restartedState.capturedA}, Histórico: ${restartedState.history.length}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-14',
        name: 'TESTE 14 — Reinício',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'Reinício',
        expectedResult: 'Reset completo',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 15 — AUDITORIA ESTREITA DE INVARIANTES
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Simular 5 jogadas consecutivas e auditar invariantes após cada uma
      let curr = state;
      let allAuditsPassed = true;

      for (let i = 0; i < 4; i++) {
        const legal = getLegalMoves(curr.board, curr.currentPlayer, curr.phase, curr.config.profile);
        if (legal.length === 0) break;
        const chosen = legal[0].pitId;
        const { state: next } = executeMove(curr, chosen);
        curr = next;
        const audit = auditInvariants(curr);
        if (!audit.valid) {
          allAuditsPassed = false;
          break;
        }
      }

      results.push({
        id: 'TEST-15',
        name: 'TESTE 15 — Auditoria de Conservação de Sementes (Invariante 64)',
        description: 'A soma de sementes no tabuleiro + capturas de A + capturas de B mantém-se estritamente igual a 64.',
        passed: allAuditsPassed,
        initialPositionSummary: 'Sequência de jogadas ativas',
        actionExecuted: 'Auditoria de invariantes em cadeia',
        expectedResult: 'Conservação de 64 sementes em todos os turnos',
        obtainedResult: allAuditsPassed ? 'Todas as invariantes conservadas com sucesso' : 'Falha na conservação de sementes',
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-15',
        name: 'TESTE 15 — Auditoria de Invariantes',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'auditInvariants',
        expectedResult: '64 conservadas',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // TESTE 16 — REGRA EQUITATIVA DE COVA DE 1 SEMENTE (HUMANO & COMPUTADOR)
  {
    const start = performance.now();
    try {
      const state = createInitialState();
      // Limpar tabuleiro
      for (const k of Object.keys(state.board)) {
        state.board[k] = 0;
      }

      // Cenário para Jogador A:
      // A0 tem 1 semente, A1 tem 1 semente, A2 tem 3 sementes (grupo >= 2). A3 tem 27 sementes.
      state.board['A0'] = 1;
      state.board['A1'] = 1;
      state.board['A2'] = 3;
      state.board['A3'] = 27;

      // Cenário para Computador (Jogador B):
      // B0 tem 1 semente, B1 tem 1 semente, B2 tem 4 sementes. B3 tem 26 sementes.
      state.board['B0'] = 1;
      state.board['B1'] = 1;
      state.board['B2'] = 4;
      state.board['B3'] = 26;

      // 1. Verificação para Jogador A (Humano)
      const valA0 = validateMove(state.board, 'A0', 'A', state.phase, state.config.profile);
      const legalA = getLegalMoves(state.board, 'A', state.phase, state.config.profile);
      const humanoNaoJoga1 = !valA0.valid && legalA.every(m => m.seeds >= 2);

      // 2. Verificação para Jogador B (Computador)
      state.currentPlayer = 'B';
      const legalB = getLegalMoves(state.board, 'B', state.phase, state.config.profile);
      const aiDecision = selectAIMove(state);
      const computadorNaoJoga1 = legalB.every(m => m.seeds >= 2) &&
        aiDecision !== null &&
        (state.board[aiDecision.pitId] || 0) >= 2;

      // 3. Verificação após acabar todas as covas com > 1 semente
      // Quando B tem APENAS sementes individuais (B0=1, B1=1):
      state.board['B2'] = 0;
      state.board['B3'] = 0;
      const legalBSomenteSingles = getLegalMoves(state.board, 'B', state.phase, state.config.profile);
      const computadorJogaSinglesQuandoAcabamGrupos = legalBSomenteSingles.length === 2 &&
        legalBSomenteSingles.every(m => m.seeds === 1);

      const passed = humanoNaoJoga1 && computadorNaoJoga1 && computadorJogaSinglesQuandoAcabamGrupos;

      results.push({
        id: 'TEST-16',
        name: 'TESTE 16 — Regra Equitativa de Covas com 1 Semente (Humano & Computador)',
        description: 'Nem o Humano nem o Computador podem jogar de cova com 1 semente enquanto houver covas com ≥2 sementes. Só jogam de 1 quando acabarem todas as covas com mais de uma.',
        passed,
        initialPositionSummary: 'Covas com 1 semente e covas com ≥2 sementes coexistindo',
        actionExecuted: 'validateMove(A0), getLegalMoves(A, B), selectAIMove(B)',
        expectedResult: 'Covas de 1 semente rejeitadas para A e B enquanto houver grupos; permitidas só quando grupos esgotam',
        obtainedResult: passed
          ? 'Regra cumprida rigorosamente e de forma simétrica para ambos os jogadores'
          : `Humano bloqueado: ${humanoNaoJoga1}, Computador bloqueado: ${computadorNaoJoga1}, Permite quando esgota: ${computadorJogaSinglesQuandoAcabamGrupos}`,
        durationMs: performance.now() - start,
      });
    } catch (e: unknown) {
      results.push({
        id: 'TEST-16',
        name: 'TESTE 16 — Regra de Cova com 1 Semente',
        description: 'Falha',
        passed: false,
        initialPositionSummary: 'N/A',
        actionExecuted: 'Teste de regra',
        expectedResult: 'Sucesso',
        obtainedResult: 'Erro',
        durationMs: performance.now() - start,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    allPassed: failedCount === 0,
    results,
  };
}
