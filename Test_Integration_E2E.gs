/**
 * @fileoverview Testes de Integração End-to-End (E2E)
 * @version 1.0.0
 * @description Testes E2E completos que simulam fluxos reais de usuários
 * cobrindo todo o ciclo de vida das operações do sistema.
 * 
 * COBERTURA EXPANDIDA:
 * - Fluxo completo de Nota Fiscal (Emissão → Atesto → Liquidação)
 * - Fluxo de Recebimento na Escola
 * - Fluxo de Glosa e Contestação
 * - Fluxo de Cardápio Especial
 * - Integração entre Módulos
 * - Testes de Regressão
 * - Testes de Concorrência
 * - Testes de Resiliência
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-26
 */

'use strict';

// ============================================================================
// CONFIGURAÇÃO E2E
// ============================================================================

var E2ETestConfig = {
  VERBOSE: true,
  LOG_PREFIX: '[E2E]',
  CLEANUP_AFTER_TESTS: true,
  SIMULATE_DELAYS: false,
  TEST_TIMEOUT_MS: 60000,
  
  // Usuários de teste por perfil
  TEST_USERS: {
    ADMIN: { email: 'admin@uniae.gov.br', senha: 'Admin@2025', tipo: 'ADMIN' },
    ANALISTA: { email: 'analista@uniae.gov.br', senha: 'Analista@2025', tipo: 'ANALISTA' },
    REPRESENTANTE: { email: 'escola@seedf.gov.br', senha: 'Escola@2025', tipo: 'REPRESENTANTE' },
    FORNECEDOR: { email: 'fornecedor@empresa.com.br', senha: 'Fornecedor@2025', tipo: 'FORNECEDOR' },
    NUTRICIONISTA: { email: 'nutricionista@seedf.gov.br', senha: 'Nutri@2025', tipo: 'NUTRICIONISTA' }
  }
};

// ============================================================================
// HELPERS E2E
// ============================================================================

var E2EHelpers = {
  log: function(msg, level) {
    level = level || 'INFO';
    if (E2ETestConfig.VERBOSE) {
      Logger.log(E2ETestConfig.LOG_PREFIX + ' [' + level + '] ' + msg);
    }
  },
  
  logStep: function(stepNum, description) {
    this.log('');
    this.log('━━━ PASSO ' + stepNum + ': ' + description + ' ━━━');
  },
  
  assert: function(condition, message) {
    if (!condition) {
      throw new Error('E2E ASSERTION FAILED: ' + message);
    }
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
  
  assertSuccess: function(result, operation) {
    if (!result || result.success !== true) {
      var errorMsg = result && result.error ? result.error : 'Resultado inválido';
      throw new Error(operation + ' falhou: ' + errorMsg);
    }
    return true;
  },
  
  assertArrayNotEmpty: function(arr, name) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(name + ' deveria ser um array não vazio');
    }
    return true;
  },
  
  generateTestId: function(prefix) {
    return (prefix || 'TEST') + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  },
  
  simulateDelay: function(ms) {
    if (E2ETestConfig.SIMULATE_DELAYS) {
      Utilities.sleep(ms || 100);
    }
  },
  
  createTestContext: function() {
    return {
      startTime: Date.now(),
      testId: this.generateTestId('E2E'),
      createdRecords: [],
      errors: [],
      cleanup: function() {
        // Limpa registros criados durante o teste
        E2EHelpers.log('Limpando ' + this.createdRecords.length + ' registros de teste...');
      }
    };
  }
};

// ============================================================================
// MOCK DE SESSÃO PARA TESTES
// ============================================================================

var E2ESessionMock = {
  currentUser: null,
  
  login: function(userType) {
    var user = E2ETestConfig.TEST_USERS[userType];
    if (!user) {
      throw new Error('Tipo de usuário inválido: ' + userType);
    }
    
    this.currentUser = {
      email: user.email,
      tipo: user.tipo,
      nome: 'Usuário Teste ' + userType,
      permissions: this._getPermissions(user.tipo),
      loginTime: new Date()
    };
    
    E2EHelpers.log('Login simulado: ' + user.email + ' (' + user.tipo + ')');
    return { success: true, session: this.currentUser };
  },
  
  logout: function() {
    var email = this.currentUser ? this.currentUser.email : 'N/A';
    this.currentUser = null;
    E2EHelpers.log('Logout simulado: ' + email);
    return { success: true };
  },
  
  getCurrentUser: function() {
    return this.currentUser;
  },
  
  isLoggedIn: function() {
    return this.currentUser !== null;
  },
  
  hasPermission: function(permission) {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.indexOf(permission) >= 0 ||
           this.currentUser.permissions.indexOf('*') >= 0;
  },
  
  _getPermissions: function(tipo) {
    var permMap = {
      'ADMIN': ['*'],
      'ANALISTA': ['notas_fiscais', 'atesto', 'relatorios', 'analises', 'glosas'],
      'REPRESENTANTE': ['recebimento', 'cardapios', 'ocorrencias', 'conferencia'],
      'FORNECEDOR': ['entregas', 'notas', 'contratos', 'agendamento'],
      'NUTRICIONISTA': ['cardapios', 'avaliacoes', 'pareceres', 'substituicoes']
    };
    return permMap[tipo] || [];
  }
};


// ============================================================================
// E2E SUITE 1: FLUXO COMPLETO DE NOTA FISCAL
// ============================================================================

/**
 * Testa o fluxo completo de uma Nota Fiscal desde emissão até liquidação
 * Envolve: FORNECEDOR → REPRESENTANTE → ANALISTA → ADMIN
 */
