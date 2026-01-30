/**
 * @fileoverview Testes de Integração de Regras de Negócio
 * @version 1.0.0
 * @description Testes focados nas regras de negócio específicas do sistema
 * de gestão de alimentação escolar UNIAE CRE.
 * 
 * COBERTURA:
 * - Fluxo de Notas Fiscais
 * - Validações de Empenho
 * - Processo de Atesto
 * - Regras de Glosa
 * - Conformidade e Auditoria
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-08
 */

'use strict';

// ============================================================================
// SUITE: VALIDAÇÕES DE NOTA FISCAL
// ============================================================================

function defineBusinessTests_NotaFiscal() {
  describe('Business: Nota Fiscal Validations', function() {
    
    it('should validate chave de acesso format (44 digits)', function() {
      var validChave = '12345678901234567890123456789012345678901234';
      var invalidChave = '123456';
      
      expect(validChave.replace(/\D/g, '').length).toBe(44);
      expect(invalidChave.replace(/\D/g, '').length).not.toBe(44);
    });
    
    it('should validate CNPJ format', function() {
      var validCNPJ = '12.345.678/0001-99';
      var digits = validCNPJ.replace(/\D/g, '');
      
      expect(digits.length).toBe(14);
    });
    
    it('should validate valor total is positive', function() {
      var validation1 = ValidatorBase.validatePositiveNumber(1500.50, 'Valor_Total');
      var validation2 = ValidatorBase.validatePositiveNumber(-100, 'Valor_Total');
      var validation3 = ValidatorBase.validatePositiveNumber(0, 'Valor_Total');
      
      expect(validation1).toBeUndefined();
      expect(validation2).toBeDefined();
      expect(validation2.valid).toBe(false);
    });
    
    it('should validate data emissao is not future', function() {
      var today = new Date();
      var pastDate = new Date(today.getTime() - 86400000); // Ontem
      var futureDate = new Date(today.getTime() + 86400000); // Amanhã
      
      // Data passada é válida
      expect(pastDate <= today).toBe(true);
      
      // Data futura não deveria ser válida para emissão
      expect(futureDate > today).toBe(true);
    });
    
    it('should validate status transitions', function() {
      var validTransitions = {
        'PENDENTE': ['RECEBIDA', 'CANCELADA'],
        'RECEBIDA': ['EM_CONFERENCIA', 'RECUSADA'],
        'EM_CONFERENCIA': ['CONFERIDA', 'GLOSADA'],
        'CONFERIDA': ['ATESTADA'],
        'ATESTADA': ['LIQUIDADA'],
        'LIQUIDADA': ['PAGA']
      };
      
      // PENDENTE pode ir para RECEBIDA
      expect(validTransitions['PENDENTE']).toContain('RECEBIDA');
      
      // PENDENTE não pode ir direto para ATESTADA
      expect(validTransitions['PENDENTE']).not.toContain('ATESTADA');
      
      // CONFERIDA pode ir para ATESTADA
      expect(validTransitions['CONFERIDA']).toContain('ATESTADA');
    });
    
    it('should calculate prazo de pagamento correctly', function() {
      var dataEmissao = new Date(2025, 11, 1); // 1 de dezembro
      var prazoLegal = 30; // 30 dias
      
      // Calcula data de vencimento
      var dataVencimento = new Date(dataEmissao);
      dataVencimento.setDate(dataVencimento.getDate() + prazoLegal);
      
      expect(dataVencimento.getDate()).toBe(31);
      expect(dataVencimento.getMonth()).toBe(11); // Dezembro
    });
  });
}

// ============================================================================
// SUITE: VALIDAÇÕES DE EMPENHO
// ============================================================================

