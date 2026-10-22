import React, { useState } from 'react';
import { CULTURAL_RULE_CARDS, PRACTITIONER_INTERVIEW_QUESTIONS, RuleCard } from '../rules/culturalDossier';
import { X, BookOpen, MessageSquare, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface CulturalValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CulturalValidationModal: React.FC<CulturalValidationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'interview'>('cards');
  const [selectedCard, setSelectedCard] = useState<RuleCard | null>(CULTURAL_RULE_CARDS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-amber-900/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-amber-200">Dossiê Cultural & Validação Documental</h2>
              <p className="text-xs text-stone-400">Ntxuva do Sul de Moçambique — Rastreio de Regras e Etnografia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Separadores de Navegação */}
        <div className="flex border-b border-stone-800 bg-stone-900 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Fichas das Regras ({CULTURAL_RULE_CARDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Guia de Entrevista para Praticantes Locais</span>
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Lista lateral de regras */}
              <div className="md:col-span-5 space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Regras do Perfil 4 × 8
                </div>
                {CULTURAL_RULE_CARDS.map(card => {
                  const isSelected = selectedCard?.code === card.code;
                  return (
                    <button
                      key={card.code}
                      onClick={() => setSelectedCard(card)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500/80 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-amber-400 font-bold">{card.code}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            card.status === 'documentada'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : card.status === 'provisional'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                          }`}
                        >
                          {card.status === 'documentada'
                            ? 'Documentada'
                            : card.status === 'provisional'
                            ? 'Provisória'
                            : 'Por Validar'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-200">{card.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Ficha técnica detalhada */}
              <div className="md:col-span-7 bg-stone-950/90 rounded-2xl border border-stone-800 p-5 space-y-4 text-xs">
                {selectedCard && (
                  <>
                    <div className="border-b border-stone-800 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-amber-400 font-bold">{selectedCard.code}</span>
                        <span className="text-stone-500">•</span>
                        <span className="font-mono text-stone-400">Actualizado: {selectedCard.lastUpdated}</span>
                      </div>
                      <h3 className="text-base font-bold text-amber-100">{selectedCard.title}</h3>
                      <p className="text-stone-300 mt-1 leading-relaxed">{selectedCard.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-stone-400 font-semibold block mb-0.5">Fonte Documental:</span>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-300">
                          {selectedCard.sourceDoc}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block mb-0.5">Evidência no Sul de Moçambique:</span>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-300">
                          {selectedCard.evidenceMozambique}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-stone-400 font-semibold block mb-0.5">Parâmetro de Configuração:</span>
                          <div className="p-2 rounded bg-stone-900 border border-stone-800 font-mono text-[11px] text-amber-300">
                            {selectedCard.configParameter}
                          </div>
                        </div>

                        <div>
                          <span className="text-stone-400 font-semibold block mb-0.5">Estado Cultural:</span>
                          <div className="p-2 rounded bg-stone-900 border border-stone-800 font-semibold">
                            {selectedCard.status.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block mb-0.5">Posição de Demonstração & Regra:</span>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-300">
                          {selectedCard.demoPositionNote}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block mb-0.5">Resultado Esperado do Motor:</span>
                        <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                          {selectedCard.expectedResult}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block mb-0.5">Notas de Validação Etnográfica:</span>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-400 italic">
                          {selectedCard.validationNotes}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 leading-relaxed text-xs">
                Este questionário destina-se a orientar entrevistas com praticantes experientes e guardiões do jogo tradicional nas províncias de Maputo, Gaza e Inhambane, garantindo que as futuras atualizações da versão 1.0 respeitem estritamente as tradições orais e comunitárias.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRACTITIONER_INTERVIEW_QUESTIONS.map(section => (
                  <div key={section.category} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <h4 className="font-bold text-amber-300 text-sm border-b border-stone-800 pb-1">
                      {section.category}
                    </h4>
                    <ul className="space-y-2 text-xs text-stone-300">
                      {section.questions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
          <span>BOA-MZ — Preservação e Digitalização Cultural do Ntxuva</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold cursor-pointer transition-all"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
