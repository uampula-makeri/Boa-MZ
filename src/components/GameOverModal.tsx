import React, { useEffect } from 'react';
import { Player, GameStatus, GameMode } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw } from 'lucide-react';
import { sound } from '../sound/audioSynth';

interface GameOverModalProps {
  status: GameStatus;
  winner: Player | 'draw' | null;
  capturedA: number;
  capturedB: number;
  turnCount: number;
  mode: GameMode;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  winner,
  capturedA,
  capturedB,
  turnCount,
  mode,
  onRestart,
  onClose,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (status !== 'in_progress') {
      sound.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ffffff'],
      });
    }
  }, [status]);

  if (status === 'in_progress') return null;

  const isWinnerA = winner === 'A';
  const isDraw = winner === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fffdfa] border-4 border-amber-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-stone-950 flex flex-col items-center">
        {/* Ícone de Vitória */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-600 flex items-center justify-center text-amber-800 mb-4 shadow-lg animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
          {isDraw
            ? t.drawTitle
            : isWinnerA
            ? t.victoryPlayerA
            : mode === 'ai'
            ? t.victoryAI
            : t.victoryPlayerB}
        </h2>

        {/* Estatísticas da Partida com Alta Visibilidade */}
        <div className="w-full my-6 p-4 rounded-2xl bg-[#f5ecdf] border-2 border-amber-900/30 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-stone-800 text-xs uppercase font-black">{t.turnLabel}s</div>
            <div className="text-xl font-black text-amber-950 font-mono mt-0.5">{turnCount}</div>
          </div>
          <div>
            <div className="text-stone-800 text-xs uppercase font-black">{t.capturedSeeds} A</div>
            <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">{capturedA}</div>
          </div>
          <div>
            <div className="text-stone-800 text-xs uppercase font-black">{t.capturedSeeds} B</div>
            <div className="text-xl font-black text-blue-900 font-mono mt-0.5">{capturedB}</div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-2 border-amber-600"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.playAgainBtn}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-4 rounded-xl bg-[#ede2d5] hover:bg-white text-stone-950 font-black text-sm border-2 border-amber-900/30 cursor-pointer transition-all"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
