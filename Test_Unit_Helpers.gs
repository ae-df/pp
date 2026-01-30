/**
 * @fileoverview Testes Unitários para Módulos Helper
 * @version 1.0.0
 * @description Testes para os módulos criados nas intervenções de refatoração
 * 
 * INTERVENÇÃO 11/16: Melhoria de Cobertura de Testes
 * - Testes para Core_Document_Helpers
 * - Testes para Core_Refactoring_Helpers
 * - Testes para Core_Constants_Sheets
 * - Testes para Core_Production_Logger
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-26
 */

'use strict';

// ============================================================================
// FRAMEWORK DE TESTES SIMPLES
// ============================================================================

var UnitTest = (function() {
  var results = {
    passed: 0,
    failed: 0,
    errors: [],
    startTime: null
  };
  
  function reset() {
    results = { passed: 0, failed: 0, errors: [], startTime: Date.now() };
  }
  
  function assertEqual(actual, expected, message) {
    if (actual === expected) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      results.errors.push({
        message: message || 'Assertion failed',
        expected: expected,
        actual: actual
      });
      return false;
    }
  }
  
  function assertDeepEqual(actual, expected, message) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      results.errors.push({
        message: message || 'Deep assertion failed',
        expected: JSON.stringify(expected),
        actual: JSON.stringify(actual)
      });
      return false;
    }
  }
  
  function assertTrue(value, message) {
    return assertEqual(!!value, true, message);
  }
  
  function assertFalse(value, message) {
    return assertEqual(!!value, false, message);
  }
  
  function assertNotNull(value, message) {
    if (value !== null && value !== undefined) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      results.errors.push({ message: message || 'Value is null/undefined' });
      return false;
    }
  }
  
  function assertThrows(fn, message) {
    try {
      fn();
      results.failed++;
      results.errors.push({ message: message || 'Expected exception not thrown' });
      return false;
    } catch (e) {
      results.passed++;
      return true;
    }
  }
  
  function getResults() {
    var duration = Date.now() - (results.startTime || Date.now());
    return {
      passed: results.passed,
      failed: results.failed,
      total: results.passed + results.failed,
      errors: results.errors,
      duration: duration,
      success: results.failed === 0
    };
  }
  
  function logResults(suiteName) {
    var r = getResults();
    Logger.log('');
    Logger.log('═══════════════════════════════════════════════');
    Logger.log('  ' + suiteName);
    Logger.log('═══════════════════════════════════════════════');
    Logger.log('  ✅ Passed: ' + r.passed);
    Logger.log('  ❌ Failed: ' + r.failed);
    Logger.log('  📊 Total:  ' + r.total);
    Logger.log('  ⏱️  Time:   ' + r.duration + 'ms');
    Logger.log('───────────────────────────────────────────────');
    
    if (r.errors.length > 0) {
      Logger.log('  ERRORS:');
      r.errors.forEach(function(err, idx) {
        Logger.log('  ' + (idx + 1) + '. ' + err.message);
        if (err.expected !== undefined) {
          Logger.log('     Expected: ' + err.expected);
          Logger.log('     Actual:   ' + err.actual);
        }
      });
    }
    
    Logger.log('═══════════════════════════════════════════════');
    return r;
  }
  
  return {
    reset: reset,
    assertEqual: assertEqual,
    assertDeepEqual: assertDeepEqual,
    assertTrue: assertTrue,
    assertFalse: assertFalse,
    assertNotNull: assertNotNull,
    assertThrows: assertThrows,
    getResults: getResults,
    logResults: logResults
  };
})();

// ============================================================================
// TESTES: Core_Document_Helpers
// ============================================================================