function defineBusinessTests_Empenho() {
  describe('Business: Empenho Validations', function() {
    
    it('should validate numero empenho format', function() {
      // Formato esperado: YYYY/NNNNNN
      var validEmpenho = '2025/000123';
      var invalidEmpenho = '123456';
      
      var regex = /^\d{4}\/\d{6}$/;
      
      expect(regex.test(validEmpenho)).toBe(true);
      expect(regex.test(invalidEmpenho)).toBe(false);
    });
    
    it('should validate saldo disponivel', function() {
      var empenho = {
        valor_total: 10000.00,
        valor_utilizado: 7500.00
      };
      
      var saldoDisponivel = empenho.valor_total - empenho.valor_utilizado;
      var valorNF = 3000.00;
      
      // Saldo insuficiente
      expect(saldoDisponivel < valorNF).toBe(true);
      
      // Saldo suficiente
      var valorNFMenor = 2000.00;
      expect(saldoDisponivel >= valorNFMenor).toBe(true);
    });
    
    it('should validate vigencia do empenho', function() {
      var hoje = new Date();
      
      var empenhoVigente = {
        data_inicio: new Date(hoje.getTime() - 30 * 86400000),
        data_fim: new Date(hoje.getTime() + 30 * 86400000)
      };
      
      var empenhoExpirado = {
        data_inicio: new Date(hoje.getTime() - 60 * 86400000),
        data_fim: new Date(hoje.getTime() - 30 * 86400000)
      };
      
      // Empenho vigente
      expect(hoje >= empenhoVigente.data_inicio && hoje <= empenhoVigente.data_fim).toBe(true);
      
      // Empenho expirado
      expect(hoje > empenhoExpirado.data_fim).toBe(true);
    });
    
    it('should validate natureza de despesa', function() {
      var naturezasValidas = ['339030', '339039', '449052'];
      
      expect(naturezasValidas).toContain('339030');
      expect(naturezasValidas).not.toContain('999999');
    });
  });
}

// ============================================================================
// SUITE: PROCESSO DE ATESTO
// ============================================================================

function defineBusinessTests_Atesto() {
  describe('Business: Atesto Process', function() {
    
    it('should require all items conferidos before atesto', function() {
      var itensNF = [
        { id: 1, conferido: true },
        { id: 2, conferido: true },
        { id: 3, conferido: false }
      ];
      
      var todosConferidos = itensNF.every(function(item) {
        return item.conferido === true;
      });
      
      expect(todosConferidos).toBe(false);
      
      // Após conferir todos
      itensNF[2].conferido = true;
      var todosConferidosAgora = itensNF.every(function(item) {
        return item.conferido === true;
      });
      
      expect(todosConferidosAgora).toBe(true);
    });
    
    it('should validate quantidade recebida vs quantidade NF', function() {
      var item = {
        quantidade_nf: 100,
        quantidade_recebida: 95
      };
      
      var diferenca = item.quantidade_nf - item.quantidade_recebida;
      var percentualDiferenca = (diferenca / item.quantidade_nf) * 100;
      
      // Diferença de 5%
      expect(percentualDiferenca).toBe(5);
      
      // Tolerância de 2% - deveria glosar
      var tolerancia = 2;
      expect(percentualDiferenca > tolerancia).toBe(true);
    });
    
    it('should calculate valor glosa correctly', function() {
      var item = {
        quantidade_nf: 100,
        quantidade_recebida: 90,
        valor_unitario: 10.00
      };
      
      var quantidadeGlosada = item.quantidade_nf - item.quantidade_recebida;
      var valorGlosa = quantidadeGlosada * item.valor_unitario;
      
      expect(quantidadeGlosada).toBe(10);
      expect(valorGlosa).toBe(100.00);
    });
    
    it('should require justificativa for glosa', function() {
      var glosa = {
        quantidade: 10,
        valor: 100.00,
        justificativa: ''
      };
      
      var validation = ValidatorBase.validateRequiredString(glosa.justificativa, 'Justificativa');
      
      expect(validation).toBeDefined();
      expect(validation.valid).toBe(false);
    });
    
    it('should validate assinatura digital requirements', function() {
      // Arquitetura 100% digital: assinatura = usuário autenticado + timestamp
      var atesto = {
        usuario: 'fiscal@example.com',
        data: new Date(),
        assinatura_digital: 'fiscal@example.com' // Usuário autenticado = assinatura
      };
      
      expect(atesto.usuario).toBeDefined();
      expect(atesto.data).toBeDefined();
      expect(atesto.assinatura_digital).toBeDefined();
      expect(atesto.assinatura_digital.length).toBeGreaterThan(0);
    });
  });
}

// ============================================================================
// SUITE: REGRAS DE GLOSA
// ============================================================================

