import React, { useState, useMemo, useRef } from 'react';
import { PitDefinition, Player, GamePhase, RuleProfile } from '../engine/types';
import { PITS, getOpposingPits } from '../engine/boardMapping';
import { Pit } from './Pit';
import { LegalMoveInfo } from '../engine/moveGenerator';
import { executeSowing } from '../engine/sowing';
import { useLanguage } from '../i18n/LanguageContext';
import { Sun, Maximize2, Minimize2, Hand } from 'lucide-react';
import { HumanHand } from './HumanHand';

interface BoardProps {
  board: Record<string, number>;
  currentPlayer: Player;
  phase: GamePhase;
  capturedA: number;
  capturedB: number;
  legalMoves: LegalMoveInfo[];
  selectedPitId: string | null;
  sowedPitIdsInTurn: string[];
  capturedPitIdsInTurn: string[];
  isThinkingAI: boolean;
  showCoordinates: boolean;
  profile: RuleProfile;
  // Props de semeadura física e animação de mão
  currentActivePitId?: string | null;
  seedsInHand?: number | null;
  activeStepNote?: string | null;
  lastLandingPitId?: string | null;
  stepType?: 'pickup' | 'sow' | 'relay_pickup' | 'capture' | 'turn_end' | null;
  actingPlayer?: Player;
  animationSpeedMs?: number;
  showHumanHand?: boolean;
  isFullscreen?: boolean;
  onSelectPit: (pitId: string) => void;
  onOpenAuthenticShowcase?: () => void;
  onToggleFullscreen?: () => void;
  onToggleHand?: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  phase,
  capturedA,
  capturedB,
  legalMoves,
  selectedPitId,
  sowedPitIdsInTurn,
  capturedPitIdsInTurn,
  isThinkingAI,
  showCoordinates,
  profile,
  currentActivePitId,
  seedsInHand,
  activeStepNote,
  lastLandingPitId,
  stepType,
  actingPlayer,
  animationSpeedMs = 75,
  showHumanHand = true,
  isFullscreen = false,
  onSelectPit,
  onOpenAuthenticShowcase,
  onToggleFullscreen,
  onToggleHand,
}) => {
  const { t } = useLanguage();
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPitId, setHoveredPitId] = useState<string | null>(null);
  // Nível de claridade da madeira: 'extra_clara' vs 'clara_natural'
  const [woodBrightness, setWoodBrightness] = useState<'extra_clara' | 'clara_natural'>('extra_clara');

  const legalMoveIds = useMemo(() => new Set(legalMoves.map(m => m.pitId)), [legalMoves]);

  // Simulação da trajectória quando o jogador passa o cursor sobre uma casa jogável (desabilitada durante a semeadura activa)
  const previewSowing = useMemo(() => {
    if (!hoveredPitId || !legalMoveIds.has(hoveredPitId) || currentActivePitId) return null;
    try {
      return executeSowing(board, hoveredPitId, currentPlayer, phase, profile);
    } catch {
      return null;
    }
  }, [hoveredPitId, legalMoveIds, board, currentPlayer, phase, profile, currentActivePitId]);

  // Determinar casas sob mira da jogada selecionada ou sob o cursor
  const activeFocusPitId = hoveredPitId || selectedPitId;
  const targetPits: string[] = useMemo(() => {
    if (!activeFocusPitId) return [];
    const opposing = getOpposingPits(activeFocusPitId);
    const targets: string[] = [];
    if (opposing.facingAttack) targets.push(opposing.facingAttack);
    if (profile.captureScope === 'attack_and_defense' && opposing.facingDefense) {
      targets.push(opposing.facingDefense);
    }
    return targets;
  }, [activeFocusPitId, profile.captureScope]);

  // Estruturas O(1) de alta performance para evitar lentidão e repetições de busca
  const sowedSet = useMemo(() => new Set(sowedPitIdsInTurn), [sowedPitIdsInTurn]);
  const capturedSet = useMemo(() => new Set(capturedPitIdsInTurn), [capturedPitIdsInTurn]);
  const targetSet = useMemo(() => new Set(targetPits), [targetPits]);
  const previewSowedSet = useMemo(() => new Set(previewSowing?.sowedPits || []), [previewSowing]);
  const previewCapturedSet = useMemo(() => new Set(previewSowing?.capturedPitIds || []), [previewSowing]);

  const sowStepMap = useMemo(() => {
    const map = new Map<string, number>();
    if (sowedPitIdsInTurn.length > 0) {
      sowedPitIdsInTurn.forEach((pId, idx) => map.set(pId, idx + 1));
    } else if (previewSowing) {
      previewSowing.sowedPits.forEach((pId, idx) => {
        if (!map.has(pId)) map.set(pId, idx + 1);
      });
    }
    return map;
  }, [sowedPitIdsInTurn, previewSowing]);

  // Obter casas ordenadas para cada fila (col 0 a 7)
  const row0Pits: PitDefinition[] = useMemo(() => {
    const pits: PitDefinition[] = [];
    for (let c = 0; c < 8; c++) pits.push(PITS[`B${c}`]);
    return pits;
  }, []);

  const row1Pits: PitDefinition[] = useMemo(() => {
    const pits: PitDefinition[] = [];
    for (let c = 0; c < 8; c++) pits.push(PITS[`B${8 + c}`]);
    return pits;
  }, []);

  const row2Pits: PitDefinition[] = useMemo(() => {
    const pits: PitDefinition[] = [];
    for (let c = 0; c < 8; c++) pits.push(PITS[`A${8 + c}`]);
    return pits;
  }, []);

  const row3Pits: PitDefinition[] = useMemo(() => {
    const pits: PitDefinition[] = [];
    for (let c = 0; c < 8; c++) pits.push(PITS[`A${c}`]);
    return pits;
  }, []);

  // Cálculos de totais por linha
  const sumSeeds = (pits: PitDefinition[]) => pits.reduce((sum, p) => sum + (board[p.id] || 0), 0);
  const row0Seeds = sumSeeds(row0Pits);
  const row1Seeds = sumSeeds(row1Pits);
  const row2Seeds = sumSeeds(row2Pits);
  const row3Seeds = sumSeeds(row3Pits);

  const isExtraClara = woodBrightness === 'extra_clara';

  return (
    <div className="relative w-full max-w-full 2xl:max-w-[98vw] mx-auto flex flex-col items-center">
      {/* Barra de Status Estável com Letras Pretas e Alto Contraste */}
      <div className="w-full h-11 sm:h-12 mb-1.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white border-2 border-black flex items-center justify-between text-xs sm:text-sm font-black shadow-sm overflow-hidden select-none">
        {currentActivePitId ? (
          // Modo 1: Semeadura física em andamento
          <div className="w-full flex items-center justify-between gap-2 text-black">
            <div className="flex items-center gap-2 truncate">
              <span className="text-base sm:text-lg shrink-0">🤲</span>
              <span className="text-black font-black whitespace-nowrap">{t.sowingInProgress}:</span>
              <span className="bg-amber-300 text-black px-2 py-0.5 rounded-md font-mono font-black border-2 border-black shadow-xs shrink-0">
                {currentActivePitId}
              </span>
              {activeStepNote && (
                <span className="text-black text-xs truncate hidden sm:inline font-bold">
                  ({activeStepNote})
                </span>
              )}
            </div>
            {seedsInHand !== null && seedsInHand !== undefined && (
              <div className="flex items-center gap-1.5 font-mono shrink-0 ml-auto">
                <span className="text-black font-bold">{t.seedsInHandLabel}:</span>
                <span className="text-black text-sm font-black px-2.5 py-0.5 rounded-md bg-amber-200 border-2 border-black shadow-inner">
                  {seedsInHand}
                </span>
              </div>
            )}
          </div>
        ) : previewSowing ? (
          // Modo 2: Trajectória pré-visualizada ao passar o cursor
          <div className="w-full flex items-center justify-between gap-2 text-black">
            <div className="flex items-center gap-2 truncate">
              <span className="text-black text-sm shrink-0">🌰</span>
              <span className="text-black font-black whitespace-nowrap">{t.trajectoryPreview}:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-black overflow-x-auto py-0.5">
                {previewSowing.sowedPits.map((pId, idx) => (
                  <span key={idx} className="flex items-center gap-1 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[11px] sm:text-xs border border-black ${idx === previewSowing.sowedPits.length - 1 ? 'bg-emerald-300 text-black font-black' : 'bg-amber-100 text-black'}`}>
                      {pId}
                    </span>
                    {idx < previewSowing.sowedPits.length - 1 && <span className="text-black font-black">➔</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-black border-2 border-black text-xs font-black shadow-xs flex items-center gap-1">
                <span>🎯 {previewSowing.lastLandingPitId}</span>
              </span>
              {previewSowing.capturedCount > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-rose-200 text-black border-2 border-black text-xs font-black shadow-xs flex items-center gap-1">
                  <span>⚔ +{previewSowing.capturedCount}</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          // Modo 3: Estado neutro padrão (Altura exatamente idêntica)
          <div className="w-full flex items-center justify-between text-black text-xs sm:text-sm font-black">
            <div className="flex items-center gap-2">
              <span className="text-black text-sm">🌰</span>
              <span className="text-black font-black">
                {currentPlayer === 'A' ? t.playerA : t.playerB}: {t.clickToSowHint}
              </span>
            </div>
            <span className="hidden sm:inline text-black font-mono text-xs font-black bg-amber-100 px-2 py-0.5 rounded border border-black">
              {profile.captureScope === 'attack_and_defense' ? 'Ataque + Defesa' : 'Apenas Ataque'}
            </span>
          </div>
        )}
      </div>

      {/* Tabuleiro com Madeira Clara e Letras Pretas de Alta Visibilidade */}
      <div
        ref={boardContainerRef}
        className={`relative w-full rounded-2xl sm:rounded-3xl p-2 sm:p-3 md:p-4 transition-all duration-300 overflow-hidden border-4 border-[#8f5228] ${
          isFullscreen ? 'shadow-2xl ring-4 ring-amber-500/40' : ''
        }`}
        style={{
          backgroundImage: isExtraClara
            ? `linear-gradient(135deg, rgba(254, 215, 170, 0.40) 0%, rgba(217, 138, 70, 0.28) 50%, rgba(146, 64, 14, 0.32) 100%), url('/src/assets/images/wood_board_texture_1792678914650.jpg')`
            : `linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(180, 83, 9, 0.35) 50%, rgba(120, 53, 15, 0.45) 100%), url('/src/assets/images/wood_board_texture_1792678914650.jpg')`,
          backgroundColor: isExtraClara ? '#a86132' : '#8c4e25',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow:
            '0 25px 50px rgba(92,38,5,0.30), 0 10px 20px rgba(60,25,8,0.18), inset 0 2px 6px rgba(255,235,200,0.6), inset 0 -3px 8px rgba(70,30,10,0.6)',
        }}
      >
        {/* Camada de brilho solar */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-200/25 pointer-events-none" />

        {/* Entalhes geométricos tradicionais e Cabeçalho do Tabuleiro com Letras Pretas */}
        <div className="relative z-10 inset-x-0 top-0 mb-1.5 flex justify-between items-center text-xs tracking-widest text-black uppercase font-mono pointer-events-none">
          <span className="hidden sm:inline font-black text-black">▲ ❖ ▲ ❖ ▲ ❖ ▲</span>
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap">
            <span className="font-black text-black text-xs sm:text-sm tracking-wider bg-white/95 px-2.5 py-0.5 rounded border-2 border-black shadow-xs">
              {t.traditionalBoardTitle}
            </span>

            {/* Alternador de Claridade da Madeira */}
            <button
              type="button"
              onClick={() => setWoodBrightness(prev => (prev === 'extra_clara' ? 'clara_natural' : 'extra_clara'))}
              title="Ajustar claridade da madeira do tabuleiro"
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black text-xs font-sans font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs"
            >
              <Sun className="w-3.5 h-3.5 text-black" />
              <span>{isExtraClara ? t.lightWoodGold : t.lightWoodNatural}</span>
            </button>

            {/* Botão de Alternar Mão Humana Animada */}
            {onToggleHand && (
              <button
                type="button"
                onClick={onToggleHand}
                title="Ativar ou desativar a mão humana animada acompanhando a semeadura"
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-2 text-xs font-sans font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs ${
                  showHumanHand
                    ? 'bg-amber-300 text-black border-black'
                    : 'bg-white hover:bg-stone-100 text-black border-black'
                }`}
              >
                <Hand className="w-3.5 h-3.5 text-black" />
                <span>{t.handToggleBtn}</span>
              </button>
            )}

            {/* Botão de Full Screen (Ecrã Inteiro) no Tabuleiro */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                title={isFullscreen ? `${t.exitFullscreenBtn} (F / Esc)` : `${t.fullscreenBtn} (F)`}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-2 text-xs font-sans font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs ${
                  isFullscreen
                    ? 'bg-amber-400 text-black border-black shadow-md'
                    : 'bg-white hover:bg-stone-100 text-black border-black'
                }`}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-black" />
                )}
                <span>{isFullscreen ? t.exitFullscreenBtn : t.fullscreenBtn}</span>
              </button>
            )}

            {onOpenAuthenticShowcase && (
              <button
                type="button"
                onClick={onOpenAuthenticShowcase}
                className="hidden md:flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black text-xs font-sans font-black cursor-pointer transition-all shadow-xs"
              >
                {t.photoRealBtn} 📷
              </button>
            )}
          </div>
          <span className="hidden sm:inline font-black text-black">▲ ❖ ▲ ❖ ▲ ❖ ▲</span>
        </div>

        {/* Guia Numérico das 8 Colunas (1 a 8) em Preto Puro de Alta Visibilidade */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 pointer-events-none">
          <div className="w-6 sm:w-7 hidden sm:block" />
          <div className="grid grid-cols-8 gap-1.5 sm:gap-3 md:gap-4 w-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(col => (
              <div
                key={col}
                className="w-11 xs:w-13 sm:w-16 md:w-20 lg:w-24 xl:w-26 text-center font-mono font-black text-[11px] sm:text-xs text-black bg-white/95 rounded border-2 border-black shadow-xs py-0.2"
              >
                {col}
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTOR DO JOGADOR B (NORTE) ================= */}
        <div className="relative mb-1 sm:mb-2">
          {/* Cabeçalho do Jogador B em Preto Puro */}
          <div className="flex items-center justify-between px-2 mb-1 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white/95 px-2.5 py-0.5 rounded border-2 border-black shadow-xs">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-black shadow-xs" />
              <span className="font-black tracking-wide text-black text-xs sm:text-sm">
                {t.playerB.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm">
              <span className="text-black font-black bg-white/95 px-2 py-0.5 rounded border-2 border-black shadow-xs">
                {t.defenseRow}: <b className="text-black font-black">{row0Seeds}</b>
              </span>
              <span className="text-black font-black bg-white/95 px-2 py-0.5 rounded border-2 border-black shadow-xs">
                {t.attackRow}: <b className="text-black font-black">{row1Seeds}</b>
              </span>
              <span className="text-black font-black bg-sky-200 px-2.5 py-0.5 rounded border-2 border-black shadow-xs">
                {t.totalSeedsRow}: {row0Seeds + row1Seeds}
              </span>
            </div>
          </div>

          {/* Fila 0: B - Defesa */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-6 sm:w-7 text-[10px] sm:text-xs font-mono font-black text-black bg-emerald-300 border-2 border-black px-0.5 sm:px-1 py-1 rounded text-center -rotate-90 hidden sm:block shadow-xs">
                {t.defenseAbbr}
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:gap-3 md:gap-4">
                {row0Pits.map(pit => (
                  <Pit
                    key={pit.id}
                    pit={pit}
                    seeds={board[pit.id] || 0}
                    isLegal={currentPlayer === 'B' && legalMoveIds.has(pit.id) && !isThinkingAI}
                    isSelected={selectedPitId === pit.id}
                    isSowedInTurn={sowedSet.has(pit.id)}
                    isCapturedInTurn={capturedSet.has(pit.id)}
                    isTargetedByOpponent={targetSet.has(pit.id)}
                    isCurrentPlayerPit={currentPlayer === 'B'}
                    showCoordinates={showCoordinates}
                    disabled={isThinkingAI || currentPlayer !== 'B'}
                    isCurrentDropTarget={currentActivePitId === pit.id}
                    isLastLandingPit={lastLandingPitId === pit.id}
                    sowStepOrder={sowStepMap.get(pit.id) || null}
                    isHoveredTrajectory={previewSowedSet.has(pit.id)}
                    isHoveredLanding={previewSowing?.lastLandingPitId === pit.id}
                    isHoveredCapture={previewCapturedSet.has(pit.id)}
                    onClick={() => onSelectPit(pit.id)}
                    onHover={() => setHoveredPitId(pit.id)}
                    onLeave={() => setHoveredPitId(null)}
                  />
                ))}
              </div>
            </div>

            {/* Fila 1: B - Ataque */}
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-6 sm:w-7 text-[10px] sm:text-xs font-mono font-black text-black bg-rose-300 border-2 border-black px-0.5 sm:px-1 py-1 rounded text-center -rotate-90 hidden sm:block shadow-xs">
                {t.attackAbbr}
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:gap-3 md:gap-4">
                {row1Pits.map(pit => (
                  <Pit
                    key={pit.id}
                    pit={pit}
                    seeds={board[pit.id] || 0}
                    isLegal={currentPlayer === 'B' && legalMoveIds.has(pit.id) && !isThinkingAI}
                    isSelected={selectedPitId === pit.id}
                    isSowedInTurn={sowedSet.has(pit.id)}
                    isCapturedInTurn={capturedSet.has(pit.id)}
                    isTargetedByOpponent={targetSet.has(pit.id)}
                    isCurrentPlayerPit={currentPlayer === 'B'}
                    showCoordinates={showCoordinates}
                    disabled={isThinkingAI || currentPlayer !== 'B'}
                    isCurrentDropTarget={currentActivePitId === pit.id}
                    isLastLandingPit={lastLandingPitId === pit.id}
                    sowStepOrder={sowStepMap.get(pit.id) || null}
                    isHoveredTrajectory={previewSowedSet.has(pit.id)}
                    isHoveredLanding={previewSowing?.lastLandingPitId === pit.id}
                    isHoveredCapture={previewCapturedSet.has(pit.id)}
                    onClick={() => onSelectPit(pit.id)}
                    onHover={() => setHoveredPitId(pit.id)}
                    onLeave={() => setHoveredPitId(null)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= DIVISÓRIA CENTRAL DE BATALHA ================= */}
        <div className="relative my-1.5 sm:my-2 py-0.5 flex items-center justify-center">
          <div className="absolute inset-x-4 sm:inset-x-6 h-[3px] bg-black shadow-xs" />
          <div className="relative z-10 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-white border-2 border-black text-xs sm:text-sm text-black font-mono font-black flex items-center gap-2 shadow-md">
            <span>⚔</span>
            <span className="tracking-wider">{t.battleFrontier}</span>
            <span>⚔</span>
          </div>
        </div>

        {/* ================= SECTOR DO JOGADOR A (SUL) ================= */}
        <div className="relative">
          {/* Fila 2: A - Ataque */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-6 sm:w-7 text-[10px] sm:text-xs font-mono font-black text-black bg-rose-300 border-2 border-black px-0.5 sm:px-1 py-1 rounded text-center -rotate-90 hidden sm:block shadow-xs">
                {t.attackAbbr}
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:gap-3 md:gap-4">
                {row2Pits.map(pit => (
                  <Pit
                    key={pit.id}
                    pit={pit}
                    seeds={board[pit.id] || 0}
                    isLegal={currentPlayer === 'A' && legalMoveIds.has(pit.id) && !isThinkingAI}
                    isSelected={selectedPitId === pit.id}
                    isSowedInTurn={sowedSet.has(pit.id)}
                    isCapturedInTurn={capturedSet.has(pit.id)}
                    isTargetedByOpponent={targetSet.has(pit.id)}
                    isCurrentPlayerPit={currentPlayer === 'A'}
                    showCoordinates={showCoordinates}
                    disabled={isThinkingAI || currentPlayer !== 'A'}
                    isCurrentDropTarget={currentActivePitId === pit.id}
                    isLastLandingPit={lastLandingPitId === pit.id}
                    sowStepOrder={sowStepMap.get(pit.id) || null}
                    isHoveredTrajectory={previewSowedSet.has(pit.id)}
                    isHoveredLanding={previewSowing?.lastLandingPitId === pit.id}
                    isHoveredCapture={previewCapturedSet.has(pit.id)}
                    onClick={() => onSelectPit(pit.id)}
                    onHover={() => setHoveredPitId(pit.id)}
                    onLeave={() => setHoveredPitId(null)}
                  />
                ))}
              </div>
            </div>

            {/* Fila 3: A - Defesa */}
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-6 sm:w-7 text-[10px] sm:text-xs font-mono font-black text-black bg-emerald-300 border-2 border-black px-0.5 sm:px-1 py-1 rounded text-center -rotate-90 hidden sm:block shadow-xs">
                {t.defenseAbbr}
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:gap-3 md:gap-4">
                {row3Pits.map(pit => (
                  <Pit
                    key={pit.id}
                    pit={pit}
                    seeds={board[pit.id] || 0}
                    isLegal={currentPlayer === 'A' && legalMoveIds.has(pit.id) && !isThinkingAI}
                    isSelected={selectedPitId === pit.id}
                    isSowedInTurn={sowedSet.has(pit.id)}
                    isCapturedInTurn={capturedSet.has(pit.id)}
                    isTargetedByOpponent={targetSet.has(pit.id)}
                    isCurrentPlayerPit={currentPlayer === 'A'}
                    showCoordinates={showCoordinates}
                    disabled={isThinkingAI || currentPlayer !== 'A'}
                    isCurrentDropTarget={currentActivePitId === pit.id}
                    isLastLandingPit={lastLandingPitId === pit.id}
                    sowStepOrder={sowStepMap.get(pit.id) || null}
                    isHoveredTrajectory={previewSowedSet.has(pit.id)}
                    isHoveredLanding={previewSowing?.lastLandingPitId === pit.id}
                    isHoveredCapture={previewCapturedSet.has(pit.id)}
                    onClick={() => onSelectPit(pit.id)}
                    onHover={() => setHoveredPitId(pit.id)}
                    onLeave={() => setHoveredPitId(null)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé do Jogador A em Preto Puro */}
          <div className="flex items-center justify-between px-2 mt-1 sm:mt-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white/95 px-2.5 py-0.5 rounded border-2 border-black shadow-xs">
              <span className="w-3 h-3 rounded-full bg-amber-600 border border-black shadow-xs" />
              <span className="font-black tracking-wide text-black text-xs sm:text-sm">
                {t.playerA.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm">
              <span className="text-black font-black bg-white/95 px-2 py-0.5 rounded border-2 border-black shadow-xs">
                {t.attackRow}: <b className="text-black font-black">{row2Seeds}</b>
              </span>
              <span className="text-black font-black bg-white/95 px-2 py-0.5 rounded border-2 border-black shadow-xs">
                {t.defenseRow}: <b className="text-black font-black">{row3Seeds}</b>
              </span>
              <span className="text-black font-black bg-amber-200 px-2.5 py-0.5 rounded border-2 border-black shadow-xs">
                {t.totalSeedsRow}: {row2Seeds + row3Seeds}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Tabuleiro: Legenda & Sentido da Semeadura com texto PRETO PURO */}
        <div className="mt-2 pt-2 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs text-black font-black px-2">
          <div className="flex items-center gap-1.5 text-black font-black bg-white/95 px-2 py-0.5 rounded border-2 border-black">
            <span className="text-base leading-none">↺</span>
            <span>{t.ccwCircuitDesc}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-white/95 px-2 py-0.5 rounded border-2 border-black">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-black shadow-xs" />
              <span className="text-black font-black">{t.attackRowLegend}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-black shadow-xs" />
              <span className="text-black font-black">{t.defenseRowLegend}</span>
            </span>
          </div>
        </div>

        {/* Mão Humana Realista que acompanha fisicamente a semeadura e recolha do adversário */}
        {showHumanHand && currentActivePitId && (
          <HumanHand
            targetPitId={currentActivePitId}
            player={actingPlayer || currentPlayer}
            stepType={stepType || null}
            seedsInHand={seedsInHand || null}
            speedMs={animationSpeedMs}
            containerRef={boardContainerRef}
            isVisible={Boolean(currentActivePitId)}
          />
        )}
      </div>
    </div>
  );
};
