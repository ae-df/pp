/**
 * @fileoverview API Unificada para Frontend
 * @version 1.0.0
 * @description Camada de API que expõe funções seguras e padronizadas para o frontend
 */

'use strict';

/**
 * API Unificada - Ponto de entrada para todas as operações do frontend
 * @namespace UnifiedAPI
 */
var UnifiedAPI = (function() {
  
  /**
   * Wrapper para executar operações com tratamento de erro padronizado
   * @private
   */
  function safeExecute(operation, operationName) {
    try {
      return operation();
    } catch (e) {
      console.error('[UnifiedAPI] Erro em ' + operationName + ': ' + e.message);
      return StandardResponse.error(
        'Erro ao executar operação: ' + e.message,
        'API_ERROR',
        { operation: operationName, stack: e.stack }
      );
    }
  }
  
  /**
   * Obtém o serviço de autenticação
   * @private
   */
  function getAuth() {
    if (typeof AuthService !== 'undefined') return AuthService;
    if (typeof AUTH !== 'undefined') return AUTH;
    return null;
  }
  
  /**
   * Verifica autenticação antes de executar operação
   * @private
   */
  function requireAuth(operation, operationName) {
    return safeExecute(function() {
      var auth = getAuth();
      if (!auth) {
        return StandardResponse.error('Sistema de autenticação não disponível', 'AUTH_UNAVAILABLE');
      }
      var session = auth.getSession();
      if (!session) {
        return StandardResponse.error('Não autenticado', 'UNAUTHORIZED');
      }
      return operation(session);
    }, operationName);
  }
  
  /**
   * Verifica permissão específica
   * @private
   */
  function requirePermission(permission, operation, operationName) {
    return requireAuth(function(session) {
      var auth = getAuth();
      if (auth && !auth.hasPermission(session, permission)) {
        return StandardResponse.error('Sem permissão para esta operação', 'FORBIDDEN');
      }
      return operation(session);
    }, operationName);
  }
  
  // ============================================================================
  // AUTENTICAÇÃO
  // ============================================================================
  
  /**
   * Realiza login
   * @param {string} email
   * @param {string} senha
   * @returns {Object} Resposta padronizada
   */
  function login(email, senha) {
    return safeExecute(function() {
      var auth = getAuth();
      if (!auth) {
        return StandardResponse.error('Sistema de autenticação não disponível', 'AUTH_UNAVAILABLE');
      }
      
      // Validação de entrada (se Validator existir)
      if (typeof Validator !== 'undefined' && Validator.validateObject) {
        var validation = Validator.validateObject(
          { email: email, senha: senha },
          { email: ['required', 'email'], senha: ['required'] }
        );
        
        if (!validation.valid) {
          return StandardResponse.validationError(validation.errors);
        }
      }
      
      return auth.login(email, senha);
    }, 'login');
  }
  
  /**
   * Realiza logout
   * @returns {Object} Resposta padronizada
   */
  function logout() {
    return safeExecute(function() {
      var auth = getAuth();
      if (!auth) {
        return StandardResponse.error('Sistema de autenticação não disponível', 'AUTH_UNAVAILABLE');
      }
      return auth.logout();
    }, 'logout');
  }
  
  /**
   * Obtém sessão atual
   * @returns {Object} Resposta padronizada com dados da sessão
   */
  function getSession() {
    return safeExecute(function() {
      var auth = getAuth();
      if (!auth) {
        return StandardResponse.error('Sistema de autenticação não disponível', 'AUTH_UNAVAILABLE');
      }
      var session = auth.getSession();
      if (session) {
        return StandardResponse.success(session);
      }
      return StandardResponse.error('Sessão não encontrada', 'NO_SESSION');
    }, 'getSession');
  }
  
  /**
   * Registra novo usuário
   * @param {Object} userData
   * @returns {Object} Resposta padronizada
   */
  function register(userData) {
    return safeExecute(function() {
      var auth = getAuth();
      if (!auth) {
        return StandardResponse.error('Sistema de autenticação não disponível', 'AUTH_UNAVAILABLE');
      }
      
      // Validação (se Validator existir)
      if (typeof Validator !== 'undefined' && Validator.validators && Validator.validators.usuario) {
        var validation = Validator.validators.usuario(userData);
        if (!validation.valid) {
          return StandardResponse.validationError(validation.errors);
        }
      }
      
      return auth.register(userData);
    }, 'register');
  }
  
  /**
   * Altera senha do usuário
   * @param {string} senhaAtual
   * @param {string} senhaNova
   * @returns {Object} Resposta padronizada
   */
  function changePassword(senhaAtual, senhaNova) {
    return requireAuth(function(session) {
      var auth = getAuth();
      if (!senhaNova || senhaNova.length < 6) {
        return StandardResponse.validationError(['Nova senha deve ter no mínimo 6 caracteres']);
      }
      return auth.changePassword(session.email, senhaAtual, senhaNova);
    }, 'changePassword');
  }
  
  // ============================================================================
  // NOTAS FISCAIS
  // ============================================================================
  
  /**
   * Lista notas fiscais com filtros e paginação
   * @param {Object} options - Opções de filtro e paginação
   * @returns {Object} Resposta padronizada
   */
  function listarNotasFiscais(options) {
    return requireAuth(function(session) {
      options = options || {};
      
      // Aplica filtros baseados no tipo de usuário
      if (session.tipo === 'FORNECEDOR') {
        options.filters = options.filters || {};
        options.filters.fornecedorCNPJ = session.instituicao;
      }
      
      return CRUDEnhanced.read('Notas_Fiscais', options);
    }, 'listarNotasFiscais');
  }
  
  /**
   * Busca nota fiscal por ID
   * @param {string} id
   * @returns {Object} Resposta padronizada
   */
  function buscarNotaFiscal(id) {
    return requireAuth(function() {
      return CRUDEnhanced.findById('Notas_Fiscais', id, 'ID_NF');
    }, 'buscarNotaFiscal');
  }
  
  /**
   * Cria nova nota fiscal
   * @param {Object} data
   * @returns {Object} Resposta padronizada
   */
  function criarNotaFiscal(data) {
    return requirePermission('cadastrar_notas', function(session) {
      // Validação
      var validation = Validator.validators.notaFiscal(data);
      if (!validation.valid) {
        return StandardResponse.validationError(validation.errors);
      }
      
      // Adiciona metadados
      data.responsavelCadastro = session.email;
      data.dataCadastro = new Date();
      data.statusNF = data.statusNF || 'Recebida';
      
      return CRUDEnhanced.create('Notas_Fiscais', data);
    }, 'criarNotaFiscal');
  }
  
  /**
   * Atualiza nota fiscal
   * @param {number} rowIndex
   * @param {Object} data
   * @returns {Object} Resposta padronizada
   */
  function atualizarNotaFiscal(rowIndex, data) {
    return requirePermission('editar_notas', function(session) {
      data.ultimaAtualizacaoPor = session.email;
      data.dataAtualizacao = new Date();
      
      return CRUDEnhanced.update('Notas_Fiscais', rowIndex, data);
    }, 'atualizarNotaFiscal');
  }
  
  // ============================================================================
  // ENTREGAS
  // ============================================================================
  
  /**
   * Lista entregas
   * @param {Object} options
   * @returns {Object} Resposta padronizada
   */
  function listarEntregas(options) {
    return requireAuth(function() {
      return CRUDEnhanced.read('Entregas', options);
    }, 'listarEntregas');
  }
  
  /**
   * Registra nova entrega
   * @param {Object} data
   * @returns {Object} Resposta padronizada
   */
  function registrarEntrega(data) {
    return requirePermission('conferir_entregas', function(session) {
      var validation = Validator.validators.entrega(data);
      if (!validation.valid) {
        return StandardResponse.validationError(validation.errors);
      }
      
      data.responsavelRegistro = session.email;
      data.dataRegistro = new Date();
      
      return CRUDEnhanced.create('Entregas', data);
    }, 'registrarEntrega');
  }
  
  // ============================================================================
  // RECUSAS
  // ============================================================================
  
  /**
   * Lista recusas
   * @param {Object} options
   * @returns {Object} Resposta padronizada
   */
  function listarRecusas(options) {
    return requireAuth(function() {
      return CRUDEnhanced.read('Recusas', options);
    }, 'listarRecusas');
  }
  
  /**
   * Registra nova recusa
   * @param {Object} data
   * @returns {Object} Resposta padronizada
   */
  function registrarRecusa(data) {
    return requirePermission('registrar_recusas', function(session) {
      var validation = Validator.validators.recusa(data);
      if (!validation.valid) {
        return StandardResponse.validationError(validation.errors);
      }
      
      data.responsavelRecusa = session.email;
      data.dataRecusa = new Date();
      data.statusResolucao = 'Pendente';
      
      return CRUDEnhanced.create('Recusas', data);
    }, 'registrarRecusa');
  }
  
  // ============================================================================
  // DASHBOARD
  // ============================================================================
  
  /**
   * Obtém dados do dashboard
   * @returns {Object} Resposta padronizada com métricas
   */
  function getDashboardData() {
    return requireAuth(function(session) {
      var metrics = {};
      
      // Contagem de notas fiscais
      var nfResult = CRUDEnhanced.count('Notas_Fiscais');
      metrics.totalNotasFiscais = nfResult.success ? nfResult.data.count : 0;
      
      // Contagem de entregas
      var entregasResult = CRUDEnhanced.count('Entregas');
      metrics.totalEntregas = entregasResult.success ? entregasResult.data.count : 0;
      
      // Contagem de recusas
      var recusasResult = CRUDEnhanced.count('Recusas');
      metrics.totalRecusas = recusasResult.success ? recusasResult.data.count : 0;
      
      // Notas pendentes
      var pendentesResult = CRUDEnhanced.read('Notas_Fiscais', {
        filters: { Status_NF: 'Pendente' },
        pageSize: 1
      });
      metrics.notasPendentes = pendentesResult.success ? pendentesResult.meta.pagination.total : 0;
      
      // Últimas atividades
      var recentResult = CRUDEnhanced.read('Notas_Fiscais', {
        orderBy: 'Data_Recebimento',
        orderDir: 'desc',
        pageSize: 5
      });
      metrics.ultimasNotas = recentResult.success ? recentResult.data : [];
      
      return StandardResponse.success(metrics);
    }, 'getDashboardData');
  }
  
  // ============================================================================
  // RELATÓRIOS
  // ============================================================================
  
  /**
   * Gera relatório de notas fiscais
   * @param {Object} filtros
   * @returns {Object} Resposta padronizada
   */
  function gerarRelatorioNF(filtros) {
    return requirePermission('gerar_relatorios', function() {
      return CRUDEnhanced.exportToJson('Notas_Fiscais', { filters: filtros });
    }, 'gerarRelatorioNF');
  }
  
  /**
   * Gera relatório de recusas
   * @param {Object} filtros
   * @returns {Object} Resposta padronizada
   */
  function gerarRelatorioRecusas(filtros) {
    return requirePermission('gerar_relatorios', function() {
      return CRUDEnhanced.exportToJson('Recusas', { filters: filtros });
    }, 'gerarRelatorioRecusas');
  }
  
  // ============================================================================
  // EXPORTAÇÃO
  // ============================================================================
  
  return {
    // Auth
    login: login,
    logout: logout,
    getSession: getSession,
    register: register,
    changePassword: changePassword,
    
    // Notas Fiscais
    listarNotasFiscais: listarNotasFiscais,
    buscarNotaFiscal: buscarNotaFiscal,
    criarNotaFiscal: criarNotaFiscal,
    atualizarNotaFiscal: atualizarNotaFiscal,
    
    // Entregas
    listarEntregas: listarEntregas,
    registrarEntrega: registrarEntrega,
    
    // Recusas
    listarRecusas: listarRecusas,
    registrarRecusa: registrarRecusa,
    
    // Dashboard
    getDashboardData: getDashboardData,
    
    // Relatórios
    gerarRelatorioNF: gerarRelatorioNF,
    gerarRelatorioRecusas: gerarRelatorioRecusas
  };
  
})();

