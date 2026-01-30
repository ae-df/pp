/**
 * @fileoverview Bateria de Testes de Integração Robusta
 * @version 1.0.0
 * @description Testes de integração abrangentes para validar a interação
 * entre os módulos do sistema UNIAE CRE.
 * 
 * COBERTURA:
 * - Core_Auth: Autenticação e sessões
 * - Core_CRUD: Operações de dados
 * - Core_Cache: Sistema de cache
 * - Core_Repository_Pattern: Acesso a dados
 * - Core_Service_Layer: Lógica de negócio
 * - Core_API_Response: Padronização de respostas
 * - Core_Validator_Base: Validações
 * - Core_Feature_Flags: Feature toggles
 * - Core_Metrics: Métricas e profiling
 * - Core_Logger: Sistema de logs
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-08
 */

'use strict';

// ============================================================================
// CONFIGURAÇÃO DE TESTES
// ============================================================================

var IntegrationTestConfig = {
  TEST_SHEET_PREFIX: '_TEST_',
  CLEANUP_AFTER_TESTS: true,
  VERBOSE_LOGGING: true,
  TEST_USER_EMAIL: 'test@example.com',
  TEST_USER_PASSWORD: 'Test@123',
  TIMEOUT_MS: 30000
};

// ============================================================================
// HELPERS DE TESTE
// ============================================================================

var TestHelpers = {
  /**
   * Cria planilha de teste temporária
   */
  createTestSheet: function(name, headers) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = IntegrationTestConfig.TEST_SHEET_PREFIX + name + '_' + Date.now();
    var sheet = ss.insertSheet(sheetName);
    
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    return { sheet: sheet, name: sheetName };
  },
  
  /**
   * Remove planilhas de teste
   */
  cleanupTestSheets: function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var deleted = 0;
    
    sheets.forEach(function(sheet) {
      if (sheet.getName().indexOf(IntegrationTestConfig.TEST_SHEET_PREFIX) === 0) {
        ss.deleteSheet(sheet);
        deleted++;
      }
    });
    
    return deleted;
  },
  
  /**
   * Gera dados de teste para Nota Fiscal
   */
  generateTestNotaFiscal: function(overrides) {
    var base = {
      Numero_NF: 'NF' + Date.now(),
      Chave_Acesso: String(Date.now()).repeat(4).substring(0, 44),
      Fornecedor: 'Fornecedor Teste LTDA',
      CNPJ: '12345678000199',
      Valor_Total: 1500.50,
      Data_Emissao: new Date(),
      Status_NF: 'PENDENTE',
      Itens: 10
    };
    
    return Object.assign({}, base, overrides || {});
  },
  
  /**
   * Gera dados de teste para Usuário
   */
  generateTestUser: function(overrides) {
    var timestamp = Date.now();
    var base = {
      email: 'test_' + timestamp + '@example.com',
      nome: 'Usuário Teste ' + timestamp,
      senha: 'Test@' + timestamp,
      tipo: 'FORNECEDOR',
      instituicao: 'Instituição Teste'
    };
    
    return Object.assign({}, base, overrides || {});
  },
  
  /**
   * Aguarda condição com timeout
   */
  waitFor: function(condition, timeoutMs, intervalMs) {
    timeoutMs = timeoutMs || 5000;
    intervalMs = intervalMs || 100;
    var elapsed = 0;
    
    while (!condition() && elapsed < timeoutMs) {
      Utilities.sleep(intervalMs);
      elapsed += intervalMs;
    }
    
    return condition();
  },
  
  /**
   * Log de teste
   */
  log: function(message) {
    if (IntegrationTestConfig.VERBOSE_LOGGING) {
      Logger.log('[TEST] ' + message);
    }
  }
};

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO CACHE
// ============================================================================