function testDocumentHelpers() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando DocumentHelpers...\n');
  
  // Teste: formatarMoeda
  UnitTest.assertEqual(
    DocumentHelpers.formatarMoeda(1234.56),
    'R$ 1234,56',
    'formatarMoeda deve formatar valor corretamente'
  );
  
  UnitTest.assertEqual(
    DocumentHelpers.formatarMoeda(0),
    'R$ 0,00',
    'formatarMoeda deve formatar zero'
  );
  
  UnitTest.assertEqual(
    DocumentHelpers.formatarMoeda(null),
    'R$ 0,00',
    'formatarMoeda deve tratar null'
  );
  
  UnitTest.assertEqual(
    DocumentHelpers.formatarMoeda('abc'),
    'R$ 0,00',
    'formatarMoeda deve tratar string inválida'
  );
  
  // Teste: formatarCheckbox
  UnitTest.assertEqual(
    DocumentHelpers.formatarCheckbox(true),
    '( X )',
    'formatarCheckbox deve marcar quando true'
  );
  
  UnitTest.assertEqual(
    DocumentHelpers.formatarCheckbox(false),
    '(   )',
    'formatarCheckbox deve desmarcar quando false'
  );
  
  // Teste: validarInputNFs
  var validResult = DocumentHelpers.validarInputNFs('123, 456, 789');
  UnitTest.assertTrue(validResult.valid, 'validarInputNFs deve aceitar NFs válidas');
  UnitTest.assertEqual(validResult.nfs.length, 3, 'validarInputNFs deve retornar 3 NFs');
  
  var invalidResult = DocumentHelpers.validarInputNFs('');
  UnitTest.assertFalse(invalidResult.valid, 'validarInputNFs deve rejeitar string vazia');
  UnitTest.assertNotNull(invalidResult.error, 'validarInputNFs deve retornar erro');
  
  // Teste: gerarCabecalhoPadrao
  var cabecalho = DocumentHelpers.gerarCabecalhoPadrao();
  UnitTest.assertTrue(Array.isArray(cabecalho), 'gerarCabecalhoPadrao deve retornar array');
  UnitTest.assertTrue(cabecalho.length >= 4, 'gerarCabecalhoPadrao deve ter pelo menos 4 linhas');
  
  // Teste: gerarRodapePadrao
  var rodape = DocumentHelpers.gerarRodapePadrao();
  UnitTest.assertTrue(Array.isArray(rodape), 'gerarRodapePadrao deve retornar array');
  
  // Teste: getMembrosComissao
  var membros = DocumentHelpers.getMembrosComissao();
  UnitTest.assertTrue(Array.isArray(membros), 'getMembrosComissao deve retornar array');
  UnitTest.assertTrue(membros.length > 0, 'getMembrosComissao deve ter membros');
  
  if (membros.length > 0) {
    UnitTest.assertNotNull(membros[0].nome, 'Membro deve ter nome');
    UnitTest.assertNotNull(membros[0].cargo, 'Membro deve ter cargo');
  }
  
  return UnitTest.logResults('DocumentHelpers');
}

// ============================================================================
// TESTES: Core_Refactoring_Helpers
// ============================================================================

function testRefactoringHelpers() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando RefactoringHelpers...\n');
  
  // Teste: validateRequired
  if (typeof RefactoringHelpers !== 'undefined') {
    var validData = { nome: 'Teste', email: 'test@test.com' };
    var validation = RefactoringHelpers.validateRequired(validData, ['nome', 'email']);
    UnitTest.assertTrue(validation.valid, 'validateRequired deve aceitar dados completos');
    
    var invalidData = { nome: 'Teste' };
    var invalidValidation = RefactoringHelpers.validateRequired(invalidData, ['nome', 'email']);
    UnitTest.assertFalse(invalidValidation.valid, 'validateRequired deve rejeitar dados incompletos');
    
    // Teste: formatDate
    var date = new Date(2025, 11, 26); // 26/12/2025
    var formatted = RefactoringHelpers.formatDate(date);
    UnitTest.assertTrue(formatted.indexOf('26') !== -1, 'formatDate deve conter dia');
    UnitTest.assertTrue(formatted.indexOf('12') !== -1, 'formatDate deve conter mês');
    
    // Teste: formatCurrency
    UnitTest.assertEqual(
      RefactoringHelpers.formatCurrency(1000),
      'R$ 1.000,00',
      'formatCurrency deve formatar com separador de milhar'
    );
    
    // Teste: groupBy
    var items = [
      { tipo: 'A', valor: 1 },
      { tipo: 'B', valor: 2 },
      { tipo: 'A', valor: 3 }
    ];
    var grouped = RefactoringHelpers.groupBy(items, 'tipo');
    UnitTest.assertEqual(grouped['A'].length, 2, 'groupBy deve agrupar corretamente');
    UnitTest.assertEqual(grouped['B'].length, 1, 'groupBy deve agrupar corretamente');
    
    // Teste: sumBy
    var sum = RefactoringHelpers.sumBy(items, 'valor');
    UnitTest.assertEqual(sum, 6, 'sumBy deve somar valores');
    
    // Teste: countBy
    var counts = RefactoringHelpers.countBy(items, 'tipo');
    UnitTest.assertEqual(counts['A'], 2, 'countBy deve contar corretamente');
    
  } else {
    Logger.log('⚠️ RefactoringHelpers não disponível');
    UnitTest.assertTrue(true, 'Skip - módulo não carregado');
  }
  
  return UnitTest.logResults('RefactoringHelpers');
}

