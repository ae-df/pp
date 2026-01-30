/**
 * @fileoverview Testes dos Casos de Uso
 * @version 1.0.0
 * @description Testes de integração para os 4 casos de uso básicos
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-08
 */

'use strict';

// ============================================================================
// DADOS DE TESTE
// ============================================================================

var TestData = {
  // Usuário de teste
  usuario: {
    email: 'teste.uc@example.com',
    nome: 'Usuário de Teste UC',
    senha: 'Teste123', // Texto plano
    tipo: 'ANALISTA',
    perfil: 'FISCAL'
  },
  
  // Nota fiscal de teste
  notaFiscal: {
    numero_nf: 'NF-TESTE-001',
    serie: '1',
    fornecedor: 'Fornecedor Teste LTDA',
    cnpj: '12345678000199',
    valor_total: 5000.00,
    data_emissao: new Date(),
    nota_empenho: '2025/000001',
    itens_quantidade: 10
  },
  
  // Entrega de teste
  entrega: {
    unidade_escolar: 'EC 01 Plano Piloto',
    responsavel_recebimento: 'Maria Silva',
    matricula_responsavel: '123456',
    quantidade_volumes: 5,
    temperatura_adequada: true,
    embalagem_integra: true,
    documentacao_ok: true
  }
};

// ============================================================================
// TESTES UC01 - AUTENTICAÇÃO
// ============================================================================

function testUC01_Login() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE UC01: Login e Autenticação');
  Logger.log('═══════════════════════════════════════════════');
  
  var resultados = { passou: 0, falhou: 0, testes: [] };
  
  function teste(nome, fn) {
    try {
      var resultado = fn();
      if (resultado.success) {
        resultados.passou++;
        resultados.testes.push({ nome: nome, status: 'PASSOU', resultado: resultado });
        Logger.log('✅ ' + nome);
      } else {
        resultados.falhou++;
        resultados.testes.push({ nome: nome, status: 'FALHOU', erro: resultado.error });
        Logger.log('❌ ' + nome + ' - ' + resultado.error);
      }
    } catch (e) {
      resultados.falhou++;
      resultados.testes.push({ nome: nome, status: 'ERRO', erro: e.message });
      Logger.log('❌ ' + nome + ' - ERRO: ' + e.message);
    }
  }
  
  // Teste 1: Cadastrar usuário
  teste('Cadastrar usuário de teste', function() {
    var resultado = UseCases.cadastrarUsuario(TestData.usuario);
    // Se já existe, considera sucesso
    if (!resultado.success && resultado.error === 'Email já cadastrado') {
      return { success: true, message: 'Usuário já existe' };
    }
    return resultado;
  });
  
  // Teste 2: Login com credenciais válidas
  var sessaoId = null;
  teste('Login com credenciais válidas', function() {
    var resultado = UseCases.login(TestData.usuario.email, TestData.usuario.senha);
    if (resultado.success) {
      sessaoId = resultado.sessao;
    }
    return resultado;
  });
  
  // Teste 3: Login com senha incorreta
  teste('Login com senha incorreta deve falhar', function() {
    var resultado = UseCases.login(TestData.usuario.email, 'senhaerrada');
    // Esperamos que falhe
    return { success: !resultado.success };
  });
  
  // Teste 4: Login com email inexistente
  teste('Login com email inexistente deve falhar', function() {
    var resultado = UseCases.login('naoexiste@example.com', 'qualquer');
    return { success: !resultado.success };
  });
  
  // Teste 5: Verificar sessão válida
  teste('Verificar sessão válida', function() {
    if (!sessaoId) return { success: false, error: 'Sessão não criada' };
    var sessao = UseCases.verificarSessao(sessaoId);
    return { success: sessao !== null && sessao.email === TestData.usuario.email };
  });
  
  // Teste 6: Logout
  teste('Logout', function() {
    return UseCases.logout(sessaoId);
  });
  
  // Teste 7: Sessão inválida após logout
  teste('Sessão inválida após logout', function() {
    var sessao = UseCases.verificarSessao(sessaoId);
    return { success: sessao === null };
  });
  
  Logger.log('');
  Logger.log('Resultado UC01: ' + resultados.passou + '/' + (resultados.passou + resultados.falhou) + ' testes passaram');
  
  return resultados;
}

// ============================================================================
// TESTES UC02 - CADASTRO DE NOTA FISCAL
// ============================================================================

