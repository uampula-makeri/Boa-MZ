import React, { useState, useMemo } from 'react';
import { PitDefinition, Player, GamePhase, RuleProfile } from '../engine/types';
import { PITS, getOpposingPits } from '../engine/boardMapping';
import { Pit } from './Pit';
import { LegalMoveInfo } from '../engine/moveGenerator';
import { executeSowing } from '../engine/sowing';
import { useLanguage } from '../i18n/LanguageContext';
import { Sun } from 'lucide-react';

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
  // Props de semeadura física
  currentActivePitId?: string | null;
  seedsInHand?: number | null;
  activeStepNote?: string | null;
  lastLandingPitId?: string | null;
  onSelectPit: (pitId: string) => void;
  onOpenAuthenticShowcase?: () => void;
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
  onSelectPit,
  onOpenAuthenticShowcase,
}) => {
  const { t } = useLanguage();
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
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Barra de Status Estável com Altura Rigorosamente Fixa (Zero Salto / Zero Tremor) */}
      <div className="w-full h-12 mb-2 px-3 sm:px-4 rounded-2xl bg-[#fffdfa] border-2 border-amber-900/30 flex items-center justify-between text-xs font-black shadow-xs overflow-hidden select-none">
        {currentActivePitId ? (
          // Modo 1: Semeadura física em andamento
          <div className="w-full flex items-center justify-between gap-2 text-stone-950">
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg shrink-0">🤲</span>
              <span className="text-amber-950 font-black whitespace-nowrap">{t.sowingInProgress}:</span>
              <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded-md font-mono font-black shadow-xs shrink-0">
                {currentActivePitId}
              </span>
              {activeStepNote && (
                <span className="text-stone-700 text-xs truncate hidden sm:inline font-medium">
                  ({activeStepNote})
                </span>
              )}
            </div>
            {seedsInHand !== null && seedsInHand !== undefined && (
              <div className="flex items-center gap-1.5 font-mono shrink-0 ml-auto">
                <span className="text-stone-800 font-bold">{t.seedsInHandLabel}:</span>
                <span className="text-amber-950 text-sm font-black px-2.5 py-0.5 rounded-md bg-amber-200 border border-amber-500 shadow-inner">
                  {seedsInHand}
                </span>
              </div>
            )}
          </div>
        ) : previewSowing ? (
          // Modo 2: Trajectória pré-visualizada ao passar o cursor
          <div className="w-full flex items-center justify-between gap-2 text-stone-950">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-800 text-sm shrink-0">🌰</span>
              <span className="text-amber-950 font-black whitespace-nowrap">{t.trajectoryPreview}:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-amber-900 overflow-x-auto py-0.5">
                {previewSowing.sowedPits.map((pId, idx) => (
                  <span key={idx} className="flex items-center gap-1 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[11px] ${idx === previewSowing.sowedPits.length - 1 ? 'bg-emerald-200 text-emerald-950 font-black' : 'bg-amber-100'}`}>
                      {pId}
                    </span>
                    {idx < previewSowing.sowedPits.length - 1 && <span className="text-amber-700">➔</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-500 text-xs font-black shadow-xs flex items-center gap-1">
                <span>🎯 {previewSowing.lastLandingPitId}</span>
              </span>
              {previewSowing.capturedCount > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-500 text-xs font-black shadow-xs flex items-center gap-1">
                  <span>⚔ +{previewSowing.capturedCount}</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          // Modo 3: Estado neutro padrão (Altura exatamente idêntica)
          <div className="w-full flex items-center justify-between text-stone-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 text-sm">🌰</span>
              <span className="text-amber-950 font-black">
                {currentPlayer === 'A' ? t.playerA : t.playerB}: {t.clickToSowHint}
              </span>
            </div>
            <span className="hidden sm:inline text-amber-900 font-mono text-[11px]">
              {profile.captureScope === 'attack_and_defense' ? 'Ataque + Defesa' : 'Apenas Ataque'}
            </span>
          </div>
        )}
      </div>

      {/* Tabuleiro com Madeira Clara, Quente e Dourada com Letras de Alta Visibilidade */}
      <div
        className="relative w-full rounded-3xl p-3 sm:p-5 md:p-6 transition-all duration-300 overflow-hidden border-4 border-[#8f5228]"
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

        {/* Entalhes geométricos tradicionais e Cabeçalho do Tabuleiro */}
        <div className="relative z-10 inset-x-0 top-0 mb-2 flex justify-between items-center text-xs tracking-widest text-amber-950 uppercase font-mono pointer-events-none">
          <span className="hidden sm:inline font-black text-amber-950">▲ ❖ ▲ ❖ ▲ ❖ ▲</span>
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="font-black text-amber-950 text-xs sm:text-sm tracking-wider drop-shadow-2xs">
              {t.traditionalBoardTitle}
            </span>

            {/* Alternador de Claridade da Madeira */}
            <button
              type="button"
              onClick={() => setWoodBrightness(prev => (prev === 'extra_clara' ? 'clara_natural' : 'extra_clara'))}
              title="Ajustar claridade da madeira do tabuleiro"
              className="px-2.5 py-1 rounded-full bg-[#fffdfa] hover:bg-white text-amber-950 border-2 border-amber-900/40 text-xs font-sans font-black cursor-pointer transition-all flex items-center gap-1 shadow-xs"
            >
              <Sun className="w-3.5 h-3.5 text-amber-700" />
              <span>{isExtraClara ? t.lightWoodGold : t.lightWoodNatural}</span>
            </button>

            {onOpenAuthenticShowcase && (
              <button
                type="button"
                onClick={onOpenAuthenticShowcase}
                className="px-2.5 py-1 rounded-full bg-[#fffdfa] hover:bg-white text-amber-950 border-2 border-amber-900/40 text-xs font-sans font-black cursor-pointer transition-all shadow-xs"
              >
                {t.photoRealBtn} 📷
              </button>
            )}
          </div>
          <span className="hidden sm:inline font-black text-amber-950">▲ ❖ ▲ ❖ ▲ ❖ ▲</span>
        </div>

        {/* ================= SECTOR DO JOGADOR B (NORTE) ================= */}
        <div className="relative mb-2 mt-1">
          {/* Cabeçalho do Jogador B */}
          <div className="flex items-center justify-between px-2 mb-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-700 shadow-xs" />
              <span className="font-black tracking-wide text-blue-950 text-sm sm:text-base">
                {t.playerB.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
              <span className="text-stone-950 font-black">
                {t.defenseRow}: <b className="text-blue-950 font-black">{row0Seeds}</b>
              </span>
              <span className="text-stone-950 font-black">
                {t.attackRow}: <b className="text-blue-950 font-black">{row1Seeds}</b>
              </span>
              <span className="text-blue-950 font-black bg-blue-100/95 px-3 py-0.5 rounded-md border-2 border-blue-500/80 shadow-xs">
                {t.totalSeedsRow}: {row0Seeds + row1Seeds}
              </span>
            </div>
          </div>

          {/* Fila 0: B - Defesa */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-7 text-xs font-mono font-black text-emerald-950 bg-emerald-100 border-2 border-emerald-500 px-1 py-1 rounded-md text-center -rotate-90 hidden sm:block shadow-xs">
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
              <div className="w-7 text-xs font-mono font-black text-rose-950 bg-rose-100 border-2 border-rose-500 px-1 py-1 rounded-md text-center -rotate-90 hidden sm:block shadow-xs">
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
        <div className="relative my-2 sm:my-3 py-1 flex items-center justify-center">
          <div className="absolute inset-x-6 h-[3px] bg-gradient-to-r from-transparent via-amber-800/80 to-transparent shadow-xs" />
          <div className="relative z-10 px-4 py-1.5 rounded-full bg-[#fffdfa] border-2 border-amber-900/80 text-xs sm:text-sm text-amber-950 font-mono font-black flex items-center gap-2 shadow-md">
            <span className="text-amber-800">⚔</span>
            <span className="tracking-wider">{t.battleFrontier}</span>
            <span className="text-amber-800">⚔</span>
          </div>
        </div>

        {/* ================= SECTOR DO JOGADOR A (SUL) ================= */}
        <div className="relative">
          {/* Fila 2: A - Ataque */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 sm:gap-2 justify-center">
              <div className="w-7 text-xs font-mono font-black text-rose-950 bg-rose-100 border-2 border-rose-500 px-1 py-1 rounded-md text-center -rotate-90 hidden sm:block shadow-xs">
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
              <div className="w-7 text-xs font-mono font-black text-emerald-950 bg-emerald-100 border-2 border-emerald-500 px-1 py-1 rounded-md text-center -rotate-90 hidden sm:block shadow-xs">
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

          {/* Rodapé do Jogador A */}
          <div className="flex items-center justify-between px-2 mt-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-700 shadow-xs" />
              <span className="font-black tracking-wide text-amber-950 text-sm sm:text-base">
                {t.playerA.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
              <span className="text-stone-950 font-black">
                {t.attackRow}: <b className="text-amber-900 font-black">{row2Seeds}</b>
              </span>
              <span className="text-stone-950 font-black">
                {t.defenseRow}: <b className="text-amber-900 font-black">{row3Seeds}</b>
              </span>
              <span className="text-amber-950 font-black bg-amber-100/95 px-3 py-0.5 rounded-md border-2 border-amber-500/80 shadow-xs">
                {t.totalSeedsRow}: {row2Seeds + row3Seeds}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Tabuleiro: Legenda & Sentido da Semeadura com texto legível */}
        <div className="mt-3 pt-2.5 border-t-2 border-amber-900/30 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-950 font-black px-2">
          <div className="flex items-center gap-1.5 text-amber-950 font-black">
            <span className="text-base leading-none">↺</span>
            <span>{t.ccwCircuitDesc}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 shadow-xs" />
              <span className="text-stone-950 font-black">{t.attackRowLegend}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-xs" />
              <span className="text-stone-950 font-black">{t.defenseRowLegend}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