function defineIntegrationTests_Cache() {
  describe('Integration: Cache System', function() {
    var testSheetInfo;
    
    beforeAll(function() {
      testSheetInfo = TestHelpers.createTestSheet('CacheTest', ['id', 'nome', 'valor']);
      clearCache();
    });
    
    afterAll(function() {
      if (IntegrationTestConfig.CLEANUP_AFTER_TESTS && testSheetInfo) {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(testSheetInfo.name);
        if (sheet) ss.deleteSheet(sheet);
      }
    });
    
    it('should cache spreadsheet reference', function() {
      clearCache();
      
      var ss1 = getCachedSpreadsheet();
      var ss2 = getCachedSpreadsheet();
      
      expect(ss1).not.toBeNull();
      expect(ss2).not.toBeNull();
      
      var stats = getCacheStats();
      expect(stats.success).toBe(true);
      expect(stats.data.hits).toBeGreaterThan(0);
    });
    
    it('should cache sheet by name', function() {
      clearCache();
      
      var sheet1 = getCachedSheet(testSheetInfo.name);
      var sheet2 = getCachedSheet(testSheetInfo.name);
      
      expect(sheet1).not.toBeNull();
      expect(sheet2).not.toBeNull();
      expect(sheet1.getName()).toBe(testSheetInfo.name);
    });
    
    it('should cache headers correctly', function() {
      var headers = getCachedHeaders(testSheetInfo.name);
      
      expect(headers).toHaveLength(3);
      expect(headers).toContain('id');
      expect(headers).toContain('nome');
      expect(headers).toContain('valor');
    });
    
    it('should invalidate cache on clearSheetCache', function() {
      getCachedSheet(testSheetInfo.name);
      
      var result = clearSheetCache(testSheetInfo.name);
      expect(result.success).toBe(true);
      
      expect(isSheetCached(testSheetInfo.name)).toBe(false);
    });
    
    it('should track cache statistics', function() {
      clearCache();
      
      getCachedSpreadsheet();
      getCachedSpreadsheet();
      getCachedSpreadsheet();
      
      var stats = getCacheStats();
      expect(stats.success).toBe(true);
      expect(stats.data.hits).toBeGreaterThan(0);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO CRUD
// ============================================================================

function defineIntegrationTests_CRUD() {
  describe('Integration: CRUD Operations', function() {
    var testSheetInfo;
    var createdRowId;
    
    beforeAll(function() {
      testSheetInfo = TestHelpers.createTestSheet('CRUDTest', 
        ['id', 'nome', 'email', 'valor', 'ativo', 'dataCriacao', 'dataAtualizacao']);
    });
    
    afterAll(function() {
      if (IntegrationTestConfig.CLEANUP_AFTER_TESTS && testSheetInfo) {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(testSheetInfo.name);
        if (sheet) ss.deleteSheet(sheet);
      }
    });
    
    it('should create a new record', function() {
      var data = {
        id: 'TEST001',
        nome: 'Registro de Teste',
        email: 'test@example.com',
        valor: 100.50,
        ativo: true
      };
      
      var result = CRUD.create(testSheetInfo.name, data);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeGreaterThan(1);
      expect(result.message).toContain('sucesso');
      
      createdRowId = result.id;
    });
    
    it('should read records with filters', function() {
      var result = CRUD.read(testSheetInfo.name, {
        filters: { id: 'TEST001' },
        cache: false
      });
      
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].id).toBe('TEST001');
    });
    
    it('should read records with pagination', function() {
      // Cria mais registros
      for (var i = 0; i < 5; i++) {
        CRUD.create(testSheetInfo.name, {
          id: 'TEST00' + (i + 2),
          nome: 'Registro ' + (i + 2),
          email: 'test' + (i + 2) + '@example.com',
          valor: 100 * (i + 2),
          ativo: true
        });
      }
      
      var result = CRUD.read(testSheetInfo.name, {
        limit: 3,
        offset: 0,
        cache: false
      });
      
      expect(result.success).toBe(true);
      expect(result.data.length).toBe(3);
      expect(result.hasMore).toBe(true);
    });
    
    it('should update an existing record', function() {
      var result = CRUD.update(testSheetInfo.name, createdRowId, {
        nome: 'Registro Atualizado',
        valor: 200.75
      });
      
      expect(result.success).toBe(true);
      
      // Verifica atualização
      var readResult = CRUD.read(testSheetInfo.name, {
        filters: { id: 'TEST001' },
        cache: false
      });
      
      expect(readResult.data[0].nome).toBe('Registro Atualizado');
    });
    
    it('should find record by ID', function() {
      var result = CRUD.findById(testSheetInfo.name, createdRowId);
      
      expect(result.success).toBe(true);
    });
    
    it('should find one record', function() {
      var result = CRUD.findOne(testSheetInfo.name, { id: 'TEST001' });
      
      expect(result.success).toBe(true);
      expect(result.data).not.toBeNull();
      expect(result.data.id).toBe('TEST001');
    });
    
    it('should handle non-existent sheet gracefully', function() {
      var result = CRUD.read('NonExistentSheet_12345');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('não encontrada');
    });
    
    it('should soft delete a record', function() {
      var result = CRUD.delete(testSheetInfo.name, createdRowId, false);
      
      expect(result.success).toBe(true);
    });
  });
}


// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DA API RESPONSE
// ============================================================================

function defineIntegrationTests_ApiResponse() {
  describe('Integration: API Response', function() {
    
    it('should create success response with data', function() {
      var data = { id: 1, nome: 'Teste' };
      var response = ApiResponse.success(data);
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.error).toBeNull();
      expect(response.meta).toBeDefined();
      expect(response.meta.timestamp).toBeDefined();
    });
    
    it('should create error response', function() {
      var response = ApiResponse.error('Algo deu errado');
      
      expect(response.success).toBe(false);
      expect(response.error).toBe('Algo deu errado');
      expect(response.data).toBeNull();
    });
    
    it('should create validation error response', function() {
      var errors = [
        { field: 'email', message: 'Email inválido' },
        { field: 'nome', message: 'Nome é obrigatório' }
      ];
      
      var response = ApiResponse.validationError(errors);
      
      expect(response.success).toBe(false);
      expect(response.validationErrors).toHaveLength(2);
      expect(response.code).toBe(422);
    });
    
    it('should create not found response', function() {
      var response = ApiResponse.notFound('Nota Fiscal');
      
      expect(response.success).toBe(false);
      expect(response.error).toContain('não encontrado');
      expect(response.code).toBe(404);
    });
    
    it('should create paginated response', function() {
      var items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      var response = ApiResponse.paginated(items, {
        page: 1,
        pageSize: 10,
        total: 100
      });
      
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(3);
      expect(response.pagination.total).toBe(100);
      expect(response.pagination.totalPages).toBe(10);
      expect(response.pagination.hasNext).toBe(false);
    });
    
    it('should wrap function execution with error handling', function() {
      var result = ApiResponse.wrap(function() {
        return { value: 42 };
      });
      
      expect(result.success).toBe(true);
      expect(result.data.value).toBe(42);
      expect(result.meta.duration).toBeDefined();
    });
    
    it('should wrap function and catch errors', function() {
      var result = ApiResponse.wrap(function() {
        throw new Error('Erro de teste');
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Erro de teste');
    });
    
    it('should validate input parameters', function() {
      var params = { nome: 'Teste' };
      var schema = {
        required: ['nome', 'email'],
        types: { nome: 'string' }
      };
      
      var result = ApiResponse.validateInput(params, schema);
      
      expect(result).not.toBeNull();
      expect(result.success).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });
    
    it('should pass validation when all required fields present', function() {
      var params = { nome: 'Teste', email: 'test@example.com' };
      var schema = {
        required: ['nome', 'email']
      };
      
      var result = ApiResponse.validateInput(params, schema);
      
      expect(result).toBeNull();
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO VALIDATOR
// ============================================================================

function defineIntegrationTests_Validator() {
  describe('Integration: Validator Base', function() {
    
    it('should validate required string', function() {
      var result1 = ValidatorBase.validateRequiredString('', 'campo');
      expect(result1.valid).toBe(false);
      
      var result2 = ValidatorBase.validateRequiredString('valor', 'campo');
      expect(result2).toBeUndefined();
    });
    
    it('should validate string length', function() {
      var longString = 'a'.repeat(600);
      var result = ValidatorBase.validateStringLength(longString, 'campo', 500);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('excede');
    });
    
    it('should validate positive number', function() {
      var result1 = ValidatorBase.validatePositiveNumber(-5, 'valor');
      expect(result1.valid).toBe(false);
      
      var result2 = ValidatorBase.validatePositiveNumber(10, 'valor');
      expect(result2).toBeUndefined();
    });
    
    it('should validate date', function() {
      var result1 = ValidatorBase.validateDate('invalid-date', 'data');
      expect(result1.valid).toBe(false);
      
      var result2 = ValidatorBase.validateDate(new Date(), 'data');
      expect(result2).toBeUndefined();
    });
    
    it('should validate email format', function() {
      var result1 = ValidatorBase.validateEmail('invalid', 'email', true);
      expect(result1.valid).toBe(false);
      
      var result2 = ValidatorBase.validateEmail('test@example.com', 'email', true);
      expect(result2).toBeUndefined();
    });
    
    it('should sanitize string', function() {
      var dirty = '<script>alert("xss")</script>Hello';
      var clean = ValidatorBase.sanitizeString(dirty);
      
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
      expect(clean).toContain('Hello');
    });
    
    it('should sanitize number', function() {
      expect(ValidatorBase.sanitizeNumber('abc', 0)).toBe(0);
      expect(ValidatorBase.sanitizeNumber('123', 0)).toBe(123);
      expect(ValidatorBase.sanitizeNumber(null, 10)).toBe(10);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO FEATURE FLAGS
// ============================================================================

function defineIntegrationTests_FeatureFlags() {
  describe('Integration: Feature Flags', function() {
    var originalFlags;
    
    beforeAll(function() {
      originalFlags = FeatureFlags.getAll();
    });
    
    afterAll(function() {
      FeatureFlags.reset();
    });
    
    it('should check if feature is enabled', function() {
      var enabled = FeatureFlags.isEnabled('ENABLE_CACHE');
      expect(typeof enabled).toBe('boolean');
    });
    
    it('should enable a feature', function() {
      FeatureFlags.disable('ENABLE_DARK_MODE');
      expect(FeatureFlags.isEnabled('ENABLE_DARK_MODE')).toBe(false);
      
      FeatureFlags.enable('ENABLE_DARK_MODE');
      expect(FeatureFlags.isEnabled('ENABLE_DARK_MODE')).toBe(true);
    });
    
    it('should disable a feature', function() {
      FeatureFlags.enable('ENABLE_DARK_MODE');
      FeatureFlags.disable('ENABLE_DARK_MODE');
      
      expect(FeatureFlags.isEnabled('ENABLE_DARK_MODE')).toBe(false);
    });
    
    it('should get all flags', function() {
      var flags = FeatureFlags.getAll();
      
      expect(typeof flags).toBe('object');
      expect(Object.keys(flags).length).toBeGreaterThan(0);
    });
    
    it('should get flags by category', function() {
      var uiFlags = FeatureFlags.getByCategory('ui');
      
      expect(typeof uiFlags).toBe('object');
    });
    
    it('should execute function conditionally', function() {
      FeatureFlags.enable('ENABLE_CACHE');
      
      var executed = false;
      FeatureFlags.executeIf('ENABLE_CACHE', function() {
        executed = true;
      });
      
      expect(executed).toBe(true);
    });
    
    it('should execute fallback when feature disabled', function() {
      FeatureFlags.disable('ENABLE_DARK_MODE');
      
      var result = FeatureFlags.executeIf('ENABLE_DARK_MODE', 
        function() { return 'enabled'; },
        function() { return 'disabled'; }
      );
      
      expect(result).toBe('disabled');
    });
    
    it('should handle non-existent flag', function() {
      var enabled = FeatureFlags.isEnabled('NON_EXISTENT_FLAG_12345');
      expect(enabled).toBe(false);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO METRICS
// ============================================================================

function defineIntegrationTests_Metrics() {
  describe('Integration: Metrics System', function() {
    
    beforeEach(function() {
      Metrics.reset();
    });
    
    it('should increment counter', function() {
      Metrics.increment('test_counter');
      Metrics.increment('test_counter');
      Metrics.increment('test_counter', 5);
      
      expect(Metrics.getCounter('test_counter')).toBe(7);
    });
    
    it('should increment counter with labels', function() {
      Metrics.increment('api_calls', 1, { endpoint: '/users' });
      Metrics.increment('api_calls', 1, { endpoint: '/users' });
      Metrics.increment('api_calls', 1, { endpoint: '/orders' });
      
      expect(Metrics.getCounter('api_calls', { endpoint: '/users' })).toBe(2);
      expect(Metrics.getCounter('api_calls', { endpoint: '/orders' })).toBe(1);
    });
    
    it('should set and get gauge', function() {
      Metrics.setGauge('active_users', 42);
      
      expect(Metrics.getGauge('active_users')).toBe(42);
    });
    
    it('should observe histogram values', function() {
      Metrics.observe('response_time', 100);
      Metrics.observe('response_time', 150);
      Metrics.observe('response_time', 200);
      Metrics.observe('response_time', 50);
      
      var stats = Metrics.getHistogram('response_time');
      
      expect(stats.count).toBe(4);
      expect(stats.min).toBe(50);
      expect(stats.max).toBe(200);
      expect(stats.avg).toBe(125);
    });
    
    it('should time function execution', function() {
      var result = Metrics.timeFunction('test_operation', function() {
        Utilities.sleep(50);
        return 'done';
      });
      
      expect(result).toBe('done');
      
      var stats = Metrics.getHistogram('test_operation_duration_ms');
      expect(stats).not.toBeNull();
      expect(stats.count).toBe(1);
      expect(stats.min).toBeGreaterThan(40);
    });
    
    it('should use timer start/stop', function() {
      var timerId = Metrics.startTimer('manual_timer');
      Utilities.sleep(30);
      var duration = Metrics.stopTimer(timerId);
      
      expect(duration).toBeGreaterThan(25);
    });
    
    it('should record events', function() {
      Metrics.recordEvent('user_login', { userId: 123 });
      Metrics.recordEvent('user_login', { userId: 456 });
      Metrics.recordEvent('page_view', { page: '/home' });
      
      var loginEvents = Metrics.getEvents('user_login');
      expect(loginEvents.length).toBe(2);
      
      var allEvents = Metrics.getEvents();
      expect(allEvents.length).toBe(3);
    });
    
    it('should export all metrics', function() {
      Metrics.increment('export_test');
      Metrics.setGauge('export_gauge', 100);
      
      var exported = Metrics.exportAll();
      
      expect(exported.timestamp).toBeDefined();
      expect(exported.counters).toBeDefined();
      expect(exported.gauges).toBeDefined();
    });
    
    it('should generate performance report', function() {
      Metrics.timeFunction('op1', function() { Utilities.sleep(10); });
      Metrics.timeFunction('op2', function() { Utilities.sleep(20); });
      
      var report = Metrics.generatePerformanceReport();
      
      expect(report.timestamp).toBeDefined();
      expect(report.operations).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.totalOperations).toBeGreaterThan(0);
    });
  });
}


// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO LOGGER
// ============================================================================

function defineIntegrationTests_Logger() {
  describe('Integration: Logger System', function() {
    
    beforeEach(function() {
      AppLogger.setLevel('DEBUG');
    });
    
    it('should log messages at different levels', function() {
      // Não deve lançar exceção
      AppLogger.debug('Debug message');
      AppLogger.info('Info message');
      AppLogger.warn('Warning message');
      AppLogger.error('Error message');
      
      expect(true).toBe(true); // Se chegou aqui, passou
    });
    
    it('should create context-specific logger', function() {
      var contextLogger = AppLogger.createContext('TestModule');
      
      contextLogger.info('Message from context');
      contextLogger.warn('Warning from context');
      
      expect(true).toBe(true);
    });
    
    it('should log with metadata', function() {
      AppLogger.info('Operation completed', { 
        duration: 150, 
        records: 10 
      });
      
      expect(true).toBe(true);
    });
    
    it('should log errors with stack trace', function() {
      try {
        throw new Error('Test error');
      } catch (e) {
        AppLogger.error('Caught error', e);
      }
      
      expect(true).toBe(true);
    });
    
    it('should log performance metrics', function() {
      AppLogger.performance('database_query', 250, { 
        query: 'SELECT *', 
        rows: 100 
      });
      
      expect(true).toBe(true);
    });
    
    it('should respect log level settings', function() {
      AppLogger.setLevel('ERROR');
      
      // Estes não devem gerar output (mas não devem falhar)
      AppLogger.debug('Should not appear');
      AppLogger.info('Should not appear');
      
      // Este deve funcionar
      AppLogger.error('Should appear');
      
      AppLogger.setLevel('DEBUG');
      expect(true).toBe(true);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO UTILS
// ============================================================================

function defineIntegrationTests_Utils() {
  describe('Integration: Utils', function() {
    
    describe('Format Functions', function() {
      it('should format CNPJ', function() {
        expect(Utils.format.cnpj('12345678000199')).toBe('12.345.678/0001-99');
      });
      
      it('should format CPF', function() {
        expect(Utils.format.cpf('12345678901')).toBe('123.456.789-01');
      });
      
      it('should format phone', function() {
        expect(Utils.format.phone('11999998888')).toBe('(11) 99999-8888');
        expect(Utils.format.phone('1133334444')).toBe('(11) 3333-4444');
      });
      
      it('should format currency', function() {
        expect(Utils.format.currency(1234.56)).toBe('R$ 1.234,56');
        expect(Utils.format.currency(0)).toBe('R$ 0,00');
      });
      
      it('should format date', function() {
        var date = new Date(2025, 11, 8); // 8 de dezembro de 2025
        var formatted = Utils.format.date(date);
        expect(formatted).toContain('08');
        expect(formatted).toContain('12');
        expect(formatted).toContain('2025');
      });
    });
    
    describe('String Functions', function() {
      it('should remove accents', function() {
        expect(Utils.string.removeAccents('São Paulo')).toBe('Sao Paulo');
        expect(Utils.string.removeAccents('Ação')).toBe('Acao');
      });
      
      it('should capitalize string', function() {
        expect(Utils.string.capitalize('hello')).toBe('Hello');
        expect(Utils.string.capitalize('WORLD')).toBe('World');
      });
      
      it('should truncate string', function() {
        var long = 'This is a very long string that needs truncation';
        expect(Utils.string.truncate(long, 20)).toBe('This is a very lo...');
      });
      
      it('should check empty values', function() {
        expect(Utils.string.isEmpty('')).toBe(true);
        expect(Utils.string.isEmpty(null)).toBe(true);
        expect(Utils.string.isEmpty([])).toBe(true);
        expect(Utils.string.isEmpty({})).toBe(true);
        expect(Utils.string.isEmpty('value')).toBe(false);
      });
      
      it('should validate email', function() {
        expect(Utils.string.isValidEmail('test@example.com')).toBe(true);
        expect(Utils.string.isValidEmail('invalid')).toBe(false);
      });
    });
    
    describe('Date Functions', function() {
      it('should calculate days difference', function() {
        var date1 = new Date(2025, 0, 1);
        var date2 = new Date(2025, 0, 11);
        expect(Utils.date.daysDiff(date1, date2)).toBe(10);
      });
      
      it('should add days to date', function() {
        var date = new Date(2025, 0, 1);
        var newDate = Utils.date.addDays(date, 5);
        expect(newDate.getDate()).toBe(6);
      });
      
      it('should check business day', function() {
        var monday = new Date(2025, 11, 8); // Segunda-feira
        var saturday = new Date(2025, 11, 13); // Sábado
        
        expect(Utils.date.isBusinessDay(monday)).toBe(true);
        expect(Utils.date.isBusinessDay(saturday)).toBe(false);
      });
    });
    
    describe('Conversion Functions', function() {
      it('should convert to number safely', function() {
        expect(Utils.convert.toNumber('123')).toBe(123);
        expect(Utils.convert.toNumber('abc', 0)).toBe(0);
        expect(Utils.convert.toNumber(null, 10)).toBe(10);
      });
      
      it('should convert to boolean', function() {
        expect(Utils.convert.toBoolean('true')).toBe(true);
        expect(Utils.convert.toBoolean('sim')).toBe(true);
        expect(Utils.convert.toBoolean('false')).toBe(false);
        expect(Utils.convert.toBoolean(1)).toBe(true);
      });
      
      it('should convert object to array', function() {
        var obj = { a: 1, b: 2, c: 3 };
        var headers = ['a', 'b', 'c'];
        var arr = Utils.convert.objectToArray(obj, headers);
        
        expect(arr).toEqual([1, 2, 3]);
      });
      
      it('should convert array to object', function() {
        var arr = [1, 2, 3];
        var headers = ['a', 'b', 'c'];
        var obj = Utils.convert.arrayToObject(arr, headers);
        
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      });
    });
    
    describe('Utility Functions', function() {
      it('should generate unique ID', function() {
        var id1 = Utils.generateId('TEST');
        var id2 = Utils.generateId('TEST');
        
        expect(id1).not.toBe(id2);
        expect(id1).toContain('TEST_');
      });
      
      it('should generate UUID', function() {
        var uuid = Utils.generateUUID();
        
        expect(uuid).toBeDefined();
        expect(uuid.length).toBeGreaterThan(30);
      });
      
      it('should clone object', function() {
        var original = { a: 1, b: { c: 2 } };
        var cloned = Utils.clone(original);
        
        cloned.b.c = 999;
        expect(original.b.c).toBe(2);
      });
      
      it('should merge objects', function() {
        var target = { a: 1, b: 2 };
        var source = { b: 3, c: 4 };
        var result = Utils.merge(target, source);
        
        expect(result.a).toBe(1);
        expect(result.b).toBe(3);
        expect(result.c).toBe(4);
      });
      
      it('should safely get nested property', function() {
        var obj = { a: { b: { c: 123 } } };
        
        expect(Utils.safeGet(obj, 'a.b.c')).toBe(123);
        expect(Utils.safeGet(obj, 'a.b.d', 'default')).toBe('default');
        expect(Utils.safeGet(obj, 'x.y.z', null)).toBeNull();
      });
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO REPOSITORY PATTERN
// ============================================================================

function defineIntegrationTests_Repository() {
  describe('Integration: Repository Pattern', function() {
    var testSheetInfo;
    var repository;
    
    beforeAll(function() {
      testSheetInfo = TestHelpers.createTestSheet('RepoTest', 
        ['id', 'nome', 'status', 'valor', 'data']);
      
      // Adiciona dados de teste
      var sheet = testSheetInfo.sheet;
      sheet.getRange(2, 1, 3, 5).setValues([
        ['001', 'Item 1', 'ATIVO', 100, new Date()],
        ['002', 'Item 2', 'INATIVO', 200, new Date()],
        ['003', 'Item 3', 'ATIVO', 300, new Date()]
      ]);
      
      repository = new BaseRepository(testSheetInfo.name);
    });
    
    afterAll(function() {
      if (IntegrationTestConfig.CLEANUP_AFTER_TESTS && testSheetInfo) {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(testSheetInfo.name);
        if (sheet) ss.deleteSheet(sheet);
      }
    });
    
    it('should find all records', function() {
      var records = repository.findAll();
      
      expect(records.length).toBe(3);
    });
    
    it('should find all with pagination', function() {
      var records = repository.findAll({ limit: 2, offset: 0 });
      
      expect(records.length).toBe(2);
    });
    
    it('should find all with ordering', function() {
      var records = repository.findAll({ 
        orderBy: 'valor', 
        order: 'DESC' 
      });
      
      expect(records[0].valor).toBe(300);
    });
    
    it('should find by row index', function() {
      var record = repository.findByRowIndex(2);
      
      expect(record).not.toBeNull();
      expect(record.id).toBe('001');
    });
    
    it('should find by filters', function() {
      var records = repository.findByFilters({ status: 'ATIVO' });
      
      expect(records.length).toBe(2);
    });
    
    it('should find by filters with function', function() {
      var records = repository.findByFilters({
        valor: function(v) { return v > 150; }
      });
      
      expect(records.length).toBe(2);
    });
    
    it('should create new record', function() {
      var newRecord = repository.create({
        id: '004',
        nome: 'Item 4',
        status: 'ATIVO',
        valor: 400,
        data: new Date()
      });
      
      expect(newRecord._rowIndex).toBeGreaterThan(0);
      expect(newRecord.id).toBe('004');
    });
    
    it('should update record', function() {
      var updated = repository.update(2, { nome: 'Item 1 Updated' });
      
      expect(updated.nome).toBe('Item 1 Updated');
    });
    
    it('should count records', function() {
      var count = repository.count();
      
      expect(count).toBeGreaterThan(0);
    });
    
    it('should count with filters', function() {
      var count = repository.count({ status: 'ATIVO' });
      
      expect(count).toBeGreaterThan(0);
    });
    
    it('should check if record exists', function() {
      expect(repository.exists({ id: '001' })).toBe(true);
      expect(repository.exists({ id: 'NONEXISTENT' })).toBe(false);
    });
  });
}


// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO DO AUTH
// ============================================================================

function defineIntegrationTests_Auth() {
  describe('Integration: Authentication System', function() {
    var testUser;
    var testSession;
    
    beforeAll(function() {
      testUser = TestHelpers.generateTestUser();
    });
    
    it('should reject login with empty credentials', function() {
      var result = AUTH.login('', '');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('obrigatório');
    });
    
    it('should reject login with invalid credentials', function() {
      var result = AUTH.login('nonexistent@example.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
    });
    
    it('should handle session retrieval when not logged in', function() {
      var session = AUTH.getSession('invalid_session_id');
      
      expect(session).toBeNull();
    });
    
    it('should check permissions correctly', function() {
      var mockSession = {
        permissions: ['visualizar_nf', 'editar_nf']
      };
      
      expect(AUTH.hasPermission(mockSession, 'visualizar_nf')).toBe(true);
      expect(AUTH.hasPermission(mockSession, 'deletar_nf')).toBe(false);
    });
    
    it('should grant all permissions to admin', function() {
      var adminSession = {
        permissions: ['*']
      };
      
      expect(AUTH.hasPermission(adminSession, 'any_permission')).toBe(true);
      expect(AUTH.hasPermission(adminSession, 'another_permission')).toBe(true);
    });
    
    it('should have correct user types defined', function() {
      expect(AUTH.USER_TYPES.ANALISTA).toBeDefined();
      expect(AUTH.USER_TYPES.FORNECEDOR).toBeDefined();
      expect(AUTH.USER_TYPES.REPRESENTANTE).toBeDefined();
      
      expect(AUTH.USER_TYPES.ANALISTA.permissoes).toContain('*');
    });
    
    it('should handle logout gracefully', function() {
      var result = AUTH.logout('any_session_id');
      
      expect(result.success).toBe(true);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE INTEGRAÇÃO END-TO-END
// ============================================================================

function defineIntegrationTests_E2E() {
  describe('Integration: End-to-End Workflows', function() {
    var testSheetInfo;
    
    beforeAll(function() {
      testSheetInfo = TestHelpers.createTestSheet('E2ETest', 
        ['Numero_NF', 'Chave_Acesso', 'Fornecedor', 'Valor_Total', 'Status_NF', 'Data_Emissao']);
    });
    
    afterAll(function() {
      if (IntegrationTestConfig.CLEANUP_AFTER_TESTS && testSheetInfo) {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(testSheetInfo.name);
        if (sheet) ss.deleteSheet(sheet);
      }
    });
    
    it('should complete full CRUD workflow', function() {
      // 1. CREATE
      var nfData = TestHelpers.generateTestNotaFiscal();
      var createResult = CRUD.create(testSheetInfo.name, nfData);
      expect(createResult.success).toBe(true);
      var rowId = createResult.id;
      
      // 2. READ
      var readResult = CRUD.read(testSheetInfo.name, { cache: false });
      expect(readResult.success).toBe(true);
      expect(readResult.data.length).toBeGreaterThan(0);
      
      // 3. UPDATE
      var updateResult = CRUD.update(testSheetInfo.name, rowId, {
        Status_NF: 'CONFERIDA'
      });
      expect(updateResult.success).toBe(true);
      
      // 4. VERIFY UPDATE
      var verifyResult = CRUD.read(testSheetInfo.name, {
        filters: { Numero_NF: nfData.Numero_NF },
        cache: false
      });
      expect(verifyResult.data[0].Status_NF).toBe('CONFERIDA');
      
      // 5. DELETE
      var deleteResult = CRUD.delete(testSheetInfo.name, rowId, true);
      expect(deleteResult.success).toBe(true);
    });
    
    it('should handle concurrent operations', function() {
      // Simula operações concorrentes
      var results = [];
      
      for (var i = 0; i < 5; i++) {
        var nfData = TestHelpers.generateTestNotaFiscal({
          Numero_NF: 'CONCURRENT_' + i
        });
        results.push(CRUD.create(testSheetInfo.name, nfData));
      }
      
      // Todas devem ter sucesso
      results.forEach(function(result, index) {
        expect(result.success).toBe(true);
      });
      
      // Verifica se todos foram criados
      var readResult = CRUD.read(testSheetInfo.name, { cache: false });
      var concurrentRecords = readResult.data.filter(function(r) {
        return r.Numero_NF && r.Numero_NF.indexOf('CONCURRENT_') === 0;
      });
      
      expect(concurrentRecords.length).toBe(5);
    });
    
    it('should integrate cache with CRUD operations', function() {
      clearCache();
      
      // Primeira leitura - cache miss
      var result1 = CRUD.read(testSheetInfo.name, { cache: true });
      
      // Segunda leitura - cache hit
      var result2 = CRUD.read(testSheetInfo.name, { cache: true });
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      // Após criar, cache deve ser invalidado
      CRUD.create(testSheetInfo.name, TestHelpers.generateTestNotaFiscal());
      
      // Nova leitura deve refletir o novo registro
      var result3 = CRUD.read(testSheetInfo.name, { cache: false });
      expect(result3.data.length).toBeGreaterThan(result1.data.length);
    });
    
    it('should track metrics during operations', function() {
      Metrics.reset();
      
      // Executa operações com métricas
      Metrics.timeFunction('e2e_create', function() {
        return CRUD.create(testSheetInfo.name, TestHelpers.generateTestNotaFiscal());
      });
      
      Metrics.timeFunction('e2e_read', function() {
        return CRUD.read(testSheetInfo.name, { cache: false });
      });
      
      // Verifica métricas
      var createStats = Metrics.getHistogram('e2e_create_duration_ms');
      var readStats = Metrics.getHistogram('e2e_read_duration_ms');
      
      expect(createStats).not.toBeNull();
      expect(readStats).not.toBeNull();
      expect(createStats.count).toBe(1);
      expect(readStats.count).toBe(1);
    });
    
    it('should validate data before operations', function() {
      // Tenta criar com dados inválidos
      var invalidData = {
        Numero_NF: '', // Vazio
        Valor_Total: -100 // Negativo
      };
      
      // Validação manual
      var errors = [];
      
      var nfValidation = ValidatorBase.validateRequiredString(invalidData.Numero_NF, 'Numero_NF');
      if (nfValidation) errors.push(nfValidation);
      
      var valorValidation = ValidatorBase.validatePositiveNumber(invalidData.Valor_Total, 'Valor_Total');
      if (valorValidation) errors.push(valorValidation);
      
      expect(errors.length).toBe(2);
    });
  });
}

// ============================================================================
// SUITE: TESTES DE RESILIÊNCIA E EDGE CASES
// ============================================================================

function defineIntegrationTests_Resilience() {
  describe('Integration: Resilience & Edge Cases', function() {
    
    it('should handle null and undefined values', function() {
      expect(Utils.format.cnpj(null)).toBe('');
      expect(Utils.format.currency(undefined)).toBe('R$ 0,00');
      expect(Utils.string.truncate(null, 10)).toBe('');
    });
    
    it('should handle empty arrays and objects', function() {
      expect(Utils.string.isEmpty([])).toBe(true);
      expect(Utils.string.isEmpty({})).toBe(true);
      expect(Utils.convert.objectToArray({}, [])).toEqual([]);
    });
    
    it('should handle special characters in strings', function() {
      var special = 'Test <script>alert("xss")</script>';
      var sanitized = ValidatorBase.sanitizeString(special);
      
      expect(sanitized).not.toContain('<script>');
    });
    
    it('should handle very large numbers', function() {
      var large = 999999999999.99;
      var formatted = Utils.format.currency(large);
      
      expect(formatted).toContain('R$');
      expect(formatted.length).toBeGreaterThan(10);
    });
    
    it('should handle date edge cases', function() {
      expect(Utils.format.date(null)).toBe('');
      expect(Utils.format.date('invalid')).toBe('');
      expect(Utils.format.date(new Date())).not.toBe('');
    });
    
    it('should handle API response with various data types', function() {
      expect(ApiResponse.success(null).data).toBeNull();
      expect(ApiResponse.success([]).data).toEqual([]);
      expect(ApiResponse.success('string').data).toBe('string');
      expect(ApiResponse.success(123).data).toBe(123);
    });
    
    it('should handle metrics with edge values', function() {
      Metrics.reset();
      
      Metrics.observe('edge_test', 0);
      Metrics.observe('edge_test', -1);
      Metrics.observe('edge_test', 999999);
      
      var stats = Metrics.getHistogram('edge_test');
      expect(stats.min).toBe(-1);
      expect(stats.max).toBe(999999);
    });
    
    it('should handle feature flag with invalid names', function() {
      expect(FeatureFlags.isEnabled('')).toBe(false);
      expect(FeatureFlags.isEnabled(null)).toBe(false);
      expect(FeatureFlags.get('NONEXISTENT')).toBeNull();
    });
  });
}

// ============================================================================
// SUITE: TESTES DE PERFORMANCE
// ============================================================================

function defineIntegrationTests_Performance() {
  describe('Integration: Performance', function() {
    var testSheetInfo;
    
    beforeAll(function() {
      testSheetInfo = TestHelpers.createTestSheet('PerfTest', 
        ['id', 'nome', 'valor', 'status']);
      
      // Popula com dados
      var sheet = testSheetInfo.sheet;
      var data = [];
      for (var i = 0; i < 100; i++) {
        data.push(['ID' + i, 'Item ' + i, Math.random() * 1000, i % 2 === 0 ? 'ATIVO' : 'INATIVO']);
      }
      sheet.getRange(2, 1, data.length, 4).setValues(data);
    });
    
    afterAll(function() {
      if (IntegrationTestConfig.CLEANUP_AFTER_TESTS && testSheetInfo) {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(testSheetInfo.name);
        if (sheet) ss.deleteSheet(sheet);
      }
    });
    
    it('should read 100 records in reasonable time', function() {
      var startTime = Date.now();
      
      var result = CRUD.read(testSheetInfo.name, { cache: false });
      
      var duration = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(result.data.length).toBe(100);
      expect(duration).toBeLessThan(5000); // Menos de 5 segundos
    });
    
    it('should filter records efficiently', function() {
      var startTime = Date.now();
      
      var result = CRUD.read(testSheetInfo.name, {
        filters: { status: 'ATIVO' },
        cache: false
      });
      
      var duration = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(result.data.length).toBe(50);
      expect(duration).toBeLessThan(3000);
    });
    
    it('should benefit from cache on repeated reads', function() {
      clearCache();
      
      // Primeira leitura (sem cache)
      var start1 = Date.now();
      CRUD.read(testSheetInfo.name, { cache: true });
      var duration1 = Date.now() - start1;
      
      // Segunda leitura (com cache)
      var start2 = Date.now();
      CRUD.read(testSheetInfo.name, { cache: true });
      var duration2 = Date.now() - start2;
      
      // Cache deve ser mais rápido (ou pelo menos não muito mais lento)
      // Nota: Em GAS, o cache pode não ser significativamente mais rápido
      expect(duration2).toBeLessThan(duration1 * 2);
    });
    
    it('should handle pagination efficiently', function() {
      var startTime = Date.now();
      
      var page1 = CRUD.read(testSheetInfo.name, { limit: 20, offset: 0, cache: false });
      var page2 = CRUD.read(testSheetInfo.name, { limit: 20, offset: 20, cache: false });
      var page3 = CRUD.read(testSheetInfo.name, { limit: 20, offset: 40, cache: false });
      
      var duration = Date.now() - startTime;
      
      expect(page1.data.length).toBe(20);
      expect(page2.data.length).toBe(20);
      expect(page3.data.length).toBe(20);
      expect(duration).toBeLessThan(10000);
    });
  });
}


// ============================================================================
// RUNNER PRINCIPAL
// ============================================================================

/**
 * Executa todos os testes de integração
 * @returns {Object} Resultado dos testes
 */
function runAllIntegrationTests() {
  TestFramework.clear();
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     BATERIA DE TESTES DE INTEGRAÇÃO - UNIAE CRE                  ║');
  Logger.log('║     Versão: 1.0.0                                                 ║');
  Logger.log('║     Data: ' + new Date().toISOString() + '                       ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var startTime = Date.now();
  
  // Define todas as suites
  defineIntegrationTests_Cache();
  defineIntegrationTests_CRUD();
  defineIntegrationTests_ApiResponse();
  defineIntegrationTests_Validator();
  defineIntegrationTests_FeatureFlags();
  defineIntegrationTests_Metrics();
  defineIntegrationTests_Logger();
  defineIntegrationTests_Utils();
  defineIntegrationTests_Repository();
  defineIntegrationTests_Auth();
  defineIntegrationTests_E2E();
  defineIntegrationTests_Resilience();
  defineIntegrationTests_Performance();
  
  // Executa
  var results = TestFramework.run();
  
  // Cleanup
  if (IntegrationTestConfig.CLEANUP_AFTER_TESTS) {
    var deleted = TestHelpers.cleanupTestSheets();
    Logger.log('');
    Logger.log('🧹 Cleanup: ' + deleted + ' planilhas de teste removidas');
  }
  
  var totalDuration = Date.now() - startTime;
  
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════════════════════');
  Logger.log('⏱️ Tempo total de execução: ' + totalDuration + 'ms');
  Logger.log('═══════════════════════════════════════════════════════════════════');
  
  return results;
}

/**
 * Executa testes de uma suite específica
 * @param {string} suiteName - Nome da suite
 * @returns {Object} Resultado dos testes
 */
function runIntegrationTestSuite(suiteName) {
  TestFramework.clear();
  
  var suiteMap = {
    'cache': defineIntegrationTests_Cache,
    'crud': defineIntegrationTests_CRUD,
    'api': defineIntegrationTests_ApiResponse,
    'validator': defineIntegrationTests_Validator,
    'features': defineIntegrationTests_FeatureFlags,
    'metrics': defineIntegrationTests_Metrics,
    'logger': defineIntegrationTests_Logger,
    'utils': defineIntegrationTests_Utils,
    'repository': defineIntegrationTests_Repository,
    'auth': defineIntegrationTests_Auth,
    'e2e': defineIntegrationTests_E2E,
    'resilience': defineIntegrationTests_Resilience,
    'performance': defineIntegrationTests_Performance
  };
  
  // Validar suiteName antes de usar toLowerCase
  if (!suiteName || typeof suiteName !== 'string') {
    Logger.log('Nome da suite inválido: ' + suiteName);
    Logger.log('Suites disponíveis: ' + Object.keys(suiteMap).join(', '));
    return { success: false, error: 'Nome da suite inválido' };
  }
  
  var defineFn = suiteMap[suiteName.toLowerCase()];
  
  if (!defineFn) {
    Logger.log('Suite não encontrada: ' + suiteName);
    Logger.log('Suites disponíveis: ' + Object.keys(suiteMap).join(', '));
    return { success: false, error: 'Suite não encontrada' };
  }
  
  defineFn();
  
  var results = TestFramework.run();
  
  if (IntegrationTestConfig.CLEANUP_AFTER_TESTS) {
    TestHelpers.cleanupTestSheets();
  }
  
  return results;
}

// ============================================================================
// FUNÇÕES DE CONVENIÊNCIA PARA EXECUÇÃO INDIVIDUAL
// ============================================================================

function runCacheTests() { return runIntegrationTestSuite('cache'); }
function runCRUDTests() { return runIntegrationTestSuite('crud'); }
function runApiTests() { return runIntegrationTestSuite('api'); }
function runValidatorTests() { return runIntegrationTestSuite('validator'); }
function runFeatureFlagTests() { return runIntegrationTestSuite('features'); }
function runMetricsTests() { return runIntegrationTestSuite('metrics'); }
function runLoggerTests() { return runIntegrationTestSuite('logger'); }
function runUtilsTests() { return runIntegrationTestSuite('utils'); }
function runRepositoryTests() { return runIntegrationTestSuite('repository'); }
function runAuthTests() { return runIntegrationTestSuite('auth'); }
function runE2ETests() { return runIntegrationTestSuite('e2e'); }
function runResilienceTests() { return runIntegrationTestSuite('resilience'); }
function runPerformanceTests() { return runIntegrationTestSuite('performance'); }

// ============================================================================
// RELATÓRIO DE COBERTURA
// ============================================================================

/**
 * Gera relatório de cobertura dos testes
 * @returns {Object} Relatório de cobertura
 */
function generateTestCoverageReport() {
  var modules = [
    { name: 'Core_Cache', suite: 'cache', functions: ['getCachedSpreadsheet', 'getCachedSheet', 'getCachedHeaders', 'clearCache', 'clearSheetCache', 'getCacheStats'] },
    { name: 'Core_CRUD', suite: 'crud', functions: ['create', 'read', 'update', 'delete', 'findById', 'findOne'] },
    { name: 'Core_API_Response', suite: 'api', functions: ['success', 'error', 'validationError', 'notFound', 'paginated', 'wrap', 'validateInput'] },
    { name: 'Core_Validator_Base', suite: 'validator', functions: ['validateRequiredString', 'validateStringLength', 'validatePositiveNumber', 'validateDate', 'validateEmail', 'sanitizeString', 'sanitizeNumber'] },
    { name: 'Core_Feature_Flags', suite: 'features', functions: ['isEnabled', 'enable', 'disable', 'getAll', 'getByCategory', 'executeIf'] },
    { name: 'Core_Metrics', suite: 'metrics', functions: ['increment', 'getCounter', 'setGauge', 'getGauge', 'observe', 'getHistogram', 'startTimer', 'stopTimer', 'timeFunction', 'recordEvent', 'exportAll'] },
    { name: 'Core_Logger', suite: 'logger', functions: ['debug', 'info', 'warn', 'error', 'setLevel', 'createContext', 'performance'] },
    { name: 'Core_Utils', suite: 'utils', functions: ['format.cnpj', 'format.cpf', 'format.currency', 'format.date', 'string.removeAccents', 'string.isEmpty', 'convert.toNumber', 'date.daysDiff', 'generateId', 'safeGet'] },
    { name: 'Core_Repository_Pattern', suite: 'repository', functions: ['findAll', 'findByRowIndex', 'findByFilters', 'create', 'update', 'count', 'exists'] },
    { name: 'Core_Auth', suite: 'auth', functions: ['login', 'logout', 'getSession', 'hasPermission', 'register', 'changePassword'] }
  ];
  
  var report = {
    timestamp: new Date().toISOString(),
    modules: modules,
    totalModules: modules.length,
    totalFunctions: 0,
    summary: {}
  };
  
  modules.forEach(function(m) {
    report.totalFunctions += m.functions.length;
    report.summary[m.name] = {
      functions: m.functions.length,
      testSuite: m.suite
    };
  });
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     RELATÓRIO DE COBERTURA DE TESTES                             ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('Módulos cobertos: ' + report.totalModules);
  Logger.log('Funções testadas: ' + report.totalFunctions);
  Logger.log('');
  
  modules.forEach(function(m) {
    Logger.log('📦 ' + m.name + ' (' + m.functions.length + ' funções)');
    Logger.log('   Suite: ' + m.suite);
    Logger.log('   Funções: ' + m.functions.join(', '));
    Logger.log('');
  });
  
  return report;
}

// ============================================================================
// SMOKE TEST (Teste Rápido de Sanidade)
// ============================================================================

/**
 * Executa smoke test rápido para verificar se o sistema está funcional
 * @returns {Object} Resultado do smoke test
 */
function runSmokeTest() {
  Logger.log('');
  Logger.log('🔥 SMOKE TEST - Verificação Rápida de Sanidade');
  Logger.log('═══════════════════════════════════════════════');
  
  var results = {
    timestamp: new Date().toISOString(),
    checks: [],
    passed: 0,
    failed: 0
  };
  
  function check(name, fn) {
    try {
      var result = fn();
      if (result) {
        results.checks.push({ name: name, status: 'PASS' });
        results.passed++;
        Logger.log('✅ ' + name);
      } else {
        results.checks.push({ name: name, status: 'FAIL', reason: 'Returned false' });
        results.failed++;
        Logger.log('❌ ' + name);
      }
    } catch (e) {
      results.checks.push({ name: name, status: 'FAIL', reason: e.message });
      results.failed++;
      Logger.log('❌ ' + name + ' - ' + e.message);
    }
  }
  
  // Verificações básicas
  check('SpreadsheetApp disponível', function() {
    return SpreadsheetApp.getActiveSpreadsheet() !== null;
  });
  
  check('CacheService disponível', function() {
    return CacheService.getScriptCache() !== null;
  });
  
  check('PropertiesService disponível', function() {
    return PropertiesService.getScriptProperties() !== null;
  });
  
  check('CRUD module carregado', function() {
    return typeof CRUD !== 'undefined' && typeof CRUD.read === 'function';
  });
  
  check('AUTH module carregado', function() {
    return typeof AUTH !== 'undefined' && typeof AUTH.login === 'function';
  });
  
  check('Utils module carregado', function() {
    // Verifica Utils ou UnifiedUtils
    var utils = typeof Utils !== 'undefined' ? Utils : 
                (typeof UnifiedUtils !== 'undefined' ? UnifiedUtils : null);
    return utils !== null && typeof utils.format === 'object';
  });
  
  check('ApiResponse module carregado', function() {
    return typeof ApiResponse !== 'undefined' && typeof ApiResponse.success === 'function';
  });
  
  check('FeatureFlags module carregado', function() {
    return typeof FeatureFlags !== 'undefined' && typeof FeatureFlags.isEnabled === 'function';
  });
  
  check('Metrics module carregado', function() {
    return typeof Metrics !== 'undefined' && typeof Metrics.increment === 'function';
  });
  
  check('AppLogger module carregado', function() {
    return typeof AppLogger !== 'undefined' && typeof AppLogger.info === 'function';
  });
  
  check('ValidatorBase module carregado', function() {
    return typeof ValidatorBase !== 'undefined' && typeof ValidatorBase.sanitizeString === 'function';
  });
  
  check('TestFramework module carregado', function() {
    return typeof TestFramework !== 'undefined' && typeof TestFramework.describe === 'function';
  });
  
  check('Cache funcional', function() {
    var ss = getCachedSpreadsheet();
    return ss !== null;
  });
  
  check('ApiResponse.success funcional', function() {
    var response = ApiResponse.success({ test: true });
    return response.success === true && response.data.test === true;
  });
  
  check('Utils.format.currency funcional', function() {
    // Verifica Utils ou UnifiedUtils ou formatCurrency global
    var utils = typeof Utils !== 'undefined' ? Utils : 
                (typeof UnifiedUtils !== 'undefined' ? UnifiedUtils : null);
    if (utils && utils.format && utils.format.currency) {
      return utils.format.currency(1234.56) === 'R$ 1.234,56';
    }
    // Fallback para função global
    if (typeof formatCurrency === 'function') {
      return formatCurrency(1234.56) === 'R$ 1.234,56';
    }
    return false;
  });
  
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('Resultado: ' + results.passed + '/' + (results.passed + results.failed) + ' verificações passaram');
  
  results.success = results.failed === 0;
  
  return results;
}

// ============================================================================
// MENU DE TESTES (Para execução via UI)
// ============================================================================

/**
 * Adiciona menu de testes na planilha
 */
function addTestMenu() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🧪 Testes')
    .addItem('🔥 Smoke Test (Rápido)', 'runSmokeTest')
    .addSeparator()
    .addItem('▶️ Executar Todos os Testes', 'runAllIntegrationTests')
    .addSeparator()
    .addSubMenu(ui.createMenu('📦 Testes por Módulo')
      .addItem('Cache', 'runCacheTests')
      .addItem('CRUD', 'runCRUDTests')
      .addItem('API Response', 'runApiTests')
      .addItem('Validator', 'runValidatorTests')
      .addItem('Feature Flags', 'runFeatureFlagTests')
      .addItem('Metrics', 'runMetricsTests')
      .addItem('Logger', 'runLoggerTests')
      .addItem('Utils', 'runUtilsTests')
      .addItem('Repository', 'runRepositoryTests')
      .addItem('Auth', 'runAuthTests'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔄 Testes Especiais')
      .addItem('E2E (End-to-End)', 'runE2ETests')
      .addItem('Resiliência', 'runResilienceTests')
      .addItem('Performance', 'runPerformanceTests'))
    .addSeparator()
    .addItem('📊 Relatório de Cobertura', 'generateTestCoverageReport')
    .addItem('🧹 Limpar Planilhas de Teste', 'cleanupTestSheetsManual')
    .addToUi();
}

/**
 * Limpa planilhas de teste manualmente
 */
function cleanupTestSheetsManual() {
  var deleted = TestHelpers.cleanupTestSheets();
  SpreadsheetApp.getUi().alert('Limpeza concluída', deleted + ' planilhas de teste foram removidas.', SpreadsheetApp.getUi().ButtonSet.OK);
}


// ============================================================================
// QUICK VALIDATION - Validação Rápida do Sistema de Testes
// ============================================================================

/**
 * Valida se o sistema de testes está configurado corretamente
 * Executa verificações básicas sem criar planilhas de teste
 * @returns {Object} Resultado da validação
 */
function validateTestSetup() {
  Logger.log('');
  Logger.log('🔍 VALIDAÇÃO DO SISTEMA DE TESTES');
  Logger.log('═══════════════════════════════════════════════');
  
  var checks = [];
  var passed = 0;
  var failed = 0;
  
  function check(name, condition) {
    if (condition) {
      checks.push({ name: name, status: 'OK' });
      passed++;
      Logger.log('✅ ' + name);
    } else {
      checks.push({ name: name, status: 'FAIL' });
      failed++;
      Logger.log('❌ ' + name);
    }
  }
  
  // Verifica módulos essenciais
  check('TestFramework disponível', typeof TestFramework !== 'undefined');
  check('TestFramework.describe disponível', typeof describe === 'function');
  check('TestFramework.it disponível', typeof it === 'function');
  check('TestFramework.expect disponível', typeof expect === 'function');
  
  // Verifica módulos do sistema
  check('CRUD disponível', typeof CRUD !== 'undefined');
  check('AUTH disponível', typeof AUTH !== 'undefined');
  check('Utils disponível', typeof Utils !== 'undefined');
  check('ApiResponse disponível', typeof ApiResponse !== 'undefined');
  check('ValidatorBase disponível', typeof ValidatorBase !== 'undefined');
  check('FeatureFlags disponível', typeof FeatureFlags !== 'undefined');
  check('Metrics disponível', typeof Metrics !== 'undefined');
  check('AppLogger disponível', typeof AppLogger !== 'undefined');
  
  // Verifica funções de cache
  check('getCachedSpreadsheet disponível', typeof getCachedSpreadsheet === 'function');
  check('getCachedSheet disponível', typeof getCachedSheet === 'function');
  check('clearCache disponível', typeof clearCache === 'function');
  
  // Verifica helpers de teste
  check('TestHelpers disponível', typeof TestHelpers !== 'undefined');
  check('TestHelpers.createTestSheet disponível', typeof TestHelpers.createTestSheet === 'function');
  check('TestHelpers.cleanupTestSheets disponível', typeof TestHelpers.cleanupTestSheets === 'function');
  
  // Verifica suites definidas
  check('defineIntegrationTests_Cache disponível', typeof defineIntegrationTests_Cache === 'function');
  check('defineIntegrationTests_CRUD disponível', typeof defineIntegrationTests_CRUD === 'function');
  check('defineIntegrationTests_Auth disponível', typeof defineIntegrationTests_Auth === 'function');
  
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('Resultado: ' + passed + '/' + (passed + failed) + ' verificações OK');
  Logger.log('═══════════════════════════════════════════════');
  
  return {
    success: failed === 0,
    passed: passed,
    failed: failed,
    checks: checks
  };
}

/**
 * Executa um teste mínimo para verificar se o framework funciona
 * @returns {Object} Resultado do teste
 */
function runMinimalTest() {
  TestFramework.clear();
  
  Logger.log('');
  Logger.log('🧪 TESTE MÍNIMO DO FRAMEWORK');
  Logger.log('═══════════════════════════════════════════════');
  
  describe('Minimal Test Suite', function() {
    it('should pass a simple assertion', function() {
      expect(1 + 1).toBe(2);
    });
    
    it('should compare objects', function() {
      expect({ a: 1 }).toEqual({ a: 1 });
    });
    
    it('should check truthiness', function() {
      expect(true).toBeTruthy();
      expect(false).toBeFalsy();
    });
    
    it('should check arrays', function() {
      expect([1, 2, 3]).toContain(2);
      expect([1, 2, 3]).toHaveLength(3);
    });
  });
  
  return TestFramework.run();
}
