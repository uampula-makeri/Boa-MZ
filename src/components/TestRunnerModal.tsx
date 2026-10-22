import React, { useState, useEffect } from 'react';
import { runAllAutomatedTests, TestSuiteReport, TestCaseResult } from '../tests/testSuite';
import { X, Play, CheckCircle2, XCircle, ShieldCheck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<TestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const runTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const rep = runAllAutomatedTests();
      setReport(rep);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    if (isOpen && !report) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-amber-200">Bateria de Testes Automatizados (15 Testes)</h2>
              <p className="text-xs text-stone-400">Validação rigorosa do motor lógico, integridade e regras de semeadura</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Executar Novamente</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resumo da Execução */}
        {report && (
          <div className="px-6 py-3 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{report.passedCount} Passaram</span>
              </span>
              <span className={`flex items-center gap-1.5 font-bold ${report.failedCount > 0 ? 'text-red-400' : 'text-stone-500'}`}>
                <XCircle className="w-4 h-4" />
                <span>{report.failedCount} Falharam</span>
              </span>
              <span className="text-stone-400">Total: {report.totalTests} testes</span>
            </div>
            <div className="text-stone-400">
              Taxa de Sucesso: <b className="text-emerald-300">{Math.round((report.passedCount / report.totalTests) * 100)}%</b>
            </div>
          </div>
        )}

        {/* Lista de Resultados dos Testes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isRunning ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
              <span>A executar a bateria de 15 testes do motor lógico...</span>
            </div>
          ) : report ? (
            report.results.map((test: TestCaseResult) => {
              const isExpanded = expandedTestId === test.id;
              return (
                <div
                  key={test.id}
                  className={`rounded-2xl border transition-all ${
                    test.passed
                      ? 'bg-stone-950/60 border-stone-800 hover:border-emerald-700/50'
                      : 'bg-red-950/30 border-red-700/60'
                  }`}
                >
                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="w-full text-left p-3.5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {test.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{test.id}</span>
                          <span className="font-semibold text-xs text-stone-200">{test.name}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{test.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-stone-400">
                      <span>{test.durationMs.toFixed(1)}ms</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Detalhes expandidos com Posição, Ação, Esperado e Obtido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-stone-800/80 space-y-2.5 text-xs font-mono bg-stone-950/80 rounded-b-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 block text-[10px] uppercase font-sans mb-1 font-semibold">
                            Posição Inicial:
                          </span>
                          <span className="text-stone-200">{test.initialPositionSummary}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 block text-[10px] uppercase font-sans mb-1 font-semibold">
                            Acção Executada:
                          </span>
                          <span className="text-amber-300">{test.actionExecuted}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 block text-[10px] uppercase font-sans mb-1 font-semibold">
                            Resultado Esperado:
                          </span>
                          <span className="text-emerald-300">{test.expectedResult}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 block text-[10px] uppercase font-sans mb-1 font-semibold">
                            Resultado Obtido:
                          </span>
                          <span className={test.passed ? 'text-stone-200' : 'text-red-300'}>
                            {test.obtainedResult}
                          </span>
                        </div>
                      </div>

                      {test.error && (
                        <div className="p-2 rounded bg-red-950/80 border border-red-700 text-red-200">
                          Erro detectado: {test.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : null}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
          <span>Relatório gerado em tempo real com determinismo matemático</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold cursor-pointer transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