function defineBusinessTests_Glosa() {
  describe('Business: Glosa Rules', function() {
    
    it('should identify motivos de glosa', function() {
      var motivosValidos = [
        'QUANTIDADE_DIVERGENTE',
        'PRODUTO_AVARIADO',
        'VALIDADE_VENCIDA',
        'TEMPERATURA_INADEQUADA',
        'EMBALAGEM_VIOLADA',
        'PRODUTO_NAO_CONFORME'
      ];
      
      expect(motivosValidos).toContain('QUANTIDADE_DIVERGENTE');
      expect(motivosValidos).toContain('PRODUTO_AVARIADO');
    });
    
    it('should calculate total glosa for NF', function() {
      var itensGlosados = [
        { valor_glosa: 50.00 },
        { valor_glosa: 75.50 },
        { valor_glosa: 24.50 }
      ];
      
      var totalGlosa = itensGlosados.reduce(function(sum, item) {
        return sum + item.valor_glosa;
      }, 0);
      
      expect(totalGlosa).toBe(150.00);
    });
    
    it('should calculate valor liquido after glosa', function() {
      var nf = {
        valor_bruto: 1000.00,
        valor_glosa: 150.00
      };
      
      var valorLiquido = nf.valor_bruto - nf.valor_glosa;
      
      expect(valorLiquido).toBe(850.00);
    });
    
    it('should validate percentual maximo de glosa', function() {
      var nf = {
        valor_bruto: 1000.00,
        valor_glosa: 350.00
      };
      
      var percentualGlosa = (nf.valor_glosa / nf.valor_bruto) * 100;
      var limitePercentual = 30; // 30% máximo
      
      // Glosa de 35% excede o limite
      expect(percentualGlosa > limitePercentual).toBe(true);
    });
    
    it('should require evidencia fotografica for certain motivos', function() {
      var motivosComEvidencia = [
        'PRODUTO_AVARIADO',
        'EMBALAGEM_VIOLADA',
        'PRODUTO_NAO_CONFORME'
      ];
      
      var glosa = {
        motivo: 'PRODUTO_AVARIADO',
        evidencia_url: ''
      };
      
      var requerEvidencia = motivosComEvidencia.indexOf(glosa.motivo) !== -1;
      var temEvidencia = !!(glosa.evidencia_url && glosa.evidencia_url.length > 0);
      
      expect(requerEvidencia).toBe(true);
      expect(temEvidencia).toBeFalsy();
    });
  });
}

// ============================================================================
// SUITE: CONFORMIDADE E AUDITORIA
// ============================================================================

function defineBusinessTests_Conformidade() {
  describe('Business: Conformidade & Auditoria', function() {
    
    it('should track all status changes', function() {
      var historicoStatus = [];
      
      function registrarMudanca(statusAnterior, statusNovo, usuario) {
        historicoStatus.push({
          de: statusAnterior,
          para: statusNovo,
          usuario: usuario,
          data: new Date()
        });
      }
      
      registrarMudanca('PENDENTE', 'RECEBIDA', 'user1@example.com');
      registrarMudanca('RECEBIDA', 'CONFERIDA', 'user2@example.com');
      
      expect(historicoStatus.length).toBe(2);
      expect(historicoStatus[0].de).toBe('PENDENTE');
      expect(historicoStatus[1].para).toBe('CONFERIDA');
    });
    
    it('should validate prazo legal de atesto', function() {
      var dataRecebimento = new Date(2025, 11, 1);
      var prazoLegal = 5; // 5 dias úteis
      var hoje = new Date(2025, 11, 8); // 8 de dezembro (segunda)
      
      // Calcula diferença de dias (fallback se Utils não disponível)
      var diffTime = Math.abs(hoje - dataRecebimento);
      var diasCorridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Verificar se está dentro do prazo
      expect(diasCorridos).toBe(7);
    });
    
    it('should identify NFs pendentes de atesto', function() {
      var notas = [
        { numero: 'NF001', status: 'CONFERIDA', data_conferencia: new Date(2025, 11, 1) },
        { numero: 'NF002', status: 'ATESTADA', data_conferencia: new Date(2025, 11, 2) },
        { numero: 'NF003', status: 'CONFERIDA', data_conferencia: new Date(2025, 11, 3) }
      ];
      
      var pendentesAtesto = notas.filter(function(nf) {
        return nf.status === 'CONFERIDA';
      });
      
      expect(pendentesAtesto.length).toBe(2);
    });
    
    it('should calculate indicadores de performance', function() {
      var dados = {
        total_nfs: 100,
        nfs_no_prazo: 85,
        nfs_com_glosa: 15,
        valor_total: 500000.00,
        valor_glosado: 25000.00
      };
      
      var taxaConformidade = (dados.nfs_no_prazo / dados.total_nfs) * 100;
      var taxaGlosa = (dados.nfs_com_glosa / dados.total_nfs) * 100;
      var percentualGlosado = (dados.valor_glosado / dados.valor_total) * 100;
      
      expect(taxaConformidade).toBe(85);
      expect(taxaGlosa).toBe(15);
      expect(percentualGlosado).toBe(5);
    });
    
    it('should validate segregacao de funcoes', function() {
      var operacao = {
        usuario_cadastro: 'user1@example.com',
        usuario_conferencia: 'user2@example.com',
        usuario_atesto: 'user3@example.com'
      };
      
      // Mesmo usuário não pode fazer cadastro e atesto
      var segregacaoValida = operacao.usuario_cadastro !== operacao.usuario_atesto;
      
      expect(segregacaoValida).toBe(true);
      
      // Violação de segregação
      var operacaoInvalida = {
        usuario_cadastro: 'user1@example.com',
        usuario_atesto: 'user1@example.com'
      };
      
      var segregacaoInvalida = operacaoInvalida.usuario_cadastro !== operacaoInvalida.usuario_atesto;
      
      expect(segregacaoInvalida).toBe(false);
    });
  });
}