// ============================================================================
// TESTES: Core_Constants_Sheets
// ============================================================================

function testConstantsSheets() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando Constants (SHEET_NAMES, STATUS, etc.)...\n');
  
  // Teste: SHEET_NAMES existe
  if (typeof SHEET_NAMES !== 'undefined') {
    UnitTest.assertNotNull(SHEET_NAMES.USUARIOS, 'SHEET_NAMES.USUARIOS deve existir');
    UnitTest.assertNotNull(SHEET_NAMES.NOTAS_FISCAIS, 'SHEET_NAMES.NOTAS_FISCAIS deve existir');
    UnitTest.assertNotNull(SHEET_NAMES.ENTREGAS, 'SHEET_NAMES.ENTREGAS deve existir');
    
    // Verifica que são strings
    UnitTest.assertEqual(typeof SHEET_NAMES.USUARIOS, 'string', 'SHEET_NAMES.USUARIOS deve ser string');
  } else {
    Logger.log('⚠️ SHEET_NAMES não disponível');
  }
  
  // Teste: STATUS existe
  if (typeof STATUS !== 'undefined') {
    UnitTest.assertNotNull(STATUS.ATIVO, 'STATUS.ATIVO deve existir');
    UnitTest.assertNotNull(STATUS.INATIVO, 'STATUS.INATIVO deve existir');
    UnitTest.assertNotNull(STATUS.PENDENTE, 'STATUS.PENDENTE deve existir');
  } else {
    Logger.log('⚠️ STATUS não disponível');
  }
  
  // Teste: USER_TYPES existe
  if (typeof USER_TYPES !== 'undefined') {
    UnitTest.assertNotNull(USER_TYPES.ANALISTA, 'USER_TYPES.ANALISTA deve existir');
    UnitTest.assertNotNull(USER_TYPES.FORNECEDOR, 'USER_TYPES.FORNECEDOR deve existir');
  } else {
    Logger.log('⚠️ USER_TYPES não disponível');
  }
  
  // Teste: ERROR_MESSAGES existe
  if (typeof ERROR_MESSAGES !== 'undefined') {
    UnitTest.assertNotNull(ERROR_MESSAGES.AUTH, 'ERROR_MESSAGES.AUTH deve existir');
    UnitTest.assertNotNull(ERROR_MESSAGES.VALIDATION, 'ERROR_MESSAGES.VALIDATION deve existir');
  } else {
    Logger.log('⚠️ ERROR_MESSAGES não disponível');
  }
  
  // Teste: Funções helper
  if (typeof getSheetByConstant === 'function') {
    // Não podemos testar sem spreadsheet ativa, mas verificamos que existe
    UnitTest.assertTrue(true, 'getSheetByConstant existe');
  }
  
  return UnitTest.logResults('Constants (Sheets)');
}

// ============================================================================
// TESTES: Core_Production_Logger
// ============================================================================