function testUC02_NotaFiscal() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE UC02: Cadastro de Nota Fiscal');
  Logger.log('═══════════════════════════════════════════════');
  
  var resultados = { passou: 0, falhou: 0, testes: [] };
  var sessaoId = null;
  var notaFiscalId = null;
  
  function teste(nome, fn) {
    try {
      var resultado = fn();
      if (resultado.success) {
        resultados.passou++;
        resultados.testes.push({ nome: nome, status: 'PASSOU' });
        Logger.log('✅ ' + nome);
      } else {
        resultados.falhou++;
        resultados.testes.push({ nome: nome, status: 'FALHOU', erro: resultado.error });
        Logger.log('❌ ' + nome + ' - ' + resultado.error);
      }
    } catch (e) {
      resultados.falhou++;
      resultados.testes.push({ nome: nome, status: 'ERRO', erro: e.message });
      Logger.log('❌ ' + nome + ' - ERRO: ' + e.message);
    }
  }
  
  // Setup: Login
  teste('Setup: Login', function() {
    var resultado = UseCases.login(TestData.usuario.email, TestData.usuario.senha);
    if (resultado.success) sessaoId = resultado.sessao;
    return resultado;
  });
  
  // Teste 1: Cadastrar NF sem autenticação
  teste('Cadastrar NF sem autenticação deve falhar', function() {
    var resultado = UseCases.cadastrarNotaFiscal(TestData.notaFiscal, 'sessao_invalida');
    return { success: !resultado.success };
  });
  
  // Teste 2: Cadastrar NF com dados incompletos
  teste('Cadastrar NF com dados incompletos deve falhar', function() {
    var resultado = UseCases.cadastrarNotaFiscal({ numero_nf: 'NF001' }, sessaoId);
    return { success: !resultado.success && resultado.erros && resultado.erros.length > 0 };
  });
  
  // Teste 3: Cadastrar NF válida
  teste('Cadastrar NF válida', function() {
    var nfTeste = Object.assign({}, TestData.notaFiscal);
    nfTeste.numero_nf = 'NF-TESTE-' + Date.now();
    
    var resultado = UseCases.cadastrarNotaFiscal(nfTeste, sessaoId);
    if (resultado.success) {
      notaFiscalId = resultado.id;
    }
    return resultado;
  });
  
  // Teste 4: Listar NFs
  teste('Listar notas fiscais', function() {
    var resultado = UseCases.listarNotasFiscais({}, sessaoId);
    return { success: resultado.success && resultado.data.length > 0 };
  });
  
  // Teste 5: Buscar NF por ID
  teste('Buscar NF por ID', function() {
    if (!notaFiscalId) return { success: false, error: 'NF não criada' };
    var resultado = UseCases.buscarNotaFiscal(notaFiscalId, sessaoId);
    return resultado;
  });
  
  // Teste 6: Filtrar NFs por status
  teste('Filtrar NFs por status PENDENTE', function() {
    var resultado = UseCases.listarNotasFiscais({ status: 'PENDENTE' }, sessaoId);
    return { success: resultado.success };
  });
  
  // Cleanup
  UseCases.logout(sessaoId);
  
  Logger.log('');
  Logger.log('Resultado UC02: ' + resultados.passou + '/' + (resultados.passou + resultados.falhou) + ' testes passaram');
  Logger.log('Nota Fiscal criada: ' + notaFiscalId);
  
  return { resultados: resultados, notaFiscalId: notaFiscalId };
}

// ============================================================================
// TESTES UC03 - REGISTRO DE ENTREGA
// ============================================================================