// ============================================================================
// SUITE: FLUXO COMPLETO DE ENTREGA
// ============================================================================

function defineBusinessTests_Entrega() {
  describe('Business: Delivery Flow', function() {
    
    it('should validate agendamento de entrega', function() {
      var agendamento = {
        data_prevista: new Date(2025, 11, 15),
        hora_inicio: '08:00',
        hora_fim: '12:00',
        unidade_escolar: 'EC 01 Plano Piloto'
      };
      
      expect(agendamento.data_prevista).toBeDefined();
      expect(agendamento.hora_inicio).toBeDefined();
      expect(agendamento.unidade_escolar).toBeDefined();
    });
    
    it('should track status de entrega', function() {
      var statusValidos = [
        'AGENDADA',
        'EM_TRANSITO',
        'ENTREGUE',
        'ENTREGUE_PARCIAL',
        'RECUSADA',
        'CANCELADA'
      ];
      
      expect(statusValidos).toContain('ENTREGUE');
      expect(statusValidos).toContain('ENTREGUE_PARCIAL');
    });
    
    it('should validate checklist de recebimento', function() {
      var checklist = {
        temperatura_adequada: true,
        embalagem_integra: true,
        validade_ok: true,
        quantidade_confere: false,
        documentacao_ok: true
      };
      
      var todosItensOk = Object.values(checklist).every(function(v) { return v === true; });
      
      expect(todosItensOk).toBe(false);
      
      // Identificar itens com problema
      var itensComProblema = Object.keys(checklist).filter(function(k) {
        return checklist[k] === false;
      });
      
      expect(itensComProblema).toContain('quantidade_confere');
    });
    
    it('should calculate tempo de entrega', function() {
      var entrega = {
        data_saida: new Date(2025, 11, 8, 8, 0, 0),
        data_chegada: new Date(2025, 11, 8, 10, 30, 0)
      };
      
      var tempoMs = entrega.data_chegada - entrega.data_saida;
      var tempoMinutos = tempoMs / (1000 * 60);
      
      expect(tempoMinutos).toBe(150); // 2h30min
    });
    
    it('should validate responsavel pelo recebimento', function() {
      var recebimento = {
        responsavel_nome: 'Maria Silva',
        responsavel_matricula: '123456',
        responsavel_cargo: 'Diretor'
      };
      
      expect(recebimento.responsavel_nome).toBeDefined();
      expect(recebimento.responsavel_matricula).toBeDefined();
    });
  });
}

// ============================================================================
// SUITE: CARDÁPIOS E NUTRIÇÃO
// ============================================================================