// ============================================================================
// FUNÇÕES EXPOSTAS PARA FRONTEND (google.script.run)
// ============================================================================

// Auth
function api_login(email, senha) { return UnifiedAPI.login(email, senha); }
function api_logout() { return UnifiedAPI.logout(); }
function api_getSession() { return UnifiedAPI.getSession(); }
function api_register(userData) { return UnifiedAPI.register(userData); }
function api_changePassword(atual, nova) { return UnifiedAPI.changePassword(atual, nova); }

// Notas Fiscais
// NOTA: api_listarNotasFiscais está em Core_NF_API.gs com implementação mais completa
function api_listarNotasFiscais_Unified(options) { return UnifiedAPI.listarNotasFiscais(options); }
function api_buscarNotaFiscal(id) { return UnifiedAPI.buscarNotaFiscal(id); }
function api_criarNotaFiscal(data) { return UnifiedAPI.criarNotaFiscal(data); }
function api_atualizarNotaFiscal(rowIndex, data) { return UnifiedAPI.atualizarNotaFiscal(rowIndex, data); }

// Entregas
function api_listarEntregas(options) { return UnifiedAPI.listarEntregas(options); }
function api_registrarEntrega(data) { return UnifiedAPI.registrarEntrega(data); }

// Recusas
function api_listarRecusas(options) { return UnifiedAPI.listarRecusas(options); }
function api_registrarRecusa(data) { return UnifiedAPI.registrarRecusa(data); }

// Dashboard
function api_getDashboardData() { return UnifiedAPI.getDashboardData(); }

// Relatórios
function api_gerarRelatorioNF(filtros) { return UnifiedAPI.gerarRelatorioNF(filtros); }
function api_gerarRelatorioRecusas(filtros) { return UnifiedAPI.gerarRelatorioRecusas(filtros); }
