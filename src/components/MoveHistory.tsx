import React from 'react';
import { MoveRecord } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';
import { History, ChevronRight } from 'lucide-react';

interface MoveHistoryProps {
  history: MoveRecord[];
  turnCount: number;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#fffdfa] rounded-2xl border-2 border-amber-900/30 p-3 sm:p-4 text-xs shadow-sm">
      <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-amber-900/20 text-stone-950">
        <div className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm">
          <History className="w-4.5 h-4.5 text-amber-800" />
          <span>{t.historyTitle}</span>
        </div>
        <span className="font-mono text-xs text-stone-800 font-bold">
          {t.totalMovesLabel}: {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="py-3 text-center text-stone-700 italic font-bold">
          {t.noMovesYet}
        </div>
      ) : (
        <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {history.slice().reverse().map(record => (
            <div
              key={record.turnNumber}
              className={`p-2 rounded-xl border-2 transition-all flex items-center justify-between shadow-2xs ${
                record.player === 'A'
                  ? 'bg-amber-100/70 border-amber-600/40 text-amber-950'
                  : 'bg-blue-100/70 border-blue-600/40 text-blue-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-950 text-amber-100 font-black flex items-center justify-center text-[10px] shadow-xs">
                  {record.turnNumber}
                </span>
                <span className="font-black">[{record.player}]</span>
                <span className="font-black">{t.fromPit} {record.originPitId}</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-900 inline" />
                <span className="text-stone-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                  {record.sowedPits.length} {t.pitsTraversed}
                </span>
              </div>

              {record.capturedCount > 0 ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border-2 border-emerald-600 font-black shadow-xs">
                  +{record.capturedCount} {t.withCaptures}
                </span>
              ) : (
                <span className="text-stone-600 font-bold text-[10px]">{t.noCaptures}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
