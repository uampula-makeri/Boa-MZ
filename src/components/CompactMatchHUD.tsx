import React from 'react';
import { Player, GamePhase, GameMode, AIDifficulty, RuleProfile } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  ArrowLeft,
  RotateCcw,
  PlayCircle,
  Lightbulb,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Hand,
  Settings,
  BookOpen,
  Award,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface CompactMatchHUDProps {
  playerA: {
    seedsOnBoard: number;
    capturedCount: number;
    isCurrent: boolean;
  };
  playerB: {
    seedsOnBoard: number;
    capturedCount: number;
    isCurrent: boolean;
    isAI: boolean;
    isThinkingAI: boolean;
  };
  turnCount: number;
  phase: GamePhase;
  profile: RuleProfile;
  canUndo: boolean;
  soundEnabled: boolean;
  showHints: boolean;
  showHumanHand: boolean;
  isFullscreen: boolean;
  onBackToMenu: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onToggleHints: () => void;
  onToggleHand: () => void;
  onToggleFullscreen: () => void;
  onOpenTutorial: () => void;
  onOpenDossier: () => void;
  onOpenSettings: () => void;
  onOpenTests: () => void;
}

export const CompactMatchHUD: React.FC<CompactMatchHUDProps> = ({
  playerA,
  playerB,
  turnCount,
  phase,
  profile,
  canUndo,
  soundEnabled,
  showHints,
  showHumanHand,
  isFullscreen,
  onBackToMenu,
  onUndo,
  onRestart,
  onToggleSound,
  onToggleHints,
  onToggleHand,
  onToggleFullscreen,
  onOpenTutorial,
  onOpenDossier,
  onOpenSettings,
  onOpenTests,
}) => {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white/95 border-b-2 border-black px-2 sm:px-4 py-1.5 shadow-sm select-none z-30 transition-all">
      <div className="max-w-[99vw] mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-3">
        {/* Lado Esquerdo: Menu Principal e Título Curto */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onBackToMenu}
            title={t.mainMenuBtn}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-black border-2 border-black font-black text-xs cursor-pointer transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-black" />
            <span className="hidden md:inline">{t.mainMenuBtn}</span>
          </button>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-black tracking-tight text-black leading-tight">
              M'BALA MBALAVALANA
            </span>
            <span className="text-[10px] font-mono text-stone-700 leading-tight">
              {profile.name}
            </span>
          </div>
        </div>

        {/* Centro Agrupado: JOGADOR B (Norte) vs JOGADOR A (Sul) + Turno & Fase */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-stone-100/90 px-2 py-0.5 rounded-xl border-2 border-black shadow-inner">
          {/* Jogador B */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border-2 transition-all ${
              playerB.isCurrent
                ? 'bg-sky-200 border-black ring-2 ring-sky-400 font-black'
                : 'bg-white border-black/40 text-stone-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-black shrink-0" />
            <span className="text-xs font-black text-black">
              {playerB.isAI ? 'B (PC)' : 'B'}:
            </span>
            <span className="text-xs font-mono font-black text-black" title={t.boardSeeds}>
              🌰 {playerB.seedsOnBoard}
            </span>
            <span className="text-xs font-mono font-black text-emerald-800" title={t.capturedSeeds}>
              ✦ {playerB.capturedCount}
            </span>
            {playerB.isCurrent && (
              <span className="text-[9px] font-black uppercase bg-blue-700 text-white px-1.5 py-0.2 rounded-full hidden sm:inline">
                {playerB.isThinkingAI ? t.aiThinking : t.yourTurn}
              </span>
            )}
          </div>

          {/* Divisor Central com Turno e Fase */}
          <div className="flex items-center gap-1 text-black font-mono text-xs font-black px-1">
            <span className="bg-black text-white px-1.5 py-0.2 rounded text-[10px]">
              T.{turnCount}
            </span>
            <span
              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border border-black hidden sm:inline ${
                phase === 'phase1_groups' ? 'bg-amber-300' : 'bg-purple-300'
              }`}
            >
              {phase === 'phase1_groups' ? 'Fase 1' : 'Fase 2'}
            </span>
          </div>

          {/* Jogador A */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border-2 transition-all ${
              playerA.isCurrent
                ? 'bg-amber-200 border-black ring-2 ring-amber-400 font-black'
                : 'bg-white border-black/40 text-stone-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-black shrink-0" />
            <span className="text-xs font-black text-black">A:</span>
            <span className="text-xs font-mono font-black text-black" title={t.boardSeeds}>
              🌰 {playerA.seedsOnBoard}
            </span>
            <span className="text-xs font-mono font-black text-emerald-800" title={t.capturedSeeds}>
              ✦ {playerA.capturedCount}
            </span>
            {playerA.isCurrent && (
              <span className="text-[9px] font-black uppercase bg-amber-700 text-white px-1.5 py-0.2 rounded-full hidden sm:inline">
                {t.yourTurn}
              </span>
            )}
          </div>
        </div>

        {/* Lado Direito: Ações Rápidas & Ecrã Inteiro Horizontal */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title={`${t.undoBtn} (U)`}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 font-black text-xs transition-all shadow-xs ${
              canUndo
                ? 'bg-white hover:bg-stone-100 text-black border-black cursor-pointer'
                : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">{t.undoBtn}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            title={`${t.newGameBtn} (R)`}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-xs cursor-pointer transition-all shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5 text-black" />
            <span className="hidden md:inline">{t.newGameBtn}</span>
          </button>

          <button
            type="button"
            onClick={onToggleHints}
            title="Ativar/Desativar Dicas de Jogada"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 font-black text-xs cursor-pointer transition-all shadow-xs ${
              showHints
                ? 'bg-amber-300 text-black border-black'
                : 'bg-white hover:bg-stone-100 text-black border-black'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-black" />
            <span className="hidden lg:inline">{showHints ? 'Dicas On' : 'Dicas Off'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? `${t.muteBtn} (M)` : `${t.soundBtn} (M)`}
            className="p-1 sm:px-2 sm:py-1 rounded-lg bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-xs cursor-pointer transition-all shadow-xs"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-black" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleHand}
            title="Mão humana animada"
            className={`p-1 sm:px-2 sm:py-1 rounded-lg border-2 font-black text-xs cursor-pointer transition-all shadow-xs ${
              showHumanHand
                ? 'bg-amber-300 text-black border-black'
                : 'bg-white hover:bg-stone-100 text-black border-black'
            }`}
          >
            <Hand className="w-3.5 h-3.5 text-black" />
          </button>

          {/* Botão de Ecrã Inteiro & Paisagem Horizontal */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={
              isFullscreen
                ? `${t.exitFullscreenBtn} (F / Esc)`
                : `Tela Cheia Horizontal no Tablet/Celular (F)`
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 font-black text-xs cursor-pointer transition-all shadow-xs ${
              isFullscreen
                ? 'bg-amber-400 text-black border-black shadow-md'
                : 'bg-stone-900 text-white border-black hover:bg-black'
            }`}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-black" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span className="font-black">
              {isFullscreen ? t.exitFullscreenBtn : t.fullscreenBtn}
            </span>
          </button>

          <LanguageSelector />

          <button
            type="button"
            onClick={onOpenSettings}
            title={t.settingsBtn}
            className="p-1 rounded-lg bg-white hover:bg-stone-100 text-black border-2 border-black cursor-pointer transition-all shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};