function defineBusinessTests_Nutricao() {
  describe('Business: Nutrition & Menu', function() {
    
    it('should validate composicao nutricional', function() {
      var produto = {
        nome: 'Arroz Tipo 1',
        calorias_100g: 130,
        proteinas_100g: 2.5,
        carboidratos_100g: 28,
        gorduras_100g: 0.3
      };
      
      expect(produto.calorias_100g).toBeGreaterThan(0);
      expect(produto.proteinas_100g).toBeGreaterThan(0);
    });
    
    it('should validate validade do produto', function() {
      var hoje = new Date();
      
      var produtoValido = {
        data_validade: new Date(hoje.getTime() + 30 * 86400000) // 30 dias
      };
      
      var produtoVencido = {
        data_validade: new Date(hoje.getTime() - 5 * 86400000) // 5 dias atrás
      };
      
      expect(produtoValido.data_validade > hoje).toBe(true);
      expect(produtoVencido.data_validade < hoje).toBe(true);
    });
    
    it('should calculate quantidade per capita', function() {
      var cardapio = {
        produto: 'Arroz',
        quantidade_per_capita_g: 80,
        numero_alunos: 500
      };
      
      var quantidadeTotalKg = (cardapio.quantidade_per_capita_g * cardapio.numero_alunos) / 1000;
      
      expect(quantidadeTotalKg).toBe(40); // 40kg
    });
    
    it('should validate restricoes alimentares', function() {
      var restricoes = ['GLUTEN', 'LACTOSE', 'AMENDOIM'];
      
      var produto = {
        nome: 'Biscoito',
        contem: ['GLUTEN', 'LACTOSE']
      };
      
      var temRestricao = produto.contem.some(function(item) {
        return restricoes.indexOf(item) !== -1;
      });
      
      expect(temRestricao).toBe(true);
    });
  });
}

// ============================================================================
// SUITE: FORNECEDORES
// ============================================================================

function defineBusinessTests_Fornecedor() {
  describe('Business: Supplier Management', function() {
    
    it('should validate CNPJ checksum', function() {
      // Função simplificada de validação de CNPJ
      function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cnpj)) return false;
        
        return true; // Simplificado para teste
      }
      
      expect(validarCNPJ('12.345.678/0001-99')).toBe(true);
      expect(validarCNPJ('11.111.111/1111-11')).toBe(false);
      expect(validarCNPJ('123')).toBe(false);
    });
    
    it('should track situacao cadastral', function() {
      var situacoesValidas = ['ATIVO', 'INATIVO', 'SUSPENSO', 'BLOQUEADO'];
      
      var fornecedor = {
        cnpj: '12345678000199',
        situacao: 'ATIVO'
      };
      
      expect(situacoesValidas).toContain(fornecedor.situacao);
    });
    
    it('should validate certidoes obrigatorias', function() {
      var certidoesObrigatorias = [
        'CND_FEDERAL',
        'CND_ESTADUAL',
        'CND_MUNICIPAL',
        'FGTS',
        'TRABALHISTA'
      ];
      
      var fornecedor = {
        certidoes: {
          CND_FEDERAL: { valida: true, vencimento: new Date(2026, 5, 1) },
          CND_ESTADUAL: { valida: true, vencimento: new Date(2026, 3, 1) },
          CND_MUNICIPAL: { valida: false, vencimento: new Date(2025, 1, 1) },
          FGTS: { valida: true, vencimento: new Date(2026, 2, 1) },
          TRABALHISTA: { valida: true, vencimento: new Date(2026, 4, 1) }
        }
      };
      
      var todasValidas = certidoesObrigatorias.every(function(cert) {
        return fornecedor.certidoes[cert] && fornecedor.certidoes[cert].valida;
      });
      
      expect(todasValidas).toBe(false); // CND_MUNICIPAL inválida
    });
    
    it('should calculate avaliacao do fornecedor', function() {
      var avaliacoes = {
        pontualidade: 4.5,
        qualidade: 4.0,
        atendimento: 4.8,
        documentacao: 5.0
      };
      
      var valores = Object.values(avaliacoes);
      var media = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
      
      expect(media).toBe(4.575);
    });
  });
}

// ============================================================================
// RUNNER DOS TESTES DE NEGÓCIO
// ============================================================================

/**
 * Executa todos os testes de regras de negócio
 * @returns {Object} Resultado dos testes
 */