function testUC03_Entrega() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE UC03: Registro de Entrega');
  Logger.log('═══════════════════════════════════════════════');
  
  var resultados = { passou: 0, falhou: 0, testes: [] };
  var sessaoId = null;
  var notaFiscalId = null;
  var entregaId = null;
  
  function teste(nome, fn) {
    try {
      var resultado = fn();
      if (resultado.success) {
        resultados.passou++;
        Logger.log('✅ ' + nome);
      } else {
        resultados.falhou++;
        Logger.log('❌ ' + nome + ' - ' + (resultado.error || 'Falhou'));
      }
    } catch (e) {
      resultados.falhou++;
      Logger.log('❌ ' + nome + ' - ERRO: ' + e.message);
    }
  }
  
  // Setup: Login e criar NF
  teste('Setup: Login', function() {
    var resultado = UseCases.login(TestData.usuario.email, TestData.usuario.senha);
    if (resultado.success) sessaoId = resultado.sessao;
    return resultado;
  });
  
  teste('Setup: Criar NF para entrega', function() {
    var nfTeste = Object.assign({}, TestData.notaFiscal);
    nfTeste.numero_nf = 'NF-ENTREGA-' + Date.now();
    
    var resultado = UseCases.cadastrarNotaFiscal(nfTeste, sessaoId);
    if (resultado.success) notaFiscalId = resultado.id;
    return resultado;
  });
  
  // Teste 1: Registrar entrega sem NF
  teste('Registrar entrega sem NF deve falhar', function() {
    var resultado = UseCases.registrarEntrega({ unidade_escolar: 'Escola' }, sessaoId);
    return { success: !resultado.success };
  });
  
  // Teste 2: Registrar entrega válida
  teste('Registrar entrega válida', function() {
    if (!notaFiscalId) return { success: false, error: 'NF não criada' };
    
    var entregaDados = Object.assign({}, TestData.entrega);
    entregaDados.nota_fiscal_id = notaFiscalId;
    
    var resultado = UseCases.registrarEntrega(entregaDados, sessaoId);
    if (resultado.success) entregaId = resultado.id;
    return resultado;
  });
  
  // Teste 3: Verificar status da NF após entrega
  teste('Status da NF deve ser RECEBIDA após entrega', function() {
    if (!notaFiscalId) return { success: false };
    var resultado = UseCases.buscarNotaFiscal(notaFiscalId, sessaoId);
    return { success: resultado.success && resultado.data.status === 'RECEBIDA' };
  });
  
  // Teste 4: Listar entregas
  teste('Listar entregas', function() {
    var resultado = UseCases.listarEntregas({}, sessaoId);
    return { success: resultado.success && resultado.data.length > 0 };
  });
  
  // Teste 5: Filtrar entregas por NF
  teste('Filtrar entregas por nota fiscal', function() {
    var resultado = UseCases.listarEntregas({ nota_fiscal_id: notaFiscalId }, sessaoId);
    return { success: resultado.success };
  });
  
  UseCases.logout(sessaoId);
  
  Logger.log('');
  Logger.log('Resultado UC03: ' + resultados.passou + '/' + (resultados.passou + resultados.falhou) + ' testes passaram');
  
  return { resultados: resultados, notaFiscalId: notaFiscalId, entregaId: entregaId };
}

// ============================================================================
// TESTES UC04 - CONFERÊNCIA E ATESTO
// ============================================================================