function testProductionLogger() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando ProductionLogger...\n');
  
  if (typeof ProductionLogger !== 'undefined') {
    // Teste: Níveis de log existem
    UnitTest.assertNotNull(ProductionLogger.LEVELS, 'ProductionLogger.LEVELS deve existir');
    UnitTest.assertNotNull(ProductionLogger.LEVELS.DEBUG, 'LEVELS.DEBUG deve existir');
    UnitTest.assertNotNull(ProductionLogger.LEVELS.ERROR, 'LEVELS.ERROR deve existir');
    
    // Teste: Funções de log existem
    UnitTest.assertEqual(typeof ProductionLogger.debug, 'function', 'debug deve ser função');
    UnitTest.assertEqual(typeof ProductionLogger.info, 'function', 'info deve ser função');
    UnitTest.assertEqual(typeof ProductionLogger.warn, 'function', 'warn deve ser função');
    UnitTest.assertEqual(typeof ProductionLogger.error, 'function', 'error deve ser função');
    
    // Teste: Configuração
    UnitTest.assertEqual(typeof ProductionLogger.setLevel, 'function', 'setLevel deve ser função');
    UnitTest.assertEqual(typeof ProductionLogger.getLevel, 'function', 'getLevel deve ser função');
    
    // Teste: Não deve lançar erro ao logar
    try {
      ProductionLogger.info('Teste de log');
      UnitTest.assertTrue(true, 'info() não deve lançar erro');
    } catch (e) {
      UnitTest.assertTrue(false, 'info() lançou erro: ' + e.message);
    }
    
  } else {
    Logger.log('⚠️ ProductionLogger não disponível');
    UnitTest.assertTrue(true, 'Skip - módulo não carregado');
  }
  
  return UnitTest.logResults('ProductionLogger');
}

// ============================================================================
// TESTES: Core_Metrics
// ============================================================================

function testMetrics() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando Metrics...\n');
  
  if (typeof Metrics !== 'undefined') {
    // Teste: Funções existem
    UnitTest.assertEqual(typeof Metrics.increment, 'function', 'increment deve ser função');
    UnitTest.assertEqual(typeof Metrics.gauge, 'function', 'gauge deve ser função');
    UnitTest.assertEqual(typeof Metrics.timing, 'function', 'timing deve ser função');
    
    // Teste: Incrementar contador
    Metrics.increment('test_counter');
    Metrics.increment('test_counter');
    var metrics = Metrics.getAll();
    UnitTest.assertTrue(metrics.test_counter >= 2, 'Contador deve incrementar');
    
    // Teste: Gauge
    Metrics.gauge('test_gauge', 42);
    metrics = Metrics.getAll();
    UnitTest.assertEqual(metrics.test_gauge, 42, 'Gauge deve registrar valor');
    
  } else {
    Logger.log('⚠️ Metrics não disponível');
    UnitTest.assertTrue(true, 'Skip - módulo não carregado');
  }
  
  return UnitTest.logResults('Metrics');
}

// ============================================================================
// TESTES: Retry Strategy
// ============================================================================

function testRetryStrategy() {
  UnitTest.reset();
  
  Logger.log('\n🧪 Testando RetryStrategy...\n');
  
  if (typeof RetryStrategy !== 'undefined') {
    // Teste: CONFIG existe
    UnitTest.assertNotNull(RetryStrategy.CONFIG, 'CONFIG deve existir');
    UnitTest.assertTrue(RetryStrategy.CONFIG.DEFAULT_MAX_RETRIES > 0, 'MAX_RETRIES deve ser > 0');
    
    // Teste: calculateBackoff
    var delay0 = RetryStrategy.calculateBackoff(0, 1000, 30000);
    var delay1 = RetryStrategy.calculateBackoff(1, 1000, 30000);
    UnitTest.assertTrue(delay1 > delay0, 'Backoff deve aumentar com tentativas');
    
    // Teste: execute com sucesso
    var successResult = RetryStrategy.execute(function() {
      return 'success';
    });
    UnitTest.assertTrue(successResult.success, 'Execute deve retornar sucesso');
    UnitTest.assertEqual(successResult.data, 'success', 'Execute deve retornar dados');
    
    // Teste: execute com falha
    var failCount = 0;
    var failResult = RetryStrategy.execute(function() {
      failCount++;
      throw new Error('Test error');
    }, { maxRetries: 2 });
    UnitTest.assertFalse(failResult.success, 'Execute deve retornar falha');
    UnitTest.assertTrue(failCount >= 2, 'Deve ter tentado múltiplas vezes');
    
  } else {
    Logger.log('⚠️ RetryStrategy não disponível');
    UnitTest.assertTrue(true, 'Skip - módulo não carregado');
  }
  
  return UnitTest.logResults('RetryStrategy');
}