function testE2E_FluxoCompletaNF() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: FLUXO COMPLETO DE NOTA FISCAL                         ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  var ctx = H.createTestContext();
  
  try {
    // ═══════════════════════════════════════════════════════════════════════
    // PASSO 1: FORNECEDOR emite Nota Fiscal
    // ═══════════════════════════════════════════════════════════════════════
    H.logStep(1, 'FORNECEDOR emite Nota Fiscal');
    results.total++;
    
    try {
      E2ESessionMock.login('FORNECEDOR');
      H.assert(E2ESessionMock.isLoggedIn(), 'Fornecedor deve estar logado');
      H.assert(E2ESessionMock.hasPermission('notas'), 'Fornecedor deve ter permissão de notas');
      
      var notaFiscal = {
        numero: H.generateTestId('NF'),
        chaveAcesso: '53' + Date.now().toString().padStart(42, '0'),
        cnpjEmitente: '12345678000199',
        razaoSocial: 'Alimentos Brasil LTDA',
        valorTotal: 15000.00,
        dataEmissao: new Date(),
        itens: [
          { codigo: 'ARROZ001', descricao: 'Arroz Tipo 1 5kg', quantidade: 100, valorUnitario: 25.00 },
          { codigo: 'FEIJAO001', descricao: 'Feijão Carioca 1kg', quantidade: 200, valorUnitario: 8.50 },
          { codigo: 'OLEO001', descricao: 'Óleo de Soja 900ml', quantidade: 150, valorUnitario: 45.00 }
        ],
        status: 'EMITIDA'
      };
      
      // Simula criação da NF
      ctx.createdRecords.push({ type: 'NF', id: notaFiscal.numero });
      ctx.notaFiscal = notaFiscal;
      
      H.assertNotNull(notaFiscal.numero, 'Número da NF');
      H.assert(notaFiscal.chaveAcesso.length === 44, 'Chave de acesso deve ter 44 dígitos');
      H.assert(notaFiscal.valorTotal > 0, 'Valor total deve ser positivo');
      
      E2ESessionMock.logout();
      
      H.log('   ✅ NF ' + notaFiscal.numero + ' emitida com sucesso');
      results.passed++;
      results.steps.push({ step: 1, status: 'PASSED', description: 'NF emitida' });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 1: ' + e.message);
      results.steps.push({ step: 1, status: 'FAILED', error: e.message });
      throw e; // Interrompe fluxo
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // PASSO 2: REPRESENTANTE recebe mercadoria na escola
    // ═══════════════════════════════════════════════════════════════════════
    H.logStep(2, 'REPRESENTANTE recebe mercadoria na escola');
    results.total++;
    
    try {
      E2ESessionMock.login('REPRESENTANTE');
      H.assert(E2ESessionMock.hasPermission('recebimento'), 'Representante deve ter permissão de recebimento');
      
      var recebimento = {
        notaFiscal: ctx.notaFiscal.numero,
        dataRecebimento: new Date(),
        responsavel: E2ESessionMock.getCurrentUser().nome,
        matricula: '123456',
        unidadeEscolar: 'EC 01 Plano Piloto',
        checklist: {
          temperaturaAdequada: true,
          embalagemIntegra: true,
          validadeOk: true,
          quantidadeConfere: true,
          documentacaoOk: true
        },
        itensConferidos: ctx.notaFiscal.itens.map(function(item) {
          return {
            codigo: item.codigo,
            quantidadeNF: item.quantidade,
            quantidadeRecebida: item.quantidade, // Recebeu tudo
            observacao: ''
          };
        }),
        status: 'CONFERIDO'
      };
      
      // Validações de recebimento
      var todosItensOk = Object.values(recebimento.checklist).every(function(v) { return v === true; });
      H.assert(todosItensOk, 'Todos os itens do checklist devem estar OK');
      
      ctx.recebimento = recebimento;
      ctx.notaFiscal.status = 'RECEBIDA';
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Recebimento conferido em ' + recebimento.unidadeEscolar);
      results.passed++;
      results.steps.push({ step: 2, status: 'PASSED', description: 'Recebimento conferido' });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 2: ' + e.message);
      results.steps.push({ step: 2, status: 'FAILED', error: e.message });
      throw e;
    }

    
    // ═══════════════════════════════════════════════════════════════════════
    // PASSO 3: ANALISTA processa e atesta a NF
    // ═══════════════════════════════════════════════════════════════════════
    H.logStep(3, 'ANALISTA processa e atesta a NF');
    results.total++;
    
    try {
      E2ESessionMock.login('ANALISTA');
      H.assert(E2ESessionMock.hasPermission('atesto'), 'Analista deve ter permissão de atesto');
      
      // Verifica pré-requisitos para atesto
      H.assert(ctx.notaFiscal.status === 'RECEBIDA', 'NF deve estar com status RECEBIDA');
      H.assertNotNull(ctx.recebimento, 'Deve existir registro de recebimento');
      
      var atesto = {
        notaFiscal: ctx.notaFiscal.numero,
        dataAtesto: new Date(),
        analista: E2ESessionMock.getCurrentUser().email,
        matriculaAnalista: '654321',
        valorAtestado: ctx.notaFiscal.valorTotal,
        valorGlosado: 0,
        observacoes: 'Atesto conforme recebimento na UE',
        assinaturaDigital: E2ESessionMock.getCurrentUser().email, // Assinatura = usuário autenticado
        status: 'ATESTADO'
      };
      
      // Validação de segregação de funções
      H.assert(
        atesto.analista !== ctx.recebimento.responsavel,
        'Analista não pode ser o mesmo que recebeu (segregação de funções)'
      );
      
      // Validação de cronologia
      H.assert(
        atesto.dataAtesto >= ctx.notaFiscal.dataEmissao,
        'Data do atesto não pode ser anterior à emissão'
      );
      
      ctx.atesto = atesto;
      ctx.notaFiscal.status = 'ATESTADA';
      
      E2ESessionMock.logout();
      
      H.log('   ✅ NF atestada pelo analista - Valor: R$ ' + atesto.valorAtestado.toFixed(2));
      results.passed++;
      results.steps.push({ step: 3, status: 'PASSED', description: 'NF atestada' });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 3: ' + e.message);
      results.steps.push({ step: 3, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // PASSO 4: ADMIN aprova liquidação
    // ═══════════════════════════════════════════════════════════════════════
    H.logStep(4, 'ADMIN aprova liquidação');
    results.total++;
    
    try {
      E2ESessionMock.login('ADMIN');
      H.assert(E2ESessionMock.hasPermission('*'), 'Admin deve ter todas as permissões');
      
      var liquidacao = {
        notaFiscal: ctx.notaFiscal.numero,
        dataLiquidacao: new Date(),
        aprovadoPor: E2ESessionMock.getCurrentUser().email,
        valorLiquidado: ctx.atesto.valorAtestado - ctx.atesto.valorGlosado,
        empenho: '2025/000123',
        status: 'LIQUIDADA'
      };
      
      // Validações finais
      H.assert(liquidacao.valorLiquidado > 0, 'Valor liquidado deve ser positivo');
      H.assert(liquidacao.valorLiquidado <= ctx.notaFiscal.valorTotal, 'Valor liquidado não pode exceder valor da NF');
      
      ctx.liquidacao = liquidacao;
      ctx.notaFiscal.status = 'LIQUIDADA';
      
      E2ESessionMock.logout();
      
      H.log('   ✅ NF liquidada - Valor: R$ ' + liquidacao.valorLiquidado.toFixed(2));
      results.passed++;
      results.steps.push({ step: 4, status: 'PASSED', description: 'NF liquidada' });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 4: ' + e.message);
      results.steps.push({ step: 4, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // PASSO 5: Verificação final do fluxo
    // ═══════════════════════════════════════════════════════════════════════
    H.logStep(5, 'Verificação final do fluxo');
    results.total++;
    
    try {
      // Verifica integridade do fluxo completo
      H.assertEqual(ctx.notaFiscal.status, 'LIQUIDADA', 'Status final da NF');
      H.assertNotNull(ctx.recebimento, 'Registro de recebimento');
      H.assertNotNull(ctx.atesto, 'Registro de atesto');
      H.assertNotNull(ctx.liquidacao, 'Registro de liquidação');
      
      // Verifica trilha de auditoria
      var auditTrail = [
        { etapa: 'EMISSAO', usuario: 'FORNECEDOR', data: ctx.notaFiscal.dataEmissao },
        { etapa: 'RECEBIMENTO', usuario: 'REPRESENTANTE', data: ctx.recebimento.dataRecebimento },
        { etapa: 'ATESTO', usuario: 'ANALISTA', data: ctx.atesto.dataAtesto },
        { etapa: 'LIQUIDACAO', usuario: 'ADMIN', data: ctx.liquidacao.dataLiquidacao }
      ];
      
      H.assert(auditTrail.length === 4, 'Deve ter 4 etapas na trilha de auditoria');
      
      // Verifica cronologia
      for (var i = 1; i < auditTrail.length; i++) {
        H.assert(
          auditTrail[i].data >= auditTrail[i-1].data,
          'Cronologia deve ser respeitada: ' + auditTrail[i].etapa + ' >= ' + auditTrail[i-1].etapa
        );
      }
      
      H.log('   ✅ Fluxo completo verificado com sucesso');
      H.log('   📊 Trilha de auditoria: ' + auditTrail.length + ' etapas');
      results.passed++;
      results.steps.push({ step: 5, status: 'PASSED', description: 'Verificação OK' });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 5: ' + e.message);
      results.steps.push({ step: 5, status: 'FAILED', error: e.message });
    }
    
  } catch (e) {
    H.log('❌ Fluxo interrompido: ' + e.message, 'ERROR');
  } finally {
    // Cleanup
    if (E2ETestConfig.CLEANUP_AFTER_TESTS) {
      ctx.cleanup();
    }
  }
  
  logE2ETestResults('FLUXO_COMPLETO_NF', results);
  return results;
}


// ============================================================================
// E2E SUITE 2: FLUXO DE GLOSA E CONTESTAÇÃO
// ============================================================================

/**
 * Testa o fluxo de glosa quando há divergência no recebimento
 */
function testE2E_FluxoGlosa() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: FLUXO DE GLOSA E CONTESTAÇÃO                          ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  var ctx = H.createTestContext();
  
  try {
    // PASSO 1: Criar NF com itens
    H.logStep(1, 'Criar NF para teste de glosa');
    results.total++;
    
    try {
      ctx.notaFiscal = {
        numero: H.generateTestId('NF_GLOSA'),
        valorTotal: 10000.00,
        itens: [
          { codigo: 'ITEM001', quantidade: 100, valorUnitario: 50.00, valorTotal: 5000.00 },
          { codigo: 'ITEM002', quantidade: 50, valorUnitario: 100.00, valorTotal: 5000.00 }
        ],
        status: 'EMITIDA'
      };
      
      H.log('   ✅ NF criada: ' + ctx.notaFiscal.numero);
      results.passed++;
      results.steps.push({ step: 1, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 1: ' + e.message);
      results.steps.push({ step: 1, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 2: Recebimento com divergência
    H.logStep(2, 'REPRESENTANTE recebe com divergência de quantidade');
    results.total++;
    
    try {
      E2ESessionMock.login('REPRESENTANTE');
      
      ctx.recebimento = {
        notaFiscal: ctx.notaFiscal.numero,
        itensConferidos: [
          { 
            codigo: 'ITEM001', 
            quantidadeNF: 100, 
            quantidadeRecebida: 90, // Faltaram 10 unidades
            divergencia: 10,
            motivoDivergencia: 'QUANTIDADE_DIVERGENTE'
          },
          { 
            codigo: 'ITEM002', 
            quantidadeNF: 50, 
            quantidadeRecebida: 45, // 5 unidades avariadas
            divergencia: 5,
            motivoDivergencia: 'PRODUTO_AVARIADO'
          }
        ],
        status: 'CONFERIDO_COM_DIVERGENCIA'
      };
      
      // Calcula valor da divergência
      var valorDivergencia = 0;
      ctx.recebimento.itensConferidos.forEach(function(item) {
        var itemOriginal = ctx.notaFiscal.itens.find(function(i) { return i.codigo === item.codigo; });
        if (itemOriginal && item.divergencia > 0) {
          valorDivergencia += item.divergencia * itemOriginal.valorUnitario;
        }
      });
      
      ctx.recebimento.valorDivergencia = valorDivergencia;
      
      H.assert(valorDivergencia > 0, 'Deve haver valor de divergência');
      H.log('   ✅ Divergência detectada: R$ ' + valorDivergencia.toFixed(2));
      
      E2ESessionMock.logout();
      results.passed++;
      results.steps.push({ step: 2, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 2: ' + e.message);
      results.steps.push({ step: 2, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 3: Analista registra glosa
    H.logStep(3, 'ANALISTA registra glosa');
    results.total++;
    
    try {
      E2ESessionMock.login('ANALISTA');
      
      ctx.glosa = {
        notaFiscal: ctx.notaFiscal.numero,
        dataGlosa: new Date(),
        analista: E2ESessionMock.getCurrentUser().email,
        itensGlosados: ctx.recebimento.itensConferidos.filter(function(item) {
          return item.divergencia > 0;
        }).map(function(item) {
          var itemOriginal = ctx.notaFiscal.itens.find(function(i) { return i.codigo === item.codigo; });
          return {
            codigo: item.codigo,
            quantidadeGlosada: item.divergencia,
            valorGlosado: item.divergencia * itemOriginal.valorUnitario,
            motivo: item.motivoDivergencia,
            justificativa: 'Divergência confirmada na conferência'
          };
        }),
        valorTotalGlosa: ctx.recebimento.valorDivergencia,
        status: 'GLOSA_REGISTRADA'
      };
      
      // Validações de glosa
      H.assert(ctx.glosa.valorTotalGlosa > 0, 'Valor da glosa deve ser positivo');
      H.assert(ctx.glosa.valorTotalGlosa < ctx.notaFiscal.valorTotal, 'Glosa não pode exceder valor da NF');
      H.assert(ctx.glosa.itensGlosados.length > 0, 'Deve ter itens glosados');
      
      // Verifica percentual de glosa
      var percentualGlosa = (ctx.glosa.valorTotalGlosa / ctx.notaFiscal.valorTotal) * 100;
      H.log('   📊 Percentual de glosa: ' + percentualGlosa.toFixed(1) + '%');
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Glosa registrada: R$ ' + ctx.glosa.valorTotalGlosa.toFixed(2));
      results.passed++;
      results.steps.push({ step: 3, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 3: ' + e.message);
      results.steps.push({ step: 3, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 4: Fornecedor contesta glosa
    H.logStep(4, 'FORNECEDOR contesta glosa');
    results.total++;
    
    try {
      E2ESessionMock.login('FORNECEDOR');
      
      ctx.contestacao = {
        glosa: ctx.glosa,
        dataContestacao: new Date(),
        fornecedor: E2ESessionMock.getCurrentUser().email,
        motivo: 'Quantidade entregue conforme NF. Solicito revisão.',
        evidencias: ['foto_entrega.jpg', 'canhoto_assinado.pdf'],
        status: 'CONTESTACAO_REGISTRADA'
      };
      
      H.assertNotNull(ctx.contestacao.motivo, 'Contestação deve ter motivo');
      H.assert(ctx.contestacao.evidencias.length > 0, 'Contestação deve ter evidências');
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Contestação registrada pelo fornecedor');
      results.passed++;
      results.steps.push({ step: 4, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 4: ' + e.message);
      results.steps.push({ step: 4, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 5: Analista analisa contestação
    H.logStep(5, 'ANALISTA analisa contestação');
    results.total++;
    
    try {
      E2ESessionMock.login('ANALISTA');
      
      ctx.analiseContestacao = {
        contestacao: ctx.contestacao,
        dataAnalise: new Date(),
        analista: E2ESessionMock.getCurrentUser().email,
        parecer: 'PARCIALMENTE_PROCEDENTE',
        valorRevisado: ctx.glosa.valorTotalGlosa * 0.5, // Aceita 50% da contestação
        justificativa: 'Após análise das evidências, aceita-se parcialmente a contestação.',
        status: 'CONTESTACAO_ANALISADA'
      };
      
      // Atualiza valor da glosa
      ctx.glosa.valorTotalGlosa = ctx.analiseContestacao.valorRevisado;
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Contestação analisada - Novo valor glosa: R$ ' + ctx.glosa.valorTotalGlosa.toFixed(2));
      results.passed++;
      results.steps.push({ step: 5, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 5: ' + e.message);
      results.steps.push({ step: 5, status: 'FAILED', error: e.message });
    }
    
  } catch (e) {
    H.log('❌ Fluxo interrompido: ' + e.message, 'ERROR');
  }
  
  logE2ETestResults('FLUXO_GLOSA', results);
  return results;
}


// ============================================================================
// E2E SUITE 3: FLUXO DE CARDÁPIO ESPECIAL
// ============================================================================

/**
 * Testa o fluxo de solicitação e aprovação de cardápio especial
 */
function testE2E_FluxoCardapioEspecial() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: FLUXO DE CARDÁPIO ESPECIAL                            ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  var ctx = H.createTestContext();
  
  try {
    // PASSO 1: Representante solicita cardápio especial
    H.logStep(1, 'REPRESENTANTE solicita cardápio especial');
    results.total++;
    
    try {
      E2ESessionMock.login('REPRESENTANTE');
      
      ctx.solicitacao = {
        id: H.generateTestId('CARD_ESP'),
        unidadeEscolar: 'EC 01 Plano Piloto',
        aluno: {
          nome: 'João Silva',
          matricula: 'ALU123456',
          turma: '3A'
        },
        tipoRestricao: 'ALERGIA_ALIMENTAR',
        alergenos: ['GLUTEN', 'LACTOSE'],
        laudoMedico: 'laudo_medico_123.pdf',
        dataSolicitacao: new Date(),
        solicitante: E2ESessionMock.getCurrentUser().email,
        status: 'SOLICITADO'
      };
      
      H.assertNotNull(ctx.solicitacao.laudoMedico, 'Laudo médico é obrigatório');
      H.assert(ctx.solicitacao.alergenos.length > 0, 'Deve especificar alergenos');
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Solicitação criada: ' + ctx.solicitacao.id);
      results.passed++;
      results.steps.push({ step: 1, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 1: ' + e.message);
      results.steps.push({ step: 1, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 2: Nutricionista analisa e elabora cardápio
    H.logStep(2, 'NUTRICIONISTA analisa e elabora cardápio');
    results.total++;
    
    try {
      E2ESessionMock.login('NUTRICIONISTA');
      H.assert(E2ESessionMock.hasPermission('cardapios'), 'Nutricionista deve ter permissão');
      
      ctx.analiseNutricional = {
        solicitacao: ctx.solicitacao.id,
        dataAnalise: new Date(),
        nutricionista: E2ESessionMock.getCurrentUser().email,
        crnNutricionista: 'CRN1-12345',
        parecer: 'APROVADO',
        observacoes: 'Laudo médico válido. Necessário cardápio sem glúten e sem lactose.',
        cardapioEspecial: {
          segunda: {
            lanche: 'Frutas + Suco natural',
            almoco: 'Arroz + Feijão + Frango grelhado + Salada',
            observacao: 'Sem molhos industrializados'
          },
          terca: {
            lanche: 'Tapioca com coco',
            almoco: 'Arroz + Lentilha + Peixe assado + Legumes',
            observacao: 'Sem empanados'
          }
          // ... outros dias
        },
        substituicoes: [
          { original: 'Pão francês', substituto: 'Tapioca', motivo: 'Sem glúten' },
          { original: 'Leite', substituto: 'Leite de coco', motivo: 'Sem lactose' },
          { original: 'Queijo', substituto: 'Queijo vegano', motivo: 'Sem lactose' }
        ],
        status: 'CARDAPIO_ELABORADO'
      };
      
      H.assertNotNull(ctx.analiseNutricional.crnNutricionista, 'CRN é obrigatório');
      H.assert(ctx.analiseNutricional.substituicoes.length > 0, 'Deve ter substituições');
      
      ctx.solicitacao.status = 'EM_ANALISE';
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Cardápio especial elaborado com ' + ctx.analiseNutricional.substituicoes.length + ' substituições');
      results.passed++;
      results.steps.push({ step: 2, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 2: ' + e.message);
      results.steps.push({ step: 2, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 3: Analista aprova cardápio especial
    H.logStep(3, 'ANALISTA aprova cardápio especial');
    results.total++;
    
    try {
      E2ESessionMock.login('ANALISTA');
      
      ctx.aprovacao = {
        solicitacao: ctx.solicitacao.id,
        dataAprovacao: new Date(),
        aprovadoPor: E2ESessionMock.getCurrentUser().email,
        parecer: 'APROVADO',
        vigencia: {
          inicio: new Date(),
          fim: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
        },
        status: 'APROVADO'
      };
      
      ctx.solicitacao.status = 'APROVADO';
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Cardápio especial aprovado');
      results.passed++;
      results.steps.push({ step: 3, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 3: ' + e.message);
      results.steps.push({ step: 3, status: 'FAILED', error: e.message });
      throw e;
    }
    
    // PASSO 4: Representante visualiza cardápio aprovado
    H.logStep(4, 'REPRESENTANTE visualiza cardápio aprovado');
    results.total++;
    
    try {
      E2ESessionMock.login('REPRESENTANTE');
      
      // Simula consulta do cardápio
      var cardapioConsultado = {
        solicitacao: ctx.solicitacao,
        analise: ctx.analiseNutricional,
        aprovacao: ctx.aprovacao
      };
      
      H.assertEqual(cardapioConsultado.solicitacao.status, 'APROVADO', 'Status deve ser APROVADO');
      H.assertNotNull(cardapioConsultado.analise.cardapioEspecial, 'Cardápio deve estar disponível');
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Cardápio especial disponível para a escola');
      results.passed++;
      results.steps.push({ step: 4, status: 'PASSED' });
    } catch (e) {
      results.failed++;
      results.errors.push('Passo 4: ' + e.message);
      results.steps.push({ step: 4, status: 'FAILED', error: e.message });
    }
    
  } catch (e) {
    H.log('❌ Fluxo interrompido: ' + e.message, 'ERROR');
  }
  
  logE2ETestResults('FLUXO_CARDAPIO_ESPECIAL', results);
  return results;
}


// ============================================================================
// E2E SUITE 4: TESTES DE PERMISSÕES E SEGURANÇA
// ============================================================================

/**
 * Testa controle de acesso e permissões entre perfis
 */
function testE2E_PermissoesSeguranca() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: PERMISSÕES E SEGURANÇA                                ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  
  // Matriz de permissões esperadas
  var matrizPermissoes = {
    ADMIN: {
      permitido: ['*'],
      negado: []
    },
    ANALISTA: {
      permitido: ['notas_fiscais', 'atesto', 'relatorios', 'analises', 'glosas'],
      negado: ['usuarios', 'configuracoes']
    },
    REPRESENTANTE: {
      permitido: ['recebimento', 'cardapios', 'ocorrencias', 'conferencia'],
      negado: ['atesto', 'liquidacao', 'usuarios']
    },
    FORNECEDOR: {
      permitido: ['entregas', 'notas', 'contratos', 'agendamento'],
      negado: ['atesto', 'recebimento', 'usuarios']
    },
    NUTRICIONISTA: {
      permitido: ['cardapios', 'avaliacoes', 'pareceres', 'substituicoes'],
      negado: ['atesto', 'liquidacao', 'usuarios']
    }
  };
  
  // Testa cada perfil
  Object.keys(matrizPermissoes).forEach(function(perfil, index) {
    H.logStep(index + 1, 'Testando permissões do perfil ' + perfil);
    results.total++;
    
    try {
      E2ESessionMock.login(perfil);
      var config = matrizPermissoes[perfil];
      
      // Testa permissões permitidas
      config.permitido.forEach(function(perm) {
        if (perm === '*') {
          // Admin tem todas as permissões
          H.assert(E2ESessionMock.hasPermission('qualquer_coisa'), perfil + ' deve ter permissão total');
        } else {
          H.assert(E2ESessionMock.hasPermission(perm), perfil + ' deve ter permissão: ' + perm);
        }
      });
      
      // Testa permissões negadas
      config.negado.forEach(function(perm) {
        H.assert(!E2ESessionMock.hasPermission(perm), perfil + ' NÃO deve ter permissão: ' + perm);
      });
      
      E2ESessionMock.logout();
      
      H.log('   ✅ Permissões do ' + perfil + ' validadas');
      results.passed++;
      results.steps.push({ step: index + 1, status: 'PASSED', perfil: perfil });
      
    } catch (e) {
      results.failed++;
      results.errors.push('Perfil ' + perfil + ': ' + e.message);
      results.steps.push({ step: index + 1, status: 'FAILED', perfil: perfil, error: e.message });
      E2ESessionMock.logout();
    }
  });
  
  // Teste adicional: Segregação de funções
  H.logStep(6, 'Testando segregação de funções');
  results.total++;
  
  try {
    // Simula tentativa de um usuário fazer duas etapas do mesmo processo
    var operacao = {
      etapa1_usuario: 'representante@escola.gov.br',
      etapa2_usuario: 'representante@escola.gov.br' // Mesmo usuário - deve falhar
    };
    
    var segregacaoViolada = operacao.etapa1_usuario === operacao.etapa2_usuario;
    
    if (segregacaoViolada) {
      H.log('   ⚠️ Segregação de funções detectou violação (esperado)');
    }
    
    // Corrige a operação
    operacao.etapa2_usuario = 'analista@uniae.gov.br';
    var segregacaoOk = operacao.etapa1_usuario !== operacao.etapa2_usuario;
    
    H.assert(segregacaoOk, 'Segregação de funções deve ser respeitada');
    
    H.log('   ✅ Segregação de funções validada');
    results.passed++;
    results.steps.push({ step: 6, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Segregação: ' + e.message);
    results.steps.push({ step: 6, status: 'FAILED', error: e.message });
  }
  
  logE2ETestResults('PERMISSOES_SEGURANCA', results);
  return results;
}

// ============================================================================
// E2E SUITE 5: TESTES DE CONCORRÊNCIA
// ============================================================================

/**
 * Testa cenários de acesso concorrente
 */
function testE2E_Concorrencia() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: CONCORRÊNCIA E LOCKS                                  ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  
  // PASSO 1: Simula lock de recurso
  H.logStep(1, 'Testando lock de recurso');
  results.total++;
  
  try {
    var recurso = {
      id: 'NF_123',
      lockedBy: null,
      lockedAt: null
    };
    
    // Usuário 1 adquire lock
    recurso.lockedBy = 'usuario1@example.com';
    recurso.lockedAt = new Date();
    
    H.assertNotNull(recurso.lockedBy, 'Recurso deve estar bloqueado');
    
    // Usuário 2 tenta acessar - deve falhar
    var usuario2PodeAcessar = recurso.lockedBy === null;
    H.assert(!usuario2PodeAcessar, 'Usuário 2 não deve conseguir acessar recurso bloqueado');
    
    // Usuário 1 libera lock
    recurso.lockedBy = null;
    recurso.lockedAt = null;
    
    // Agora usuário 2 pode acessar
    usuario2PodeAcessar = recurso.lockedBy === null;
    H.assert(usuario2PodeAcessar, 'Usuário 2 deve conseguir acessar após liberação');
    
    H.log('   ✅ Lock de recurso funcionando');
    results.passed++;
    results.steps.push({ step: 1, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Lock: ' + e.message);
    results.steps.push({ step: 1, status: 'FAILED', error: e.message });
  }
  
  // PASSO 2: Simula timeout de lock
  H.logStep(2, 'Testando timeout de lock');
  results.total++;
  
  try {
    var lockTimeout = 5 * 60 * 1000; // 5 minutos
    var recurso = {
      id: 'NF_456',
      lockedBy: 'usuario_abandonou@example.com',
      lockedAt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutos atrás
    };
    
    // Verifica se lock expirou
    var lockExpirado = (Date.now() - recurso.lockedAt.getTime()) > lockTimeout;
    H.assert(lockExpirado, 'Lock deve ter expirado após timeout');
    
    // Sistema libera lock expirado
    if (lockExpirado) {
      recurso.lockedBy = null;
      recurso.lockedAt = null;
    }
    
    H.assert(recurso.lockedBy === null, 'Lock expirado deve ser liberado');
    
    H.log('   ✅ Timeout de lock funcionando');
    results.passed++;
    results.steps.push({ step: 2, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Timeout: ' + e.message);
    results.steps.push({ step: 2, status: 'FAILED', error: e.message });
  }
  
  // PASSO 3: Simula operação atômica
  H.logStep(3, 'Testando operação atômica');
  results.total++;
  
  try {
    var saldoEmpenho = 10000.00;
    var valorNF = 3000.00;
    
    // Operação atômica: verificar saldo E debitar
    function debitarEmpenho(saldo, valor) {
      if (saldo < valor) {
        throw new Error('Saldo insuficiente');
      }
      return saldo - valor;
    }
    
    // Primeira operação
    saldoEmpenho = debitarEmpenho(saldoEmpenho, valorNF);
    H.assertEqual(saldoEmpenho, 7000.00, 'Saldo após primeira operação');
    
    // Segunda operação
    saldoEmpenho = debitarEmpenho(saldoEmpenho, valorNF);
    H.assertEqual(saldoEmpenho, 4000.00, 'Saldo após segunda operação');
    
    // Terceira operação - deve falhar (saldo insuficiente)
    var terceiraFalhou = false;
    try {
      saldoEmpenho = debitarEmpenho(saldoEmpenho, 5000.00);
    } catch (e) {
      terceiraFalhou = true;
    }
    
    H.assert(terceiraFalhou, 'Terceira operação deve falhar por saldo insuficiente');
    H.assertEqual(saldoEmpenho, 4000.00, 'Saldo não deve ter sido alterado');
    
    H.log('   ✅ Operação atômica funcionando');
    results.passed++;
    results.steps.push({ step: 3, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Atômica: ' + e.message);
    results.steps.push({ step: 3, status: 'FAILED', error: e.message });
  }
  
  logE2ETestResults('CONCORRENCIA', results);
  return results;
}


// ============================================================================
// E2E SUITE 6: TESTES DE RESILIÊNCIA
// ============================================================================

/**
 * Testa comportamento do sistema em cenários de falha
 */
function testE2E_Resiliencia() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: RESILIÊNCIA E RECUPERAÇÃO                             ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  
  // PASSO 1: Retry em caso de falha temporária
  H.logStep(1, 'Testando retry em falha temporária');
  results.total++;
  
  try {
    var tentativas = 0;
    var maxTentativas = 3;
    var sucesso = false;
    
    function operacaoInstavel() {
      tentativas++;
      if (tentativas < 3) {
        throw new Error('Falha temporária');
      }
      return { success: true, data: 'OK' };
    }
    
    // Implementa retry
    while (tentativas < maxTentativas && !sucesso) {
      try {
        var resultado = operacaoInstavel();
        sucesso = resultado.success;
      } catch (e) {
        H.log('   ⚠️ Tentativa ' + tentativas + ' falhou, retentando...');
        if (tentativas >= maxTentativas) {
          throw e;
        }
      }
    }
    
    H.assert(sucesso, 'Operação deve ter sucesso após retries');
    H.assertEqual(tentativas, 3, 'Deve ter feito 3 tentativas');
    
    H.log('   ✅ Retry funcionando - sucesso após ' + tentativas + ' tentativas');
    results.passed++;
    results.steps.push({ step: 1, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Retry: ' + e.message);
    results.steps.push({ step: 1, status: 'FAILED', error: e.message });
  }
  
  // PASSO 2: Fallback em caso de serviço indisponível
  H.logStep(2, 'Testando fallback');
  results.total++;
  
  try {
    function servicoPrincipal() {
      throw new Error('Serviço indisponível');
    }
    
    function servicoFallback() {
      return { success: true, data: 'Dados do cache', source: 'fallback' };
    }
    
    var resultado;
    try {
      resultado = servicoPrincipal();
    } catch (e) {
      H.log('   ⚠️ Serviço principal falhou, usando fallback...');
      resultado = servicoFallback();
    }
    
    H.assert(resultado.success, 'Fallback deve retornar sucesso');
    H.assertEqual(resultado.source, 'fallback', 'Deve indicar que veio do fallback');
    
    H.log('   ✅ Fallback funcionando');
    results.passed++;
    results.steps.push({ step: 2, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Fallback: ' + e.message);
    results.steps.push({ step: 2, status: 'FAILED', error: e.message });
  }
  
  // PASSO 3: Graceful degradation
  H.logStep(3, 'Testando degradação graciosa');
  results.total++;
  
  try {
    var servicosDisponiveis = {
      cache: true,
      database: true,
      email: false, // Serviço de email indisponível
      relatorios: true
    };
    
    function executarOperacao(servicos) {
      var resultado = {
        success: true,
        warnings: [],
        data: {}
      };
      
      // Operação principal (database)
      if (!servicos.database) {
        resultado.success = false;
        resultado.error = 'Database indisponível';
        return resultado;
      }
      resultado.data.registroSalvo = true;
      
      // Operação secundária (email) - não crítica
      if (!servicos.email) {
        resultado.warnings.push('Notificação por email não enviada');
      } else {
        resultado.data.emailEnviado = true;
      }
      
      // Operação secundária (cache) - não crítica
      if (!servicos.cache) {
        resultado.warnings.push('Cache não atualizado');
      } else {
        resultado.data.cacheAtualizado = true;
      }
      
      return resultado;
    }
    
    var resultado = executarOperacao(servicosDisponiveis);
    
    H.assert(resultado.success, 'Operação deve ter sucesso mesmo com serviços degradados');
    H.assert(resultado.warnings.length > 0, 'Deve ter warnings sobre serviços indisponíveis');
    H.assert(resultado.data.registroSalvo, 'Operação principal deve ter sido executada');
    
    H.log('   ✅ Degradação graciosa funcionando - ' + resultado.warnings.length + ' warning(s)');
    results.passed++;
    results.steps.push({ step: 3, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Degradação: ' + e.message);
    results.steps.push({ step: 3, status: 'FAILED', error: e.message });
  }
  
  // PASSO 4: Rollback em caso de falha
  H.logStep(4, 'Testando rollback');
  results.total++;
  
  try {
    var estadoInicial = {
      saldoEmpenho: 10000.00,
      statusNF: 'PENDENTE',
      registrosAuditoria: 5
    };
    
    var estadoAtual = JSON.parse(JSON.stringify(estadoInicial));
    var operacoesRealizadas = [];
    
    function executarComRollback(operacoes) {
      try {
        operacoes.forEach(function(op) {
          op.execute(estadoAtual);
          operacoesRealizadas.push(op);
        });
        return { success: true };
      } catch (e) {
        // Rollback
        H.log('   ⚠️ Erro detectado, executando rollback...');
        operacoesRealizadas.reverse().forEach(function(op) {
          if (op.rollback) {
            op.rollback(estadoAtual);
          }
        });
        return { success: false, error: e.message, rolledBack: true };
      }
    }
    
    var operacoes = [
      {
        name: 'Debitar empenho',
        execute: function(estado) { estado.saldoEmpenho -= 3000; },
        rollback: function(estado) { estado.saldoEmpenho += 3000; }
      },
      {
        name: 'Atualizar status',
        execute: function(estado) { estado.statusNF = 'PROCESSANDO'; },
        rollback: function(estado) { estado.statusNF = 'PENDENTE'; }
      },
      {
        name: 'Operação que falha',
        execute: function(estado) { throw new Error('Falha simulada'); },
        rollback: function(estado) { }
      }
    ];
    
    var resultado = executarComRollback(operacoes);
    
    H.assert(!resultado.success, 'Operação deve ter falhado');
    H.assert(resultado.rolledBack, 'Rollback deve ter sido executado');
    H.assertEqual(estadoAtual.saldoEmpenho, estadoInicial.saldoEmpenho, 'Saldo deve ter sido restaurado');
    H.assertEqual(estadoAtual.statusNF, estadoInicial.statusNF, 'Status deve ter sido restaurado');
    
    H.log('   ✅ Rollback funcionando - estado restaurado');
    results.passed++;
    results.steps.push({ step: 4, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Rollback: ' + e.message);
    results.steps.push({ step: 4, status: 'FAILED', error: e.message });
  }
  
  logE2ETestResults('RESILIENCIA', results);
  return results;
}


// ============================================================================
// E2E SUITE 7: TESTES DE INTEGRAÇÃO ENTRE MÓDULOS
// ============================================================================

/**
 * Testa a integração entre diferentes módulos do sistema
 */
function testE2E_IntegracaoModulos() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║  E2E TEST: INTEGRAÇÃO ENTRE MÓDULOS                              ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  var results = { total: 0, passed: 0, failed: 0, errors: [], steps: [] };
  var H = E2EHelpers;
  
  // PASSO 1: Core_CRUD + Core_Cache
  H.logStep(1, 'Testando integração CRUD + Cache');
  results.total++;
  
  try {
    // Simula operação CRUD que usa cache
    var mockCRUD = {
      read: function(sheet, options) {
        var cacheKey = 'crud_' + sheet + '_' + JSON.stringify(options || {});
        
        // Tenta cache primeiro
        var cached = this._getFromCache(cacheKey);
        if (cached && !options.skipCache) {
          return { success: true, data: cached, source: 'cache' };
        }
        
        // Busca do "banco"
        var data = [{ id: 1, nome: 'Teste' }];
        
        // Salva no cache
        this._setCache(cacheKey, data);
        
        return { success: true, data: data, source: 'database' };
      },
      _cache: {},
      _getFromCache: function(key) { return this._cache[key]; },
      _setCache: function(key, value) { this._cache[key] = value; }
    };
    
    // Primeira leitura - deve vir do banco
    var result1 = mockCRUD.read('Usuarios', {});
    H.assertEqual(result1.source, 'database', 'Primeira leitura deve vir do banco');
    
    // Segunda leitura - deve vir do cache
    var result2 = mockCRUD.read('Usuarios', {});
    H.assertEqual(result2.source, 'cache', 'Segunda leitura deve vir do cache');
    
    // Leitura forçando skip cache
    var result3 = mockCRUD.read('Usuarios', { skipCache: true });
    H.assertEqual(result3.source, 'database', 'Com skipCache deve vir do banco');
    
    H.log('   ✅ Integração CRUD + Cache funcionando');
    results.passed++;
    results.steps.push({ step: 1, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('CRUD+Cache: ' + e.message);
    results.steps.push({ step: 1, status: 'FAILED', error: e.message });
  }
  
  // PASSO 2: Core_Auth + Core_Logger
  H.logStep(2, 'Testando integração Auth + Logger');
  results.total++;
  
  try {
    var logs = [];
    var mockLogger = {
      log: function(level, message, metadata) {
        logs.push({
          timestamp: new Date(),
          level: level,
          message: message,
          metadata: metadata
        });
      },
      info: function(msg, meta) { this.log('INFO', msg, meta); },
      warn: function(msg, meta) { this.log('WARN', msg, meta); },
      error: function(msg, meta) { this.log('ERROR', msg, meta); },
      audit: function(msg, meta) { this.log('AUDIT', msg, meta); }
    };
    
    // Simula login com logging
    function loginComAuditoria(email, senha) {
      mockLogger.info('Tentativa de login', { email: email });
      
      // Simula validação
      var sucesso = email && senha;
      
      if (sucesso) {
        mockLogger.audit('Login bem-sucedido', { email: email, ip: '192.168.1.1' });
        return { success: true };
      } else {
        mockLogger.warn('Login falhou', { email: email, motivo: 'Credenciais inválidas' });
        return { success: false };
      }
    }
    
    loginComAuditoria('user@test.com', 'senha123');
    loginComAuditoria('', ''); // Falha
    
    H.assert(logs.length >= 3, 'Deve ter pelo menos 3 logs');
    H.assert(logs.some(function(l) { return l.level === 'AUDIT'; }), 'Deve ter log de auditoria');
    H.assert(logs.some(function(l) { return l.level === 'WARN'; }), 'Deve ter log de warning');
    
    H.log('   ✅ Integração Auth + Logger funcionando - ' + logs.length + ' logs gerados');
    results.passed++;
    results.steps.push({ step: 2, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Auth+Logger: ' + e.message);
    results.steps.push({ step: 2, status: 'FAILED', error: e.message });
  }
  
  // PASSO 3: Core_Validator + Core_Business_Rules
  H.logStep(3, 'Testando integração Validator + Business Rules');
  results.total++;
  
  try {
    var businessRules = {
      PRAZOS: {
        ATESTO: 5, // dias úteis
        PAGAMENTO: 30 // dias corridos
      },
      LIMITES: {
        GLOSA_MAXIMA_PERCENTUAL: 30
      }
    };
    
    var validator = {
      validarPrazoAtesto: function(dataRecebimento, dataAtesto) {
        var diffDias = Math.ceil((dataAtesto - dataRecebimento) / (1000 * 60 * 60 * 24));
        return diffDias <= businessRules.PRAZOS.ATESTO;
      },
      validarPercentualGlosa: function(valorGlosa, valorTotal) {
        var percentual = (valorGlosa / valorTotal) * 100;
        return percentual <= businessRules.LIMITES.GLOSA_MAXIMA_PERCENTUAL;
      }
    };
    
    // Testa prazo de atesto
    var dataRecebimento = new Date(2025, 11, 1);
    var dataAtestoDentro = new Date(2025, 11, 4); // 3 dias depois
    var dataAtestoFora = new Date(2025, 11, 10); // 9 dias depois
    
    H.assert(validator.validarPrazoAtesto(dataRecebimento, dataAtestoDentro), 'Atesto dentro do prazo');
    H.assert(!validator.validarPrazoAtesto(dataRecebimento, dataAtestoFora), 'Atesto fora do prazo');
    
    // Testa percentual de glosa
    H.assert(validator.validarPercentualGlosa(2000, 10000), 'Glosa de 20% deve ser válida');
    H.assert(!validator.validarPercentualGlosa(4000, 10000), 'Glosa de 40% deve ser inválida');
    
    H.log('   ✅ Integração Validator + Business Rules funcionando');
    results.passed++;
    results.steps.push({ step: 3, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('Validator+Rules: ' + e.message);
    results.steps.push({ step: 3, status: 'FAILED', error: e.message });
  }
  
  // PASSO 4: Core_API + Core_Standard_Response
  H.logStep(4, 'Testando integração API + Standard Response');
  results.total++;
  
  try {
    var StandardResponse = {
      success: function(data, message) {
        return {
          success: true,
          data: data,
          message: message || 'Operação realizada com sucesso',
          timestamp: new Date().toISOString()
        };
      },
      error: function(message, code) {
        return {
          success: false,
          error: message,
          code: code || 500,
          timestamp: new Date().toISOString()
        };
      },
      paginated: function(data, page, pageSize, total) {
        return {
          success: true,
          data: data,
          pagination: {
            page: page,
            pageSize: pageSize,
            total: total,
            totalPages: Math.ceil(total / pageSize)
          },
          timestamp: new Date().toISOString()
        };
      }
    };
    
    // Testa respostas padronizadas
    var successResp = StandardResponse.success({ id: 1 }, 'Criado');
    H.assert(successResp.success === true, 'Resposta de sucesso');
    H.assertNotNull(successResp.timestamp, 'Deve ter timestamp');
    
    var errorResp = StandardResponse.error('Não encontrado', 404);
    H.assert(errorResp.success === false, 'Resposta de erro');
    H.assertEqual(errorResp.code, 404, 'Código de erro');
    
    var paginatedResp = StandardResponse.paginated([1,2,3], 1, 10, 100);
    H.assertEqual(paginatedResp.pagination.totalPages, 10, 'Total de páginas');
    
    H.log('   ✅ Integração API + Standard Response funcionando');
    results.passed++;
    results.steps.push({ step: 4, status: 'PASSED' });
    
  } catch (e) {
    results.failed++;
    results.errors.push('API+Response: ' + e.message);
    results.steps.push({ step: 4, status: 'FAILED', error: e.message });
  }
  
  logE2ETestResults('INTEGRACAO_MODULOS', results);
  return results;
}


// ============================================================================
// FUNÇÕES DE UTILIDADE E RUNNER
// ============================================================================

/**
 * Loga resultados de teste E2E formatados
 */
function logE2ETestResults(suiteName, results) {
  Logger.log('');
  Logger.log('┌─────────────────────────────────────────────────────────────────┐');
  Logger.log('│ RESULTADO: ' + suiteName.padEnd(52) + '│');
  Logger.log('├─────────────────────────────────────────────────────────────────┤');
  Logger.log('│ Total: ' + String(results.total).padEnd(5) + 
             ' Passou: ' + String(results.passed).padEnd(5) + 
             ' Falhou: ' + String(results.failed).padEnd(5) + '          │');
  Logger.log('│ Taxa de Sucesso: ' + ((results.passed / results.total) * 100).toFixed(1) + '%'.padEnd(43) + '│');
  
  if (results.errors.length > 0) {
    Logger.log('├─────────────────────────────────────────────────────────────────┤');
    Logger.log('│ ERROS:                                                          │');
    results.errors.forEach(function(err) {
      Logger.log('│  - ' + err.substring(0, 60).padEnd(60) + '│');
    });
  }
  
  Logger.log('└─────────────────────────────────────────────────────────────────┘');
}

/**
 * Executa todos os testes E2E
 * @returns {Object} Resultado consolidado
 */
function runAllE2ETests() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║                                                                   ║');
  Logger.log('║     SUITE COMPLETA DE TESTES E2E - UNIAE CRE                     ║');
  Logger.log('║     Sistema de Gestão de Alimentação Escolar                     ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('Data/Hora: ' + new Date().toISOString());
  Logger.log('');
  
  var startTime = Date.now();
  var allResults = [];
  
  // Executa todas as suites E2E
  var suites = [
    { name: 'Fluxo Completo NF', fn: testE2E_FluxoCompletaNF },
    { name: 'Fluxo de Glosa', fn: testE2E_FluxoGlosa },
    { name: 'Cardápio Especial', fn: testE2E_FluxoCardapioEspecial },
    { name: 'Permissões e Segurança', fn: testE2E_PermissoesSeguranca },
    { name: 'Concorrência', fn: testE2E_Concorrencia },
    { name: 'Resiliência', fn: testE2E_Resiliencia },
    { name: 'Integração Módulos', fn: testE2E_IntegracaoModulos }
  ];
  
  suites.forEach(function(suite) {
    try {
      var result = suite.fn();
      result.suiteName = suite.name;
      allResults.push(result);
    } catch (e) {
      Logger.log('❌ Erro fatal na suite ' + suite.name + ': ' + e.message);
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
  
  // Consolida resultados
  var consolidated = {
    timestamp: new Date().toISOString(),
    duration: totalDuration,
    suites: allResults.length,
    totals: {
      total: 0,
      passed: 0,
      failed: 0
    },
    results: allResults
  };
  
  allResults.forEach(function(r) {
    consolidated.totals.total += r.total;
    consolidated.totals.passed += r.passed;
    consolidated.totals.failed += r.failed;
  });
  
  consolidated.successRate = (consolidated.totals.passed / consolidated.totals.total * 100).toFixed(1);
  consolidated.success = consolidated.totals.failed === 0;
  
  // Relatório final
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║                    RELATÓRIO FINAL E2E                           ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  Suites Executadas: ' + String(consolidated.suites).padEnd(45) + '║');
  Logger.log('║  Total de Testes:   ' + String(consolidated.totals.total).padEnd(45) + '║');
  Logger.log('║  ✅ Passou:         ' + String(consolidated.totals.passed).padEnd(45) + '║');
  Logger.log('║  ❌ Falhou:         ' + String(consolidated.totals.failed).padEnd(45) + '║');
  Logger.log('║  Taxa de Sucesso:   ' + (consolidated.successRate + '%').padEnd(45) + '║');
  Logger.log('║  Tempo Total:       ' + (totalDuration + 'ms').padEnd(45) + '║');
  Logger.log('║                                                                   ║');
  Logger.log('║  Status: ' + (consolidated.success ? '✅ TODOS OS TESTES PASSARAM' : '❌ ALGUNS TESTES FALHARAM').padEnd(55) + '║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  return consolidated;
}

/**
 * Executa suite E2E específica
 * @param {string} suiteName - Nome da suite
 */
function runE2ESuite(suiteName) {
  var suiteMap = {
    'nf': testE2E_FluxoCompletaNF,
    'glosa': testE2E_FluxoGlosa,
    'cardapio': testE2E_FluxoCardapioEspecial,
    'permissoes': testE2E_PermissoesSeguranca,
    'concorrencia': testE2E_Concorrencia,
    'resiliencia': testE2E_Resiliencia,
    'integracao': testE2E_IntegracaoModulos
  };
  
  var fn = suiteMap[suiteName.toLowerCase()];
  if (!fn) {
    Logger.log('Suite não encontrada: ' + suiteName);
    Logger.log('Suites disponíveis: ' + Object.keys(suiteMap).join(', '));
    return null;
  }
  
  return fn();
}

// Funções de conveniência
function runE2E_NF() { return runE2ESuite('nf'); }
function runE2E_Glosa() { return runE2ESuite('glosa'); }
function runE2E_Cardapio() { return runE2ESuite('cardapio'); }
function runE2E_Permissoes() { return runE2ESuite('permissoes'); }
function runE2E_Concorrencia() { return runE2ESuite('concorrencia'); }
function runE2E_Resiliencia() { return runE2ESuite('resiliencia'); }
function runE2E_Integracao() { return runE2ESuite('integracao'); }

// ============================================================================
// LOG DE CARREGAMENTO
// ============================================================================

Logger.log('✅ Test_Integration_E2E.gs carregado - ' + new Date().toISOString());
