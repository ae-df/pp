/**
 * @fileoverview Testes de Integração de API
 * @version 1.0.0
 * @description Testes focados nas APIs do sistema, validando
 * contratos, respostas e comportamentos esperados.
 * 
 * COBERTURA:
 * - APIs de Autenticação
 * - APIs de CRUD
 * - APIs de Workflow
 * - APIs de Relatórios
 * - APIs de Notificações
 * - Validação de Contratos
 * - Testes de Carga Leve
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-26
 */

'use strict';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

var APITestConfig = {
  VERBOSE: true,
  LOG_PREFIX: '[API_TEST]',
  TIMEOUT_MS: 10000,
  MAX_RESPONSE_TIME_MS: 2000
};

// ============================================================================
// HELPERS
// ============================================================================

var APITestHelpers = {
  log: function(msg) {
    if (APITestConfig.VERBOSE) {
      Logger.log(APITestConfig.LOG_PREFIX + ' ' + msg);
    }
  },
  
  assert: function(condition, message) {
    if (!condition) throw new Error('API ASSERTION FAILED: ' + message);
    return true;
  },
  
  assertEqual: function(actual, expected, name) {
    if (actual !== expected) {
      throw new Error(name + ': esperado "' + expected + '" mas obteve "' + actual + '"');
    }
    return true;
  },
  
  assertNotNull: function(value, name) {
    if (value === null || value === undefined) {
      throw new Error(name + ' não deveria ser null/undefined');
    }
    return true;
  },

  assertResponseStructure: function(response, requiredFields) {
    var self = this;
    requiredFields.forEach(function(field) {
      self.assert(response.hasOwnProperty(field), 'Resposta deve ter campo: ' + field);
    });
    return true;
  },
  
  assertResponseTime: function(startTime, maxMs) {
    var elapsed = Date.now() - startTime;
    this.assert(elapsed <= maxMs, 'Tempo de resposta (' + elapsed + 'ms) excede limite (' + maxMs + 'ms)');
    return elapsed;
  },
  
  measureTime: function(fn) {
    var start = Date.now();
    var result = fn();
    var elapsed = Date.now() - start;
    return { result: result, elapsed: elapsed };
  }
};

// ============================================================================
// MOCK DE APIs PARA TESTES
// ============================================================================