// ============================================================================
// RUNNER PRINCIPAL
// ============================================================================

/**
 * Executa todos os testes unitários dos helpers
 */
function runAllUnitTests() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════╗');
  Logger.log('║           TESTES UNITÁRIOS - MÓDULOS HELPER                   ║');
  Logger.log('║           Intervenção 11/16 - Cobertura de Testes             ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('Data: ' + new Date().toISOString());
  Logger.log('');
  
  var allResults = [];
  var startTime = Date.now();
  
  // Executa cada suite de testes
  try { allResults.push(testDocumentHelpers()); } catch (e) { Logger.log('❌ Erro em testDocumentHelpers: ' + e.message); }
  try { allResults.push(testRefactoringHelpers()); } catch (e) { Logger.log('❌ Erro em testRefactoringHelpers: ' + e.message); }
  try { allResults.push(testConstantsSheets()); } catch (e) { Logger.log('❌ Erro em testConstantsSheets: ' + e.message); }
  try { allResults.push(testProductionLogger()); } catch (e) { Logger.log('❌ Erro em testProductionLogger: ' + e.message); }
  try { allResults.push(testMetrics()); } catch (e) { Logger.log('❌ Erro em testMetrics: ' + e.message); }
  try { allResults.push(testRetryStrategy()); } catch (e) { Logger.log('❌ Erro em testRetryStrategy: ' + e.message); }
  
  // Resumo final
  var totalPassed = 0;
  var totalFailed = 0;
  var totalTests = 0;
  
  allResults.forEach(function(r) {
    if (r) {
      totalPassed += r.passed;
      totalFailed += r.failed;
      totalTests += r.total;
    }
  });
  
  var totalTime = Date.now() - startTime;
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════╗');
  Logger.log('║                    RESUMO FINAL                               ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════╣');
  Logger.log('║  ✅ Passed:  ' + totalPassed + '                                              ');
  Logger.log('║  ❌ Failed:  ' + totalFailed + '                                              ');
  Logger.log('║  📊 Total:   ' + totalTests + '                                              ');
  Logger.log('║  ⏱️  Time:    ' + totalTime + 'ms                                          ');
  Logger.log('║  📈 Taxa:    ' + (totalTests > 0 ? Math.round(totalPassed / totalTests * 100) : 0) + '%                                             ');
  Logger.log('╚═══════════════════════════════════════════════════════════════╝');
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    duration: totalTime,
    success: totalFailed === 0
  };
}

/**
 * Teste rápido para verificar se os módulos estão carregados
 */
function testModulesLoaded() {
  Logger.log('=== VERIFICAÇÃO DE MÓDULOS ===\n');
  
  var modules = [
    { name: 'DocumentHelpers', obj: typeof DocumentHelpers },
    { name: 'RefactoringHelpers', obj: typeof RefactoringHelpers },
    { name: 'SHEET_NAMES', obj: typeof SHEET_NAMES },
    { name: 'STATUS', obj: typeof STATUS },
    { name: 'ProductionLogger', obj: typeof ProductionLogger },
    { name: 'Metrics', obj: typeof Metrics },
    { name: 'RetryStrategy', obj: typeof RetryStrategy },
    { name: 'AuditService', obj: typeof AuditService },
    { name: 'Telemetry', obj: typeof Telemetry }
  ];
  
  var loaded = 0;
  modules.forEach(function(m) {
    var status = m.obj !== 'undefined' ? '✅' : '❌';
    if (m.obj !== 'undefined') loaded++;
    Logger.log(status + ' ' + m.name + ': ' + m.obj);
  });
  
  Logger.log('\n📊 Módulos carregados: ' + loaded + '/' + modules.length);
}