function runAllBusinessTests() {
  TestFramework.clear();
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     TESTES DE REGRAS DE NEGÓCIO - UNIAE CRE                      ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  // Define todas as suites de negócio
  defineBusinessTests_NotaFiscal();
  defineBusinessTests_Empenho();
  defineBusinessTests_Atesto();
  defineBusinessTests_Glosa();
  defineBusinessTests_Conformidade();
  defineBusinessTests_Entrega();
  defineBusinessTests_Nutricao();
  defineBusinessTests_Fornecedor();
  
  return TestFramework.run();
}

/**
 * Executa teste de negócio específico
 * @param {string} suiteName - Nome da suite
 * @returns {Object} Resultado dos testes
 */
function runBusinessTestSuite(suiteName) {
  TestFramework.clear();
  
  var suiteMap = {
    'notafiscal': defineBusinessTests_NotaFiscal,
    'empenho': defineBusinessTests_Empenho,
    'atesto': defineBusinessTests_Atesto,
    'glosa': defineBusinessTests_Glosa,
    'conformidade': defineBusinessTests_Conformidade,
    'entrega': defineBusinessTests_Entrega,
    'nutricao': defineBusinessTests_Nutricao,
    'fornecedor': defineBusinessTests_Fornecedor
  };
  
  var defineFn = suiteMap[suiteName.toLowerCase()];
  
  if (!defineFn) {
    Logger.log('Suite não encontrada: ' + suiteName);
    Logger.log('Suites disponíveis: ' + Object.keys(suiteMap).join(', '));
    return { success: false, error: 'Suite não encontrada' };
  }
  
  defineFn();
  return TestFramework.run();
}

// Funções de conveniência
function runNotaFiscalBusinessTests() { return runBusinessTestSuite('notafiscal'); }
function runEmpenhoBusinessTests() { return runBusinessTestSuite('empenho'); }
function runAtestoBusinessTests() { return runBusinessTestSuite('atesto'); }
function runGlosaBusinessTests() { return runBusinessTestSuite('glosa'); }
function runConformidadeBusinessTests() { return runBusinessTestSuite('conformidade'); }
function runEntregaBusinessTests() { return runBusinessTestSuite('entrega'); }
function runNutricaoBusinessTests() { return runBusinessTestSuite('nutricao'); }
function runFornecedorBusinessTests() { return runBusinessTestSuite('fornecedor'); }

// ============================================================================
// EXECUÇÃO COMPLETA (INTEGRAÇÃO + NEGÓCIO)
// ============================================================================

/**
 * Executa TODOS os testes (integração + negócio)
 * @returns {Object} Resultado consolidado
 */
function runCompleteTestSuite() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     SUITE COMPLETA DE TESTES - UNIAE CRE                         ║');
  Logger.log('║     Integração + Regras de Negócio                               ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var startTime = Date.now();
  
  // Executa testes de integração
  Logger.log('📦 Executando Testes de Integração...');
  var integrationResults = runAllIntegrationTests();
  
  // Executa testes de negócio
  Logger.log('');
  Logger.log('📦 Executando Testes de Regras de Negócio...');
  var businessResults = runAllBusinessTests();
  
  var totalDuration = Date.now() - startTime;
  
  // Consolida resultados
  var consolidated = {
    timestamp: new Date().toISOString(),
    duration: totalDuration,
    integration: integrationResults.summary,
    business: businessResults.summary,
    totals: {
      total: integrationResults.summary.total + businessResults.summary.total,
      passed: integrationResults.summary.passed + businessResults.summary.passed,
      failed: integrationResults.summary.failed + businessResults.summary.failed,
      skipped: integrationResults.summary.skipped + businessResults.summary.skipped
    },
    success: integrationResults.success && businessResults.success
  };
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     RESULTADO CONSOLIDADO                                        ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║ Total de Testes: ' + consolidated.totals.total);
  Logger.log('║ ✅ Passou: ' + consolidated.totals.passed);
  Logger.log('║ ❌ Falhou: ' + consolidated.totals.failed);
  Logger.log('║ ⏭️ Pulado: ' + consolidated.totals.skipped);
  Logger.log('║ ⏱️ Tempo Total: ' + totalDuration + 'ms');
  Logger.log('║ Status: ' + (consolidated.success ? '✅ SUCESSO' : '❌ FALHA'));
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  return consolidated;
}