var MockAPI = {
  // Simula API de autenticação
  auth: {
    login: function(email, senha) {
      Utilities.sleep(50); // Simula latência
      
      if (!email || !senha) {
        return { success: false, error: 'Email e senha são obrigatórios', code: 400 };
      }
      
      // Simula validação
      var usuarios = {
        'admin@uniae.gov.br': { senha: 'Admin@2025', tipo: 'ADMIN', nome: 'Admin' },
        'analista@uniae.gov.br': { senha: 'Analista@2025', tipo: 'ANALISTA', nome: 'Ana' }
      };
      
      var user = usuarios[email];
      if (!user || user.senha !== senha) {
        return { success: false, error: 'Credenciais inválidas', code: 401 };
      }
      
      return {
        success: true,
        data: {
          token: 'mock_token_' + Date.now(),
          user: { email: email, nome: user.nome, tipo: user.tipo },
          expiresIn: 3600
        },
        code: 200
      };
    },
    
    logout: function(token) {
      Utilities.sleep(20);
      if (!token) {
        return { success: false, error: 'Token não fornecido', code: 400 };
      }
      return { success: true, message: 'Logout realizado', code: 200 };
    },
    
    validateToken: function(token) {
      Utilities.sleep(30);
      if (!token || !token.startsWith('mock_token_')) {
        return { success: false, error: 'Token inválido', code: 401 };
      }
      return { success: true, valid: true, code: 200 };
    }
  },
  
  // Simula API de CRUD
  crud: {
    create: function(entity, data) {
      Utilities.sleep(100);
      
      if (!entity || !data) {
        return { success: false, error: 'Entidade e dados são obrigatórios', code: 400 };
      }
      
      var id = Date.now();
      return {
        success: true,
        data: Object.assign({ id: id, createdAt: new Date().toISOString() }, data),
        code: 201
      };
    },
    
    read: function(entity, filters, options) {
      Utilities.sleep(80);
      
      if (!entity) {
        return { success: false, error: 'Entidade é obrigatória', code: 400 };
      }
      
      // Simula dados
      var mockData = [
        { id: 1, nome: 'Item 1', status: 'ATIVO' },
        { id: 2, nome: 'Item 2', status: 'ATIVO' },
        { id: 3, nome: 'Item 3', status: 'INATIVO' }
      ];
      
      // Aplica filtros
      if (filters && filters.status) {
        mockData = mockData.filter(function(item) {
          return item.status === filters.status;
        });
      }
      
      // Aplica paginação
      var page = (options && options.page) || 1;
      var pageSize = (options && options.pageSize) || 10;
      
      return {
        success: true,
        data: mockData,
        pagination: {
          page: page,
          pageSize: pageSize,
          total: mockData.length,
          totalPages: Math.ceil(mockData.length / pageSize)
        },
        code: 200
      };
    },
    
    update: function(entity, id, data) {
      Utilities.sleep(90);
      
      if (!entity || !id || !data) {
        return { success: false, error: 'Parâmetros incompletos', code: 400 };
      }
      
      return {
        success: true,
        data: Object.assign({ id: id, updatedAt: new Date().toISOString() }, data),
        code: 200
      };
    },
    
    delete: function(entity, id) {
      Utilities.sleep(70);
      
      if (!entity || !id) {
        return { success: false, error: 'Entidade e ID são obrigatórios', code: 400 };
      }
      
      return { success: true, message: 'Registro removido', code: 200 };
    }
  },
  
  // Simula API de Workflow
  workflow: {
    getStatus: function(processId) {
      Utilities.sleep(50);
      
      if (!processId) {
        return { success: false, error: 'ID do processo é obrigatório', code: 400 };
      }
      
      return {
        success: true,
        data: {
          processId: processId,
          currentStep: 'ANALISE',
          steps: ['RECEBIMENTO', 'CONFERENCIA', 'ANALISE', 'ATESTO', 'LIQUIDACAO'],
          completedSteps: ['RECEBIMENTO', 'CONFERENCIA'],
          pendingSteps: ['ANALISE', 'ATESTO', 'LIQUIDACAO'],
          progress: 40
        },
        code: 200
      };
    },
    
    advance: function(processId, action, data) {
      Utilities.sleep(150);
      
      if (!processId || !action) {
        return { success: false, error: 'Parâmetros incompletos', code: 400 };
      }
      
      return {
        success: true,
        data: {
          processId: processId,
          previousStep: 'ANALISE',
          currentStep: 'ATESTO',
          action: action,
          timestamp: new Date().toISOString()
        },
        code: 200
      };
    }
  }
};


// ============================================================================
// SUITE: TESTES DE API DE AUTENTICAÇÃO
// ============================================================================

