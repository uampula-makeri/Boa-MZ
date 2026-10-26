import { runAllAutomatedTests } from './testSuite';

console.log('=== EXECUÇÃO DA BATERIA DE TESTES DO BOA-MZ ===');
const report = runAllAutomatedTests();
console.log(`Total de Testes: ${report.totalTests}`);
console.log(`Testes Aprovados: ${report.passedCount}`);
console.log(`Testes Falhados: ${report.failedCount}`);
console.log(`Todos Aprovados: ${report.allPassed}`);
console.log('--- DETALHES DOS TESTES ---');
for (const res of report.results) {
  console.log(`[${res.passed ? 'PASS' : 'FAIL'}] ${res.id}: ${res.name} (${res.durationMs.toFixed(1)}ms)`);
  if (!res.passed) {
    console.log(`  Esperado: ${res.expectedResult}`);
    console.log(`  Obtido:   ${res.obtainedResult}`);
    if (res.error) console.log(`  Erro:     ${res.error}`);
  }
}
