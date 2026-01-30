/**
 * @fileoverview Test_Workflow_SafetyNet.gs
 * Golden Master / Safety Net Tests for Core_Workflow_API.gs Refactoring
 * 
 * This file captures the current behavior of critical business logic functions
 * to ensure no regressions occur during the extraction to modules.
 * 
 * TARGET FUNCTIONS:
 * - calcularValoresContabeis
 * - validarIntegridadeContabil
 */

function runSafetyNetTests() {
  var output = {
    timestamp: new Date(),
    tests: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };
  
  Logger.log('=== INICIANDO SAFETY NET TESTS ===');
  
  try {
    // 1. Test calcularValoresContabeis
    runTestGroup(output, 'Calculadora Contábil', [
      test_calcularValoresCenarioPadrao,
      test_calcularValoresCenarioParcial,
      test_calcularValoresCenarioZero,
      test_calcularValoresArredondamento
    ]);
    
    // 2. Test validarIntegridadeContabil
    runTestGroup(output, 'Validação de Integridade', [
      test_validacaoSucesso,
      test_validacaoErroMatematico,
      test_validacaoIncoerenciaDecisao
    ]);
    
  } catch (e) {
    Logger.log('FATAL ERROR IN TEST SUITE: ' + e.message);
    output.fatalError = e.message;
  }
  
  Logger.log('=== FINALIZANDO SAFETY NET TESTS ===');
  Logger.log(JSON.stringify(output, null, 2));
  return output;
}

// ============================================================================
// HELPERS
// ============================================================================

function runTestGroup(output, groupName, testFunctions) {
  testFunctions.forEach(function(testFn) {
    output.summary.total++;
    try {
      testFn();
      output.tests.push({ group: groupName, name: testFn.name, status: 'PASS' });
      output.summary.passed++;
      Logger.log('[PASS] ' + groupName + ': ' + testFn.name);
    } catch (e) {
      output.tests.push({ group: groupName, name: testFn.name, status: 'FAIL', error: e.message });
      output.summary.failed++;
      Logger.log('[FAIL] ' + groupName + ': ' + testFn.name + ' - ' + e.message);
    }
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error((message || '') + ' Expected ' + expected + ' but got ' + actual);
}

function assertClose(actual, expected, message) {
  if (Math.abs(actual - expected) > 0.001) throw new Error((message || '') + ' Expected ' + expected + ' but got ' + actual);
}

// ============================================================================
// TESTES: calcularValoresContabeis
// ============================================================================

function test_calcularValoresCenarioPadrao() {
  // 10 itens a R$ 5.00, recebidos 10
  var res = calcularValoresContabeis(10, 10, 5.00);
  
  assertEqual(res.qtdNF, 10, 'QtdNF deve ser preservada');
  assertEqual(res.qtdRecebida, 10, 'QtdRecebida deve ser preservada');
  assertEqual(res.diferenca, 0, 'Diferença deve ser 0');
  assertClose(res.valorNF, 50.00, 'ValorNF deve ser 50.00');
  assertClose(res.valorGlosa, 0.00, 'ValorGlosa deve ser 0.00');
  assertClose(res.valorAprovado, 50.00, 'ValorAprovado deve ser 50.00');
  assert(res.valido, 'Resultado deve ser válido');
}

function test_calcularValoresCenarioParcial() {
  // 10 itens a R$ 5.00, recebidos 8 (Glosa de 2 itens = R$ 10.00)
  var res = calcularValoresContabeis(10, 8, 5.00);
  
  assertEqual(res.diferenca, 2, 'Diferença deve ser 2');
  assertClose(res.valorGlosa, 10.00, 'ValorGlosa deve ser 10.00');
  assertClose(res.valorAprovado, 40.00, 'ValorAprovado deve ser 40.00');
  assertClose(res.percentualGlosa, 20.00, 'Percentual deve ser 20%');
}

function test_calcularValoresCenarioZero() {
  // 10 itens a R$ 5.00, recebido 0
  var res = calcularValoresContabeis(10, 0, 5.00);
  
  assertEqual(res.diferenca, 10);
  assertClose(res.valorGlosa, 50.00);
  assertClose(res.valorAprovado, 0.00);
  assertClose(res.percentualGlosa, 100.00);
}

function test_calcularValoresArredondamento() {
  // 3 itens a R$ 3.33 = 9.99
  // Recebido 1 = 3.33
  // Glosa 2 = 6.66
  var res = calcularValoresContabeis(3, 1, 3.33);
  
  assertClose(res.valorNF, 9.99);
  assertClose(res.valorGlosa, 6.66);
  assertClose(res.valorAprovado, 3.33);
}

// ============================================================================
// TESTES: validarIntegridadeContabil
// ============================================================================

function test_validacaoSucesso() {
  var dados = {
    decisao: 'APROVADO_TOTAL',
    quantidadeNF: 10,
    quantidadeRecebida: 10,
    valorNF: 50.00,
    valorGlosa: 0.00,
    valorAprovado: 50.00
  };
  
  var res = validarIntegridadeContabil(dados);
  assert(res.valido, 'Dados corretos devem ser válidos');
  assertEqual(res.erros.length, 0, 'Não deve haver erros');
}

function test_validacaoErroMatematico() {
  var dados = {
    decisao: 'APROVADO_TOTAL',
    quantidadeNF: 10,
    quantidadeRecebida: 10,
    valorNF: 50.00,
    valorGlosa: 0.00,
    valorAprovado: 40.00 // Erro intencional (faltam 10)
  };
  
  var res = validarIntegridadeContabil(dados);
  assert(!res.valido, 'Dados matemáticas incorretos devem falhar');
  assert(res.erros.length > 0, 'Deve reportar erros');
  assert(res.erros[0].indexOf('Erro contábil') !== -1, 'Deve identificar erro contábil');
}

function test_validacaoIncoerenciaDecisao() {
  var dados = {
    decisao: 'APROVADO_TOTAL', // Diz que aprovou tudo
    quantidadeNF: 10,
    quantidadeRecebida: 8,
    valorNF: 50.00,
    valorGlosa: 10.00, // Mas tem glosa
    valorAprovado: 40.00
  };
  
  var res = validarIntegridadeContabil(dados);
  assert(!res.valido, 'Decisão incoerente deve falhar');
  assert(res.erros.some(e => e.indexOf('incompatível') !== -1), 'Deve reportar incompatibilidade');
}
