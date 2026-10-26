import { Player, RuleProfile, MoveStep, GamePhase } from './types';
import { PITS, getNextPit } from './boardMapping';
import { evaluateCapture } from './capture';

export interface SowingResult {
  steps: MoveStep[];
  sowedPits: string[];
  capturedCount: number;
  capturedPitIds: string[];
  boardAfter: Record<string, number>;
  lastLandingPitId: string;
  loopDetected: boolean;
  reason?: string;
}

/**
 * Executa a semeadura completa e determinística a partir de uma casa de origem
 */
export function executeSowing(
  initialBoard: Record<string, number>,
  originPitId: string,
  player: Player,
  phase: GamePhase,
  profile: RuleProfile
): SowingResult {
  const board = { ...initialBoard };
  const steps: MoveStep[] = [];
  const sowedPits: string[] = [];
  let capturedCount = 0;
  const capturedPitIds: string[] = [];
  
  let currentPitId = originPitId;
  let seedsInHand = board[originPitId] || 0;
  board[originPitId] = 0;

  steps.push({
    type: 'pickup',
    pitId: originPitId,
    seedsDelta: -seedsInHand,
    seedsNow: 0,
    seedsInHand,
    player,
    note: `Recolha de ${seedsInHand} semente(s) da casa ${originPitId}`,
  });

  let relayCount = 0;
  let loopDetected = false;
  let lastLandingPitId = originPitId;

  while (seedsInHand > 0) {
    // Distribuir sementes 1 a 1 ao longo do circuito
    while (seedsInHand > 0) {
      currentPitId = getNextPit(currentPitId);
      sowedPits.push(currentPitId);
      board[currentPitId] = (board[currentPitId] || 0) + 1;
      seedsInHand--;

      steps.push({
        type: 'sow',
        pitId: currentPitId,
        seedsDelta: +1,
        seedsNow: board[currentPitId],
        seedsInHand,
        player,
        note: `Distribuição de 1 semente em ${currentPitId} (total: ${board[currentPitId]})`,
      });
    }

    lastLandingPitId = currentPitId;
    const landingPitDef = PITS[lastLandingPitId];
    const seedsAtLanding = board[lastLandingPitId];

    // Verificar se caiu em casa que já continha peças (agora tem > 1)
    if (seedsAtLanding > 1 && profile.relayIfOccupied) {
      relayCount++;
      if (relayCount > profile.maxRelayIterations) {
        loopDetected = true;
        steps.push({
          type: 'turn_end',
          pitId: lastLandingPitId,
          seedsDelta: 0,
          seedsNow: board[lastLandingPitId],
          seedsInHand: 0,
          player,
          note: `Prevenção de ciclo infinito: limite de ${profile.maxRelayIterations} repetições atingido.`,
        });
        break;
      }

      // Recolher todas as sementes desta casa e continuar a cascata
      seedsInHand = board[lastLandingPitId];
      board[lastLandingPitId] = 0;

      steps.push({
        type: 'relay_pickup',
        pitId: lastLandingPitId,
        seedsDelta: -seedsInHand,
        seedsNow: 0,
        seedsInHand,
        player,
        note: `Cascata em ${lastLandingPitId}: recolha de ${seedsInHand} sementes para continuar a semeadura.`,
      });
      continue;
    }

    // Se a casa ficou com exactamente 1 semente, significa que estava vazia antes de receber a última peça
    if (seedsAtLanding === 1) {
      if (landingPitDef.type === 'defense') {
        // Pouso em casa vazia de defesa -> fim de turno
        steps.push({
          type: 'turn_end',
          pitId: lastLandingPitId,
          seedsDelta: 0,
          seedsNow: board[lastLandingPitId],
          seedsInHand: 0,
          player,
          note: `Última semente em casa vazia de defesa (${lastLandingPitId}). Turno finalizado.`,
        });
        break;
      } else if (landingPitDef.type === 'attack') {
        // Pouso em casa vazia de ataque -> verificar captura
        if (profile.emptyAttackTriggersCapture) {
          const captureResult = evaluateCapture(lastLandingPitId, board, profile);
          if (captureResult.canCapture) {
            // Executar captura: registar passo individual para cada cova adversária capturada
            for (const cPitId of captureResult.capturedPitIds) {
              const count = board[cPitId] || 0;
              board[cPitId] = 0;
              capturedPitIds.push(cPitId);
              capturedCount += count;

              steps.push({
                type: 'capture',
                pitId: cPitId,
                seedsDelta: count,
                seedsNow: 0,
                seedsInHand: count,
                player,
                note: `Recolha de ${count} semente(s) capturada(s) da cova adversária ${cPitId}`,
              });
            }

            if (profile.relayAfterCapture) {
              seedsInHand = captureResult.totalCaptured;
              // Continuar semeadura com peças capturadas se perfil permitir
              continue;
            } else {
              // Padrão tradicional: captura encerra o turno
              steps.push({
                type: 'turn_end',
                pitId: lastLandingPitId,
                seedsDelta: 0,
                seedsNow: board[lastLandingPitId],
                seedsInHand: 0,
                player,
                note: `Captura concluída. Turno de ${player} encerrado.`,
              });
              break;
            }
          } else {
            // Não havia peças elegíveis para captura na coluna adversária
            steps.push({
              type: 'turn_end',
              pitId: lastLandingPitId,
              seedsDelta: 0,
              seedsNow: board[lastLandingPitId],
              seedsInHand: 0,
              player,
              note: `Última semente em casa vazia de ataque (${lastLandingPitId}), mas sem sementes adversárias para capturar. Turno encerrado.`,
            });
            break;
          }
        } else {
          steps.push({
            type: 'turn_end',
            pitId: lastLandingPitId,
            seedsDelta: 0,
            seedsNow: board[lastLandingPitId],
            seedsInHand: 0,
            player,
            note: `Turno encerrado em ${lastLandingPitId}.`,
          });
          break;
        }
      }
    }

    // Se chegou aqui sem recolha, encerra
    break;
  }

  return {
    steps,
    sowedPits,
    capturedCount,
    capturedPitIds,
    boardAfter: board,
    lastLandingPitId,
    loopDetected,
  };
}