function testUC04_Conferencia() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('TESTE UC04: Conferência e Atesto');
  Logger.log('═══════════════════════════════════════════════');
  
  var resultados = { passou: 0, falhou: 0, testes: [] };
  var sessaoId = null;
  var notaFiscalId = null;
  var conferenciaId = null;
  
  function teste(nome, fn) {
    try {
      var resultado = fn();
      if (resultado.success) {
        resultados.passou++;
        Logger.log('✅ ' + nome);
      } else {
        resultados.falhou++;
        Logger.log('❌ ' + nome + ' - ' + (resultado.error || 'Falhou'));
      }
    } catch (e) {
      resultados.falhou++;
      Logger.log('❌ ' + nome + ' - ERRO: ' + e.message);
    }
  }
  
  // Setup completo: Login, NF e Entrega
  teste('Setup: Login', function() {
    var resultado = UseCases.login(TestData.usuario.email, TestData.usuario.senha);
    if (resultado.success) sessaoId = resultado.sessao;
    return resultado;
  });
  
  teste('Setup: Criar NF', function() {
    var nfTeste = Object.assign({}, TestData.notaFiscal);
    nfTeste.numero_nf = 'NF-CONF-' + Date.now();
    
    var resultado = UseCases.cadastrarNotaFiscal(nfTeste, sessaoId);
    if (resultado.success) notaFiscalId = resultado.id;
    return resultado;
  });
  
  teste('Setup: Registrar entrega', function() {
    if (!notaFiscalId) return { success: false };
    
    var entregaDados = Object.assign({}, TestData.entrega);
    entregaDados.nota_fiscal_id = notaFiscalId;
    
    return UseCases.registrarEntrega(entregaDados, sessaoId);
  });
  
  // Teste 1: Iniciar conferência em NF não recebida deve falhar
  teste('Iniciar conferência em NF PENDENTE deve falhar', function() {
    // Criar NF sem entrega
    var nfPendente = Object.assign({}, TestData.notaFiscal);
    nfPendente.numero_nf = 'NF-PEND-' + Date.now();
    var res = UseCases.cadastrarNotaFiscal(nfPendente, sessaoId);
    
    if (!res.success) return { success: false };
    
    var resultado = UseCases.iniciarConferencia(res.id, sessaoId);
    return { success: !resultado.success };
  });
  
  // Teste 2: Iniciar conferência válida
  teste('Iniciar conferência em NF RECEBIDA', function() {
    if (!notaFiscalId) return { success: false };
    
    var resultado = UseCases.iniciarConferencia(notaFiscalId, sessaoId);
    if (resultado.success) conferenciaId = resultado.conferencia_id;
    return resultado;
  });
  
  // Teste 3: Verificar status da NF
  teste('Status da NF deve ser EM_CONFERENCIA', function() {
    if (!notaFiscalId) return { success: false };
    var resultado = UseCases.buscarNotaFiscal(notaFiscalId, sessaoId);
    return { success: resultado.success && resultado.data.status === 'EM_CONFERENCIA' };
  });
  
  // Teste 4: Registrar item conferido
  teste('Registrar item conferido', function() {
    if (!conferenciaId) return { success: false };
    
    return UseCases.registrarItemConferido({
      conferencia_id: conferenciaId,
      valor_item: 500,
      valor_glosa: 0
    }, sessaoId);
  });
  
  // Teste 5: Finalizar atesto
  teste('Finalizar atesto', function() {
    if (!conferenciaId) return { success: false };
    
    return UseCases.finalizarAtesto(conferenciaId, {
      parecer: 'Conferência realizada. Todos os itens em conformidade.'
    }, sessaoId);
  });
  
  // Teste 6: Verificar status final da NF
  teste('Status final da NF deve ser ATESTADA', function() {
    if (!notaFiscalId) return { success: false };
    var resultado = UseCases.buscarNotaFiscal(notaFiscalId, sessaoId);
    return { 
      success: resultado.success && 
               (resultado.data.status === 'ATESTADA' || resultado.data.status === 'ATESTADA_COM_GLOSA')
    };
  });
  
  // Teste 7: Listar conferências
  teste('Listar conferências', function() {
    var resultado = UseCases.listarConferencias({}, sessaoId);
    return { success: resultado.success && resultado.data.length > 0 };
  });
  
  UseCases.logout(sessaoId);
  
  Logger.log('');
  Logger.log('Resultado UC04: ' + resultados.passou + '/' + (resultados.passou + resultados.falhou) + ' testes passaram');
  
  return resultados;
}

// ============================================================================
// EXECUÇÃO COMPLETA DOS TESTES
// ============================================================================

/**
 * Executa todos os testes de casos de uso
 */
function runAllUseCaseTests() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     TESTES DOS CASOS DE USO - UNIAE CRE                          ║');
  Logger.log('║     Autenticação com Senha em Texto Plano                        ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var startTime = Date.now();
  var totalPassou = 0;
  var totalFalhou = 0;
  
  // UC01
  var uc01 = testUC01_Login();
  totalPassou += uc01.passou;
  totalFalhou += uc01.falhou;
  
  // UC02
  var uc02 = testUC02_NotaFiscal();
  totalPassou += uc02.resultados.passou;
  totalFalhou += uc02.resultados.falhou;
  
  // UC03
  var uc03 = testUC03_Entrega();
  totalPassou += uc03.resultados.passou;
  totalFalhou += uc03.resultados.falhou;
  
  // UC04
  var uc04 = testUC04_Conferencia();
  totalPassou += uc04.passou;
  totalFalhou += uc04.falhou;
  
  var duration = Date.now() - startTime;
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     RESULTADO FINAL DOS CASOS DE USO                             ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║ Total de testes: ' + (totalPassou + totalFalhou));
  Logger.log('║ ✅ Passou: ' + totalPassou);
  Logger.log('║ ❌ Falhou: ' + totalFalhou);
  Logger.log('║ 📊 Taxa de sucesso: ' + Math.round((totalPassou / (totalPassou + totalFalhou)) * 100) + '%');
  Logger.log('║ ⏱️ Tempo: ' + duration + 'ms');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  
  return {
    success: totalFalhou === 0,
    passou: totalPassou,
    falhou: totalFalhou,
    duration: duration
  };
}

// Log de carregamento
Logger.log('✅ Test_UseCases.gs carregado');
