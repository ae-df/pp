/**
 * @fileoverview Testes para os módulos Core aprimorados
 * @version 1.0.0
 * @description Suite de testes para validar StandardResponse, Validator e CRUDEnhanced
 */

'use strict';

/**
 * Framework de testes simples
 */
var TestRunner = (function() {
  var results = {
    passed: 0,
    failed: 0,
    errors: []
  };
  
  function assert(condition, message) {
    if (condition) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      results.errors.push(message || 'Assertion failed');
      return false;
    }
  }
  
  function assertEqual(actual, expected, message) {
    var condition = JSON.stringify(actual) === JSON.stringify(expected);
    if (!condition) {
      message = (message || 'Values not equal') + 
        '\n  Expected: ' + JSON.stringify(expected) + 
        '\n  Actual: ' + JSON.stringify(actual);
    }
    return assert(condition, message);
  }
  
  function assertTrue(value, message) {
    return assert(value === true, message || 'Expected true');
  }
  
  function assertFalse(value, message) {
    return assert(value === false, message || 'Expected false');
  }
  
  function assertNotNull(value, message) {
    return assert(value !== null && value !== undefined, message || 'Expected non-null value');
  }
  
  function reset() {
    results = { passed: 0, failed: 0, errors: [] };
  }
  
  function getResults() {
    return results;
  }
  
  function logResults(suiteName) {
    Logger.log('');
    Logger.log('=== ' + suiteName + ' ===');
    Logger.log('Passed: ' + results.passed);
    Logger.log('Failed: ' + results.failed);
    if (results.errors.length > 0) {
      Logger.log('Errors:');
      results.errors.forEach(function(err, i) {
        Logger.log('  ' + (i + 1) + '. ' + err);
      });
    }
    Logger.log('');
  }
  
  return {
    assert: assert,
    assertEqual: assertEqual,
    assertTrue: assertTrue,
    assertFalse: assertFalse,
    assertNotNull: assertNotNull,
    reset: reset,
    getResults: getResults,
    logResults: logResults
  };
})();

// ============================================================================
// TESTES: StandardResponse
// ============================================================================

/**
 * Testa o módulo StandardResponse
 */
function testStandardResponse() {
  TestRunner.reset();
  
  // Test success response
  var successResp = StandardResponse.success({ id: 1 }, 'OK');
  TestRunner.assertTrue(successResp.success, 'success() should return success: true');
  TestRunner.assertEqual(successResp.data.id, 1, 'success() should include data');
  TestRunner.assertEqual(successResp.message, 'OK', 'success() should include message');
  TestRunner.assertNotNull(successResp.timestamp, 'success() should include timestamp');
  
  // Test error response
  var errorResp = StandardResponse.error('Falhou', 'ERR_001');
  TestRunner.assertFalse(errorResp.success, 'error() should return success: false');
  TestRunner.assertEqual(errorResp.error.message, 'Falhou', 'error() should include message');
  TestRunner.assertEqual(errorResp.error.code, 'ERR_001', 'error() should include code');
  
  // Test paginated response
  var paginatedResp = StandardResponse.paginated([1, 2, 3], 100, 1, 10);
  TestRunner.assertTrue(paginatedResp.success, 'paginated() should return success: true');
  TestRunner.assertEqual(paginatedResp.data.length, 3, 'paginated() should include data');
  TestRunner.assertEqual(paginatedResp.meta.pagination.total, 100, 'paginated() should include total');
  TestRunner.assertEqual(paginatedResp.meta.pagination.totalPages, 10, 'paginated() should calculate totalPages');
  TestRunner.assertTrue(paginatedResp.meta.pagination.hasNext, 'paginated() should indicate hasNext');
  
  // Test validation error response
  var validationResp = StandardResponse.validationError(['Campo obrigatório', 'Email inválido']);
  TestRunner.assertFalse(validationResp.success, 'validationError() should return success: false');
  TestRunner.assertEqual(validationResp.error.code, 'VALIDATION_ERROR', 'validationError() should have correct code');
  TestRunner.assertEqual(validationResp.error.validationErrors.length, 2, 'validationError() should include errors');
  
  // Test CRUD response
  var crudResp = StandardResponse.crud('CREATE', { id: 1 }, 'Usuario');
  TestRunner.assertTrue(crudResp.success, 'crud() should return success: true');
  TestRunner.assertTrue(crudResp.message.indexOf('Usuario') !== -1, 'crud() should include entity name');
  
  // Test wrap function
  var wrapSuccess = StandardResponse.wrap(function() { return { value: 42 }; });
  TestRunner.assertTrue(wrapSuccess.success, 'wrap() should return success for valid function');
  
  var wrapError = StandardResponse.wrap(function() { throw new Error('Test error'); });
  TestRunner.assertFalse(wrapError.success, 'wrap() should catch errors');
  
  TestRunner.logResults('StandardResponse Tests');
  return TestRunner.getResults();
}

