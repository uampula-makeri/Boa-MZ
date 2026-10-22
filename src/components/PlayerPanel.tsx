import React from 'react';
import { Player, GamePhase, GameMode, AIDifficulty } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

interface PlayerPanelProps {
  player: Player;
  isCurrent: boolean;
  capturedCount: number;
  seedsOnBoard: number;
  phase: GamePhase;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  isThinkingAI: boolean;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  isCurrent,
  capturedCount,
  seedsOnBoard,
  phase,
  mode,
  aiDifficulty,
  isThinkingAI,
}) => {
  const { t } = useLanguage();
  const isPlayerA = player === 'A';
  const isAI = mode === 'ai' && player === 'B';

  return (
    <div
      className={`
        relative flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl
        border-2 transition-all duration-300 w-full max-w-md shadow-sm
        ${
          isCurrent
            ? isPlayerA
              ? 'bg-[#fffdfa] border-amber-600 shadow-md ring-2 ring-amber-500/30 text-amber-950'
              : 'bg-[#f4f9ff] border-blue-600 shadow-md ring-2 ring-blue-500/30 text-blue-950'
            : 'bg-[#fffdfa]/90 border-amber-900/30 text-stone-900'
        }
      `}
    >
      {/* Identidade do Jogador */}
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-inner
            ${
              isPlayerA
                ? 'bg-gradient-to-br from-amber-600 to-amber-900 text-amber-50 ring-2 ring-amber-400'
                : 'bg-gradient-to-br from-blue-600 to-blue-900 text-white ring-2 ring-blue-400'
            }
          `}
        >
          {player}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base sm:text-lg text-stone-950">
              {isPlayerA ? t.playerA : isAI ? t.computer : t.playerB}
            </span>
            {isCurrent && (
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border-2 ${
                  isPlayerA
                    ? 'bg-amber-100 text-amber-950 border-amber-600'
                    : 'bg-blue-100 text-blue-950 border-blue-600'
                }`}
              >
                {isThinkingAI ? t.aiThinking : t.yourTurn}
              </span>
            )}
          </div>
          <div className="text-xs text-stone-800 font-bold flex items-center gap-2 mt-0.5">
            <span className="text-stone-950 font-mono font-black">{t.boardSeeds}: {seedsOnBoard}</span>
          </div>
        </div>
      </div>

      {/* Recipiente de Peças Capturadas */}
      <div className="flex items-center gap-2 bg-[#f4ebe1] px-3.5 py-1.5 rounded-xl border-2 border-amber-900/30 shadow-inner">
        <div className="text-right">
          <div className="text-xs text-stone-800 uppercase font-black tracking-wider">{t.capturedSeeds}</div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-900 tabular-nums">
            {capturedCount}
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-xs text-emerald-800 font-bold shadow-xs">
          ✦
        </div>
      </div>
    </div>
  );
};