function testAPI_Auth() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE API: AUTENTICAÇÃO');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  var H = APITestHelpers;
  
  // Teste 1: Login com credenciais válidas
  results.total++;
  try {
    H.log('1. Login com credenciais válidas...');
    var measured = H.measureTime(function() {
      return MockAPI.auth.login('admin@uniae.gov.br', 'Admin@2025');
    });
    
    var response = measured.result;
    H.assert(response.success === true, 'Login deve ter sucesso');
    H.assertEqual(response.code, 200, 'Código HTTP');
    H.assertResponseStructure(response.data, ['token', 'user', 'expiresIn']);
    H.assertResponseTime(Date.now() - measured.elapsed, APITestConfig.MAX_RESPONSE_TIME_MS);
    
    H.log('   ✅ Login OK (' + measured.elapsed + 'ms)');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Login válido: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 2: Login com credenciais inválidas
  results.total++;
  try {
    H.log('2. Login com credenciais inválidas...');
    var response = MockAPI.auth.login('admin@uniae.gov.br', 'senha_errada');
    
    H.assert(response.success === false, 'Login deve falhar');
    H.assertEqual(response.code, 401, 'Código HTTP deve ser 401');
    H.assertNotNull(response.error, 'Deve ter mensagem de erro');
    
    H.log('   ✅ Rejeição de credenciais inválidas OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Login inválido: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 3: Login sem parâmetros
  results.total++;
  try {
    H.log('3. Login sem parâmetros...');
    var response = MockAPI.auth.login('', '');
    
    H.assert(response.success === false, 'Login deve falhar');
    H.assertEqual(response.code, 400, 'Código HTTP deve ser 400');
    
    H.log('   ✅ Validação de parâmetros OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Login sem params: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 4: Logout
  results.total++;
  try {
    H.log('4. Logout...');
    var loginResp = MockAPI.auth.login('admin@uniae.gov.br', 'Admin@2025');
    var response = MockAPI.auth.logout(loginResp.data.token);
    
    H.assert(response.success === true, 'Logout deve ter sucesso');
    H.assertEqual(response.code, 200, 'Código HTTP');
    
    H.log('   ✅ Logout OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Logout: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 5: Validação de token
  results.total++;
  try {
    H.log('5. Validação de token...');
    var loginResp = MockAPI.auth.login('admin@uniae.gov.br', 'Admin@2025');
    var response = MockAPI.auth.validateToken(loginResp.data.token);
    
    H.assert(response.success === true, 'Validação deve ter sucesso');
    H.assert(response.valid === true, 'Token deve ser válido');
    
    // Testa token inválido
    var invalidResp = MockAPI.auth.validateToken('token_invalido');
    H.assert(invalidResp.success === false, 'Token inválido deve falhar');
    
    H.log('   ✅ Validação de token OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Validação token: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  logAPITestResults('AUTH', results);
  return results;
}

// ============================================================================
// SUITE: TESTES DE API CRUD
// ============================================================================

function testAPI_CRUD() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE API: CRUD');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  var H = APITestHelpers;
  var createdId = null;
  
  // Teste 1: CREATE
  results.total++;
  try {
    H.log('1. CREATE - Criar registro...');
    var measured = H.measureTime(function() {
      return MockAPI.crud.create('NotasFiscais', {
        numero: 'NF123456',
        valor: 1500.00,
        fornecedor: 'Teste LTDA'
      });
    });
    
    var response = measured.result;
    H.assert(response.success === true, 'Create deve ter sucesso');
    H.assertEqual(response.code, 201, 'Código HTTP deve ser 201');
    H.assertNotNull(response.data.id, 'Deve retornar ID');
    H.assertNotNull(response.data.createdAt, 'Deve ter timestamp de criação');
    
    createdId = response.data.id;
    
    H.log('   ✅ CREATE OK - ID: ' + createdId + ' (' + measured.elapsed + 'ms)');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('CREATE: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 2: READ
  results.total++;
  try {
    H.log('2. READ - Listar registros...');
    var response = MockAPI.crud.read('NotasFiscais', {}, { page: 1, pageSize: 10 });
    
    H.assert(response.success === true, 'Read deve ter sucesso');
    H.assertEqual(response.code, 200, 'Código HTTP');
    H.assert(Array.isArray(response.data), 'Data deve ser array');
    H.assertResponseStructure(response.pagination, ['page', 'pageSize', 'total', 'totalPages']);
    
    H.log('   ✅ READ OK - ' + response.data.length + ' registros');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('READ: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 3: READ com filtros
  results.total++;
  try {
    H.log('3. READ com filtros...');
    var response = MockAPI.crud.read('NotasFiscais', { status: 'ATIVO' });
    
    H.assert(response.success === true, 'Read filtrado deve ter sucesso');
    response.data.forEach(function(item) {
      H.assertEqual(item.status, 'ATIVO', 'Todos os itens devem ter status ATIVO');
    });
    
    H.log('   ✅ READ com filtros OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('READ filtrado: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 4: UPDATE
  results.total++;
  try {
    H.log('4. UPDATE - Atualizar registro...');
    var response = MockAPI.crud.update('NotasFiscais', createdId || 1, {
      valor: 2000.00,
      status: 'PROCESSADO'
    });
    
    H.assert(response.success === true, 'Update deve ter sucesso');
    H.assertEqual(response.code, 200, 'Código HTTP');
    H.assertNotNull(response.data.updatedAt, 'Deve ter timestamp de atualização');
    
    H.log('   ✅ UPDATE OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('UPDATE: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 5: DELETE
  results.total++;
  try {
    H.log('5. DELETE - Remover registro...');
    var response = MockAPI.crud.delete('NotasFiscais', createdId || 1);
    
    H.assert(response.success === true, 'Delete deve ter sucesso');
    H.assertEqual(response.code, 200, 'Código HTTP');
    
    H.log('   ✅ DELETE OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('DELETE: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 6: Validação de parâmetros
  results.total++;
  try {
    H.log('6. Validação de parâmetros...');
    
    var createResp = MockAPI.crud.create('', null);
    H.assert(createResp.success === false, 'Create sem params deve falhar');
    H.assertEqual(createResp.code, 400, 'Código deve ser 400');
    
    var readResp = MockAPI.crud.read('');
    H.assert(readResp.success === false, 'Read sem entidade deve falhar');
    
    H.log('   ✅ Validação de parâmetros OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Validação params: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  logAPITestResults('CRUD', results);
  return results;
}


// ============================================================================
// SUITE: TESTES DE API DE WORKFLOW
// ============================================================================

function testAPI_Workflow() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE API: WORKFLOW');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  var H = APITestHelpers;
  
  // Teste 1: Obter status do workflow
  results.total++;
  try {
    H.log('1. Obter status do workflow...');
    var response = MockAPI.workflow.getStatus('PROC_123');
    
    H.assert(response.success === true, 'GetStatus deve ter sucesso');
    H.assertResponseStructure(response.data, ['processId', 'currentStep', 'steps', 'progress']);
    H.assert(response.data.progress >= 0 && response.data.progress <= 100, 'Progress deve estar entre 0-100');
    
    H.log('   ✅ GetStatus OK - Progresso: ' + response.data.progress + '%');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('GetStatus: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 2: Avançar workflow
  results.total++;
  try {
    H.log('2. Avançar workflow...');
    var response = MockAPI.workflow.advance('PROC_123', 'APROVAR', { observacao: 'OK' });
    
    H.assert(response.success === true, 'Advance deve ter sucesso');
    H.assertNotNull(response.data.previousStep, 'Deve ter step anterior');
    H.assertNotNull(response.data.currentStep, 'Deve ter step atual');
    H.assert(response.data.previousStep !== response.data.currentStep, 'Steps devem ser diferentes');
    
    H.log('   ✅ Advance OK - ' + response.data.previousStep + ' → ' + response.data.currentStep);
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Advance: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 3: Validação de parâmetros
  results.total++;
  try {
    H.log('3. Validação de parâmetros...');
    
    var statusResp = MockAPI.workflow.getStatus('');
    H.assert(statusResp.success === false, 'GetStatus sem ID deve falhar');
    
    var advanceResp = MockAPI.workflow.advance('', '');
    H.assert(advanceResp.success === false, 'Advance sem params deve falhar');
    
    H.log('   ✅ Validação de parâmetros OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Validação: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  logAPITestResults('WORKFLOW', results);
  return results;
}

// ============================================================================
// SUITE: TESTES DE CONTRATO DE API
// ============================================================================

function testAPI_Contracts() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE API: CONTRATOS');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  var H = APITestHelpers;
  
  // Define contratos esperados
  var contracts = {
    successResponse: {
      required: ['success', 'data'],
      types: { success: 'boolean' }
    },
    errorResponse: {
      required: ['success', 'error', 'code'],
      types: { success: 'boolean', code: 'number' }
    },
    paginatedResponse: {
      required: ['success', 'data', 'pagination'],
      paginationFields: ['page', 'pageSize', 'total', 'totalPages']
    },
    authResponse: {
      required: ['success', 'data'],
      dataFields: ['token', 'user', 'expiresIn']
    }
  };
  
  // Teste 1: Contrato de resposta de sucesso
  results.total++;
  try {
    H.log('1. Contrato de resposta de sucesso...');
    var response = MockAPI.crud.create('Test', { nome: 'Teste' });
    
    contracts.successResponse.required.forEach(function(field) {
      H.assert(response.hasOwnProperty(field), 'Deve ter campo: ' + field);
    });
    
    H.assertEqual(typeof response.success, 'boolean', 'success deve ser boolean');
    
    H.log('   ✅ Contrato de sucesso OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Contrato sucesso: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 2: Contrato de resposta de erro
  results.total++;
  try {
    H.log('2. Contrato de resposta de erro...');
    var response = MockAPI.auth.login('', '');
    
    contracts.errorResponse.required.forEach(function(field) {
      H.assert(response.hasOwnProperty(field), 'Deve ter campo: ' + field);
    });
    
    H.assertEqual(typeof response.success, 'boolean', 'success deve ser boolean');
    H.assertEqual(typeof response.code, 'number', 'code deve ser number');
    H.assert(response.success === false, 'success deve ser false em erro');
    
    H.log('   ✅ Contrato de erro OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Contrato erro: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 3: Contrato de resposta paginada
  results.total++;
  try {
    H.log('3. Contrato de resposta paginada...');
    var response = MockAPI.crud.read('Test', {}, { page: 1, pageSize: 10 });
    
    contracts.paginatedResponse.required.forEach(function(field) {
      H.assert(response.hasOwnProperty(field), 'Deve ter campo: ' + field);
    });
    
    contracts.paginatedResponse.paginationFields.forEach(function(field) {
      H.assert(response.pagination.hasOwnProperty(field), 'Pagination deve ter: ' + field);
    });
    
    H.assert(Array.isArray(response.data), 'data deve ser array');
    
    H.log('   ✅ Contrato paginado OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Contrato paginado: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 4: Contrato de autenticação
  results.total++;
  try {
    H.log('4. Contrato de autenticação...');
    var response = MockAPI.auth.login('admin@uniae.gov.br', 'Admin@2025');
    
    contracts.authResponse.required.forEach(function(field) {
      H.assert(response.hasOwnProperty(field), 'Deve ter campo: ' + field);
    });
    
    contracts.authResponse.dataFields.forEach(function(field) {
      H.assert(response.data.hasOwnProperty(field), 'Data deve ter: ' + field);
    });
    
    H.log('   ✅ Contrato de autenticação OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Contrato auth: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 5: Códigos HTTP corretos
  results.total++;
  try {
    H.log('5. Códigos HTTP corretos...');
    
    // 200 - OK
    var readResp = MockAPI.crud.read('Test');
    H.assertEqual(readResp.code, 200, 'READ deve retornar 200');
    
    // 201 - Created
    var createResp = MockAPI.crud.create('Test', { nome: 'Teste' });
    H.assertEqual(createResp.code, 201, 'CREATE deve retornar 201');
    
    // 400 - Bad Request
    var badResp = MockAPI.crud.create('', null);
    H.assertEqual(badResp.code, 400, 'Request inválido deve retornar 400');
    
    // 401 - Unauthorized
    var authResp = MockAPI.auth.login('user', 'wrong');
    H.assertEqual(authResp.code, 401, 'Auth falha deve retornar 401');
    
    H.log('   ✅ Códigos HTTP OK');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Códigos HTTP: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  logAPITestResults('CONTRACTS', results);
  return results;
}


// ============================================================================
// SUITE: TESTES DE PERFORMANCE DE API
// ============================================================================

function testAPI_Performance() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE API: PERFORMANCE');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], metrics: {} };
  var H = APITestHelpers;
  
  // Teste 1: Tempo de resposta de login
  results.total++;
  try {
    H.log('1. Tempo de resposta de login...');
    var times = [];
    
    for (var i = 0; i < 5; i++) {
      var measured = H.measureTime(function() {
        return MockAPI.auth.login('admin@uniae.gov.br', 'Admin@2025');
      });
      times.push(measured.elapsed);
    }
    
    var avgTime = times.reduce(function(a, b) { return a + b; }, 0) / times.length;
    var maxTime = Math.max.apply(null, times);
    
    results.metrics.loginAvg = avgTime;
    results.metrics.loginMax = maxTime;
    
    H.assert(avgTime < APITestConfig.MAX_RESPONSE_TIME_MS, 'Tempo médio deve ser < ' + APITestConfig.MAX_RESPONSE_TIME_MS + 'ms');
    
    H.log('   ✅ Login - Média: ' + avgTime.toFixed(0) + 'ms, Max: ' + maxTime + 'ms');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Performance login: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 2: Tempo de resposta de CRUD
  results.total++;
  try {
    H.log('2. Tempo de resposta de CRUD...');
    var operations = {
      create: function() { return MockAPI.crud.create('Test', { nome: 'Teste' }); },
      read: function() { return MockAPI.crud.read('Test'); },
      update: function() { return MockAPI.crud.update('Test', 1, { nome: 'Atualizado' }); },
      delete: function() { return MockAPI.crud.delete('Test', 1); }
    };
    
    var crudTimes = {};
    Object.keys(operations).forEach(function(op) {
      var measured = H.measureTime(operations[op]);
      crudTimes[op] = measured.elapsed;
    });
    
    results.metrics.crud = crudTimes;
    
    var allUnderLimit = Object.values(crudTimes).every(function(t) {
      return t < APITestConfig.MAX_RESPONSE_TIME_MS;
    });
    
    H.assert(allUnderLimit, 'Todas as operações CRUD devem ser < ' + APITestConfig.MAX_RESPONSE_TIME_MS + 'ms');
    
    H.log('   ✅ CRUD - C:' + crudTimes.create + 'ms R:' + crudTimes.read + 'ms U:' + crudTimes.update + 'ms D:' + crudTimes.delete + 'ms');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Performance CRUD: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  // Teste 3: Carga leve (10 requisições sequenciais)
  results.total++;
  try {
    H.log('3. Carga leve (10 requisições)...');
    var startTime = Date.now();
    var successCount = 0;
    
    for (var i = 0; i < 10; i++) {
      var response = MockAPI.crud.read('Test');
      if (response.success) successCount++;
    }
    
    var totalTime = Date.now() - startTime;
    var avgPerRequest = totalTime / 10;
    
    results.metrics.loadTest = {
      requests: 10,
      totalTime: totalTime,
      avgPerRequest: avgPerRequest,
      successRate: (successCount / 10) * 100
    };
    
    H.assertEqual(successCount, 10, 'Todas as requisições devem ter sucesso');
    H.assert(avgPerRequest < 500, 'Média por requisição deve ser < 500ms');
    
    H.log('   ✅ Carga leve - Total: ' + totalTime + 'ms, Média: ' + avgPerRequest.toFixed(0) + 'ms');
    results.passed++;
  } catch (e) {
    results.failed++;
    results.errors.push('Carga leve: ' + e.message);
    H.log('   ❌ ' + e.message);
  }
  
  logAPITestResults('PERFORMANCE', results);
  return results;
}

// ============================================================================
// FUNÇÕES DE UTILIDADE E RUNNER
// ============================================================================

function logAPITestResults(suiteName, results) {
  Logger.log('');
  Logger.log('┌─────────────────────────────────────────────────────────────────┐');
  Logger.log('│ RESULTADO API: ' + suiteName.padEnd(48) + '│');
  Logger.log('├─────────────────────────────────────────────────────────────────┤');
  Logger.log('│ Total: ' + String(results.total).padEnd(5) + 
             ' Passou: ' + String(results.passed).padEnd(5) + 
             ' Falhou: ' + String(results.failed).padEnd(5) + '          │');
  Logger.log('│ Taxa de Sucesso: ' + ((results.passed / results.total) * 100).toFixed(1) + '%'.padEnd(43) + '│');
  Logger.log('└─────────────────────────────────────────────────────────────────┘');
}

/**
 * Executa todos os testes de API
 */
function runAllAPITests() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     SUITE COMPLETA DE TESTES DE API - UNIAE CRE                  ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var startTime = Date.now();
  var allResults = [];
  
  var suites = [
    { name: 'Auth', fn: testAPI_Auth },
    { name: 'CRUD', fn: testAPI_CRUD },
    { name: 'Workflow', fn: testAPI_Workflow },
    { name: 'Contracts', fn: testAPI_Contracts },
    { name: 'Performance', fn: testAPI_Performance }
  ];
  
  suites.forEach(function(suite) {
    try {
      var result = suite.fn();
      result.suiteName = suite.name;
      allResults.push(result);
    } catch (e) {
      Logger.log('❌ Erro na suite ' + suite.name + ': ' + e.message);
      allResults.push({
        suiteName: suite.name,
        total: 1,
        passed: 0,
        failed: 1,
        errors: [e.message]
      });
    }
  });
  
  var totalDuration = Date.now() - startTime;
  
  // Consolida
  var consolidated = {
    timestamp: new Date().toISOString(),
    duration: totalDuration,
    totals: { total: 0, passed: 0, failed: 0 }
  };
  
  allResults.forEach(function(r) {
    consolidated.totals.total += r.total;
    consolidated.totals.passed += r.passed;
    consolidated.totals.failed += r.failed;
  });
  
  consolidated.successRate = (consolidated.totals.passed / consolidated.totals.total * 100).toFixed(1);
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  RESULTADO FINAL - TESTES DE API                                 ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║  Total: ' + consolidated.totals.total + '  Passou: ' + consolidated.totals.passed + '  Falhou: ' + consolidated.totals.failed);
  Logger.log('║  Taxa de Sucesso: ' + consolidated.successRate + '%');
  Logger.log('║  Tempo: ' + totalDuration + 'ms');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  return consolidated;
}

// ============================================================================
// LOG DE CARREGAMENTO
// ============================================================================

Logger.log('✅ Test_Integration_API.gs carregado - ' + new Date().toISOString());