// ============================================================================
// TESTES: Validator
// ============================================================================

/**
 * Testa o módulo Validator
 */
function testValidator() {
  TestRunner.reset();
  
  // Test required
  var reqValid = Validator.required('valor', 'campo');
  TestRunner.assertTrue(reqValid.valid, 'required() should pass for non-empty value');
  
  var reqInvalid = Validator.required('', 'campo');
  TestRunner.assertFalse(reqInvalid.valid, 'required() should fail for empty value');
  TestRunner.assertTrue(reqInvalid.errors[0].indexOf('campo') !== -1, 'required() error should include field name');
  
  // Test email
  var emailValid = Validator.email('test@example.com');
  TestRunner.assertTrue(emailValid.valid, 'email() should pass for valid email');
  
  var emailInvalid = Validator.email('invalid-email');
  TestRunner.assertFalse(emailInvalid.valid, 'email() should fail for invalid email');
  
  var emailEmpty = Validator.email('');
  TestRunner.assertTrue(emailEmpty.valid, 'email() should pass for empty (optional)');
  
  // Test CNPJ
  var cnpjValid = Validator.cnpj('11.222.333/0001-81');
  TestRunner.assertTrue(cnpjValid.valid, 'cnpj() should pass for valid CNPJ');
  
  var cnpjInvalid = Validator.cnpj('11.111.111/1111-11');
  TestRunner.assertFalse(cnpjInvalid.valid, 'cnpj() should fail for invalid CNPJ');
  
  var cnpjShort = Validator.cnpj('123');
  TestRunner.assertFalse(cnpjShort.valid, 'cnpj() should fail for short CNPJ');
  
  // Test CPF
  var cpfValid = Validator.cpf('529.982.247-25');
  TestRunner.assertTrue(cpfValid.valid, 'cpf() should pass for valid CPF');
  
  var cpfInvalid = Validator.cpf('111.111.111-11');
  TestRunner.assertFalse(cpfInvalid.valid, 'cpf() should fail for invalid CPF');
  
  // Test positiveNumber
  var numValid = Validator.positiveNumber(10, 'valor');
  TestRunner.assertTrue(numValid.valid, 'positiveNumber() should pass for positive number');
  
  var numInvalid = Validator.positiveNumber(-5, 'valor');
  TestRunner.assertFalse(numInvalid.valid, 'positiveNumber() should fail for negative number');
  
  var numZero = Validator.positiveNumber(0, 'valor');
  TestRunner.assertFalse(numZero.valid, 'positiveNumber() should fail for zero');
  
  // Test date
  var dateValid = Validator.date('2024-01-15', 'data');
  TestRunner.assertTrue(dateValid.valid, 'date() should pass for valid date');
  
  var dateInvalid = Validator.date('not-a-date', 'data');
  TestRunner.assertFalse(dateInvalid.valid, 'date() should fail for invalid date');
  
  // Test stringLength
  var lenValid = Validator.stringLength('hello', 3, 10, 'texto');
  TestRunner.assertTrue(lenValid.valid, 'stringLength() should pass for valid length');
  
  var lenShort = Validator.stringLength('hi', 3, 10, 'texto');
  TestRunner.assertFalse(lenShort.valid, 'stringLength() should fail for short string');
  
  var lenLong = Validator.stringLength('hello world!', 3, 10, 'texto');
  TestRunner.assertFalse(lenLong.valid, 'stringLength() should fail for long string');
  
  // Test inList
  var listValid = Validator.inList('A', ['A', 'B', 'C'], 'opcao');
  TestRunner.assertTrue(listValid.valid, 'inList() should pass for value in list');
  
  var listInvalid = Validator.inList('D', ['A', 'B', 'C'], 'opcao');
  TestRunner.assertFalse(listInvalid.valid, 'inList() should fail for value not in list');
  
  // Test chaveNFe
  var nfeValid = Validator.chaveNFe('12345678901234567890123456789012345678901234');
  TestRunner.assertTrue(nfeValid.valid, 'chaveNFe() should pass for 44 digits');
  
  var nfeInvalid = Validator.chaveNFe('123');
  TestRunner.assertFalse(nfeInvalid.valid, 'chaveNFe() should fail for wrong length');
  
  // Test validateObject
  var objResult = Validator.validateObject(
    { email: 'test@test.com', nome: 'Jo' },
    { email: ['required', 'email'], nome: ['required', { type: 'minLength', value: 3 }] }
  );
  TestRunner.assertFalse(objResult.valid, 'validateObject() should fail for invalid object');
  TestRunner.assertTrue(objResult.errors.length > 0, 'validateObject() should return errors');
  
  // Test pre-configured validators
  var nfResult = Validator.validators.notaFiscal({
    numeroNF: '123',
    fornecedorCNPJ: '11.222.333/0001-81',
    valorTotal: 100,
    dataEmissao: '2024-01-15'
  });
  TestRunner.assertTrue(nfResult.valid, 'notaFiscal validator should pass for valid data');
  
  TestRunner.logResults('Validator Tests');
  return TestRunner.getResults();
}

// ============================================================================
// TESTES: CRUDEnhanced (Mock)
// ============================================================================

/**
 * Testa estrutura do módulo CRUDEnhanced
 */
function testCRUDEnhancedStructure() {
  TestRunner.reset();
  
  // Verifica se o módulo existe
  TestRunner.assertNotNull(CRUDEnhanced, 'CRUDEnhanced should exist');
  
  // Verifica métodos
  TestRunner.assertEqual(typeof CRUDEnhanced.create, 'function', 'create should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.read, 'function', 'read should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.update, 'function', 'update should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.remove, 'function', 'remove should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.findById, 'function', 'findById should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.count, 'function', 'count should be a function');
  TestRunner.assertEqual(typeof CRUDEnhanced.bulkCreate, 'function', 'bulkCreate should be a function');
  
  // Verifica configurações
  TestRunner.assertNotNull(CRUDEnhanced.CONFIG, 'CONFIG should exist');
  TestRunner.assertTrue(CRUDEnhanced.CONFIG.DEFAULT_PAGE_SIZE > 0, 'DEFAULT_PAGE_SIZE should be positive');
  
  // Testa validação de entrada
  var invalidSheetResult = CRUDEnhanced.create('', {});
  TestRunner.assertFalse(invalidSheetResult.success, 'create should fail for empty sheet name');
  TestRunner.assertEqual(invalidSheetResult.error.code, 'INVALID_SHEET_NAME', 'should return correct error code');
  
  var invalidDataResult = CRUDEnhanced.create('Test', null);
  TestRunner.assertFalse(invalidDataResult.success, 'create should fail for null data');
  TestRunner.assertEqual(invalidDataResult.error.code, 'INVALID_DATA', 'should return correct error code');
  
  var invalidRowResult = CRUDEnhanced.update('Test', 0, {});
  TestRunner.assertFalse(invalidRowResult.success, 'update should fail for invalid row index');
  
  TestRunner.logResults('CRUDEnhanced Structure Tests');
  return TestRunner.getResults();
}

// ============================================================================
// TESTES: Integração
// ============================================================================

/**
 * Testa integração entre módulos
 */
function testIntegration() {
  TestRunner.reset();
  
  // Testa fluxo completo de validação + resposta
  var userData = {
    email: 'invalid-email',
    nome: 'Jo',
    senha: '123'
  };
  
  var validation = Validator.validators.usuario(userData);
  
  if (!validation.valid) {
    var response = StandardResponse.validationError(validation.errors);
    TestRunner.assertFalse(response.success, 'Integration: validation error should return failure');
    TestRunner.assertTrue(response.error.validationErrors.length > 0, 'Integration: should have validation errors');
  }
  
  // Testa fluxo de sucesso
  var validUserData = {
    email: 'test@example.com',
    nome: 'João Silva',
    senha: 'senha123',
    tipo: 'ANALISTA'
  };
  
  var validValidation = Validator.validators.usuario(validUserData);
  TestRunner.assertTrue(validValidation.valid, 'Integration: valid data should pass validation');
  
  if (validValidation.valid) {
    var successResponse = StandardResponse.crud('CREATE', validUserData, 'Usuario');
    TestRunner.assertTrue(successResponse.success, 'Integration: valid data should return success');
  }
  
  TestRunner.logResults('Integration Tests');
  return TestRunner.getResults();
}

// ============================================================================
// RUNNER PRINCIPAL
// ============================================================================

/**
 * Executa todos os testes
 */
function runAllEnhancedTests() {
  Logger.log('');
  Logger.log('╔════════════════════════════════════════════╗');
  Logger.log('║     SUITE DE TESTES - MÓDULOS ENHANCED     ║');
  Logger.log('╚════════════════════════════════════════════╝');
  Logger.log('');
  
  var allResults = {
    passed: 0,
    failed: 0,
    suites: []
  };
  
  // Executa cada suite
  var suites = [
    { name: 'StandardResponse', fn: testStandardResponse },
    { name: 'Validator', fn: testValidator },
    { name: 'CRUDEnhanced Structure', fn: testCRUDEnhancedStructure },
    { name: 'Integration', fn: testIntegration }
  ];
  
  suites.forEach(function(suite) {
    try {
      var result = suite.fn();
      allResults.passed += result.passed;
      allResults.failed += result.failed;
      allResults.suites.push({
        name: suite.name,
        passed: result.passed,
        failed: result.failed
      });
    } catch (e) {
      Logger.log('ERROR in ' + suite.name + ': ' + e.message);
      allResults.failed++;
      allResults.suites.push({
        name: suite.name,
        passed: 0,
        failed: 1,
        error: e.message
      });
    }
  });
  
  // Resumo final
  Logger.log('');
  Logger.log('╔════════════════════════════════════════════╗');
  Logger.log('║              RESUMO FINAL                  ║');
  Logger.log('╚════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('Total Passed: ' + allResults.passed);
  Logger.log('Total Failed: ' + allResults.failed);
  Logger.log('Success Rate: ' + (allResults.passed / (allResults.passed + allResults.failed) * 100).toFixed(1) + '%');
  Logger.log('');
  
  return allResults;
}

/**
 * Função de menu para executar testes
 */
function menuRunEnhancedTests() {
  var results = runAllEnhancedTests();
  
  var total = (results.passed || 0) + (results.failed || 0);
  var successRate = total > 0 ? ((results.passed || 0) / total * 100).toFixed(1) : '0.0';
  
  var message = 'Testes Executados!\n\n' +
    'Passou: ' + (results.passed || 0) + '\n' +
    'Falhou: ' + (results.failed || 0) + '\n' +
    'Taxa de Sucesso: ' + successRate + '%';
  
  // Usar getSafeUi para evitar erro de contexto
  var ui = typeof getSafeUi === 'function' ? getSafeUi() : null;
  
  if (ui) {
    ui.alert('Resultados dos Testes', message, ui.ButtonSet.OK);
  } else {
    Logger.log('=== RESULTADOS DOS TESTES ===');
    Logger.log(message);
  }
}
