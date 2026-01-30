/**
 * @fileoverview Testes do Sistema de Autenticação
 * @version 5.0.0
 * 
 * Dependências:
 * - Core_UI_Safe.gs (getSafeUi, safeAlert, safePrompt)
 * - Core_Auth_Unified.gs (AuthService, AUTH)
 */

'use strict';

// Helper para obter o serviço de autenticação
function _testGetAuth() {
  if (typeof AuthService !== 'undefined') return AuthService;
  if (typeof AUTH !== 'undefined') return AUTH;
  return null;
}


/**
 * Testa o sistema de autenticação completo
 */
function testarSistemaAutenticacao() {
  try {
    Logger.log('=== INICIANDO TESTES DO SISTEMA DE AUTENTICAÇÃO ===\n');
    
    var resultados = {
      total: 0,
      sucesso: 0,
      falha: 0,
      testes: []
    };
    
    // Teste 1: Verificar estrutura da aba Usuarios
    testar('Verificar estrutura da aba Usuarios', function() {
      var result = verificarEstruturaUsuarios();
      if (!result || !result.success) throw new Error('Estrutura incorreta');
      if (!result.correto) throw new Error('Headers incorretos');
      return true;
    }, resultados);
  
  // Teste 2: Cadastrar Analista UNIAE
  testar('Cadastrar Analista UNIAE', function() {
    var userData = {
      tipo: 'ANALISTA',
      nome: 'Teste Analista',
      email: 'teste.analista@uniae.edu.br',
      senha: 'senha123',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321'
    };
    
    var result = api_auth_register(userData);
    if (!result.success) throw new Error(result.error);
    return true;
  }, resultados);
  
  // Teste 3: Cadastrar Representante Escolar
  testar('Cadastrar Representante Escolar', function() {
    var userData = {
      tipo: 'REPRESENTANTE',
      nome: 'Teste Representante',
      email: 'teste.representante@escola.com',
      senha: 'senha456',
      instituicao: 'Escola Teste ABC',
      cpf: '987.654.321-00',
      telefone: '(11) 91234-5678'
    };
    
    var result = api_auth_register(userData);
    if (!result.success) throw new Error(result.error);
    return true;
  }, resultados);
  
  // Teste 4: Cadastrar Fornecedor
  testar('Cadastrar Fornecedor', function() {
    var userData = {
      tipo: 'FORNECEDOR',
      nome: 'Teste Fornecedor',
      email: 'teste.fornecedor@empresa.com',
      senha: 'senha789',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 3456-7890'
    };
    
    var result = api_auth_register(userData);
    if (!result.success) throw new Error(result.error);
    return true;
  }, resultados);
  
  // Teste 5: Login com Analista
  testar('Login com Analista', function() {
    var result = api_auth_login('teste.analista@uniae.edu.br', 'senha123');
    if (!result.success) throw new Error(result.error);
    if (!result.session) throw new Error('Sessão não criada');
    if (result.session.tipo !== 'Analista UNIAE') throw new Error('Tipo incorreto: ' + result.session.tipo);
    return true;
  }, resultados);
  
  // Teste 6: Verificar permissões do Analista
  testar('Verificar permissões do Analista', function() {
    var auth = _testGetAuth();
    if (!auth) throw new Error('AuthService não disponível');
    
    var session = auth.getSession();
    if (!session) throw new Error('Sessão não encontrada');
    
    // Analista deve ter permissão total (admin)
    if (!auth.hasPermission(session, 'read', 'Notas_Fiscais')) {
      throw new Error('Permissão de leitura negada');
    }
    
    if (!auth.hasPermission(session, 'write', 'Notas_Fiscais')) {
      throw new Error('Permissão de escrita negada');
    }
    
    if (!auth.hasPermission(session, 'delete', 'Notas_Fiscais')) {
      throw new Error('Permissão de exclusão negada');
    }
    
    if (!session.admin) {
      throw new Error('Permissão de admin negada');
    }
    
    return true;
  }, resultados);
  
  // Teste 7: Logout
  testar('Logout', function() {
    var auth = _testGetAuth();
    var result = api_auth_logout();
    if (!result.success) throw new Error(result.error);
    
    var session = auth ? auth.getSession() : null;
    if (session) throw new Error('Sessão ainda existe após logout');
    
    return true;
  }, resultados);
  
  // Teste 8: Login com Representante
  testar('Login com Representante', function() {
    var result = api_auth_login('teste.representante@escola.com', 'senha456');
    if (!result.success) throw new Error(result.error);
    if (result.session.tipo !== 'Representante Escola') throw new Error('Tipo incorreto: ' + result.session.tipo);
    return true;
  }, resultados);
  
  // Teste 9: Verificar permissões do Representante
  testar('Verificar permissões do Representante', function() {
    var auth = _testGetAuth();
    if (!auth) throw new Error('AuthService não disponível');
    
    var session = auth.getSession();
    if (!session) throw new Error('Sessão não encontrada');
    
    // Representante tem permissões limitadas
    if (!auth.hasPermission(session, 'visualizar_notas')) {
      throw new Error('Permissão de visualização negada');
    }
    
    if (!auth.hasPermission(session, 'registrar_recusas')) {
      throw new Error('Permissão de registrar recusas negada');
    }
    
    // Não deve ter admin
    if (session.admin) {
      throw new Error('Permissão de admin deveria ser negada');
    }
    
    return true;
  }, resultados);
  
  // Teste 10: Logout
  testar('Logout do Representante', function() {
    var result = api_auth_logout();
    if (!result.success) throw new Error(result.error);
    return true;
  }, resultados);
  
  // Teste 11: Login com Fornecedor
  testar('Login com Fornecedor', function() {
    var result = api_auth_login('teste.fornecedor@empresa.com', 'senha789');
    if (!result.success) throw new Error(result.error);
    if (result.session.tipo !== 'Fornecedor') throw new Error('Tipo incorreto: ' + result.session.tipo);
    return true;
  }, resultados);
  
  // Teste 12: Verificar permissões do Fornecedor
  testar('Verificar permissões do Fornecedor', function() {
    var auth = _testGetAuth();
    if (!auth) throw new Error('AuthService não disponível');
    
    var session = auth.getSession();
    if (!session) throw new Error('Sessão não encontrada');
    
    // Fornecedor tem permissões específicas
    if (!auth.hasPermission(session, 'cadastrar_notas')) {
      throw new Error('Permissão de cadastrar notas negada');
    }
    
    // Não deve ter admin
    if (session.admin) {
      throw new Error('Permissão de admin deveria ser negada');
    }
    
    return true;
  }, resultados);
  
  // Teste 13: Tentar cadastrar email duplicado
  testar('Rejeitar email duplicado', function() {
    var userData = {
      tipo: 'FORNECEDOR',
      nome: 'Teste Duplicado',
      email: 'teste.fornecedor@empresa.com', // Email já existe
      senha: 'senha999',
      cnpj: '99.999.999/0001-99'
    };
    
    var result = api_auth_register(userData);
    if (result.success) throw new Error('Deveria rejeitar email duplicado');
    return true;
  }, resultados);
  
  // Teste 14: Tentar login com senha incorreta
  testar('Rejeitar senha incorreta', function() {
    var result = api_auth_login('teste.analista@uniae.edu.br', 'senhaErrada');
    if (result.success) throw new Error('Deveria rejeitar senha incorreta');
    return true;
  }, resultados);
  
  // Teste 15: Tentar cadastrar com senha curta
  testar('Rejeitar senha curta', function() {
    var userData = {
      tipo: 'ANALISTA',
      nome: 'Teste Senha Curta',
      email: 'teste.senha@uniae.edu.br',
      senha: '123', // Senha muito curta
      cpf: '111.222.333-44'
    };
    
    var result = api_auth_register(userData);
    if (result.success) throw new Error('Deveria rejeitar senha curta');
    return true;
  }, resultados);
  
  // Teste 16: Alterar senha
  testar('Alterar senha', function() {
    // Login primeiro
    api_auth_login('teste.analista@uniae.edu.br', 'senha123');
    
    var result = api_auth_changePassword('senha123', 'novaSenha123');
    if (!result.success) throw new Error(result.error);
    
    // Logout
    api_auth_logout();
    
    // Tenta login com senha antiga (deve falhar)
    var loginAntigo = api_auth_login('teste.analista@uniae.edu.br', 'senha123');
    if (loginAntigo.success) throw new Error('Login com senha antiga deveria falhar');
    
    // Tenta login com senha nova (deve funcionar)
    var loginNovo = api_auth_login('teste.analista@uniae.edu.br', 'novaSenha123');
    if (!loginNovo.success) throw new Error('Login com senha nova deveria funcionar');
    
    return true;
  }, resultados);
  
    // Limpar dados de teste
    Logger.log('\n=== LIMPANDO DADOS DE TESTE ===');
    limparDadosTeste();
    
    // Exibir resultados
    Logger.log('\n=== RESULTADOS DOS TESTES ===');
    Logger.log('Total de testes: ' + resultados.total);
    Logger.log('Sucessos: ' + resultados.sucesso + ' ✓');
    Logger.log('Falhas: ' + resultados.falha + ' ✗');
    Logger.log('Taxa de sucesso: ' + Math.round((resultados.sucesso / resultados.total) * 100) + '%');
    
    Logger.log('\n=== DETALHES DOS TESTES ===');
    resultados.testes.forEach(function(teste) {
      var status = teste.sucesso ? '✓' : '✗';
      Logger.log(status + ' ' + teste.nome);
      if (!teste.sucesso) {
        Logger.log('  Erro: ' + teste.erro);
      }
    });
    
    // Exibir alerta
    // Exibir alerta
    var ui = getSafeUi();
    if (ui) {
      try {
        var mensagem = 'Total: ' + resultados.total + '\n';
        mensagem += 'Sucessos: ' + resultados.sucesso + ' ✓\n';
        mensagem += 'Falhas: ' + resultados.falha + ' ✗\n';
        mensagem += 'Taxa: ' + Math.round((resultados.sucesso / resultados.total) * 100) + '%';
        
        if (resultados.falha === 0) {
          ui.alert('✅ Todos os Testes Passaram!', mensagem, ui.ButtonSet.OK);
        } else {
          ui.alert('⚠️ Alguns Testes Falharam', mensagem, ui.ButtonSet.OK);
        }
      } catch (e) {
        Logger.log('Não foi possível exibir alerta de UI: ' + e.message);
      }
    } else {
      Logger.log('UI não disponível. Resultados finais nos logs acima.');
    }
    
    return resultados;
    
  } catch (e) {
    Logger.log('❌ ERRO CRÍTICO NOS TESTES: ' + e.message);
    Logger.log('Stack: ' + e.stack);
    
    var ui = getSafeUi();
    if (ui) {
      try {
        ui.alert(
          '❌ Erro nos Testes',
          'Erro crítico ao executar testes:\n\n' + e.message + '\n\nVerifique os logs para mais detalhes.',
          ui.ButtonSet.OK
        );
      } catch (uiError) {
        Logger.log('Não foi possível exibir alerta de erro na UI: ' + uiError.message);
      }
    }
    
    return {
      success: false,
      error: e.message,
      stack: e.stack
    };
  }
}

/**
 * Função auxiliar para executar teste
 */
function testar(nome, fn, resultados) {
  if (!resultados) {
    throw new Error('⚠️ Esta função é auxiliar e não deve ser executada diretamente. Por favor, execute a função "testarSistemaAutenticacao".');
  }
  resultados.total++;
  
  try {
    Logger.log('Testando: ' + nome + '...');
    fn();
    resultados.sucesso++;
    resultados.testes.push({ nome: nome, sucesso: true });
    Logger.log('✓ ' + nome + ' - PASSOU\n');
  } catch (e) {
    resultados.falha++;
    resultados.testes.push({ nome: nome, sucesso: false, erro: e.message });
    Logger.log('✗ ' + nome + ' - FALHOU');
    Logger.log('  Erro: ' + e.message + '\n');
  }
}

/**
 * Limpa dados de teste (versão Auth)
 */
function limparDadosTeste_Auth() {
  try {
    var sheet = getSheet('Usuarios');
    var data = sheet.getDataRange().getValues();
    
    var emailsTeste = [
      'teste.analista@uniae.edu.br',
      'teste.representante@escola.com',
      'teste.fornecedor@empresa.com',
      'teste.senha@uniae.edu.br'
    ];
    
    // Remove de trás para frente para não afetar índices
    for (var i = data.length - 1; i >= 1; i--) {
      if (emailsTeste.indexOf(data[i][0]) !== -1) {
        sheet.deleteRow(i + 1);
        Logger.log('Removido: ' + data[i][0]);
      }
    }
    
    Logger.log('✓ Dados de teste removidos');
  } catch (e) {
    Logger.log('⚠️ Erro ao limpar dados de teste: ' + e.message);
  }
}

/**
 * Teste rápido de cadastro
 */
function testeRapidoCadastro() {
  Logger.log('=== TESTE RÁPIDO DE CADASTRO ===\n');
  
  // Teste Analista
  Logger.log('1. Testando cadastro de Analista...');
  var analista = {
    tipo: 'ANALISTA',
    nome: 'João Silva',
    email: 'joao.teste@uniae.edu.br',
    senha: 'senha123',
    cpf: '123.456.789-00'
  };
  var result1 = api_auth_register(analista);
  Logger.log(result1.success ? '✓ Analista cadastrado' : '✗ Erro: ' + result1.error);
  
  // Teste Representante
  Logger.log('\n2. Testando cadastro de Representante...');
  var representante = {
    tipo: 'REPRESENTANTE',
    nome: 'Maria Santos',
    email: 'maria.teste@escola.com',
    senha: 'senha456',
    instituicao: 'Escola ABC',
    cpf: '987.654.321-00'
  };
  var result2 = api_auth_register(representante);
  Logger.log(result2.success ? '✓ Representante cadastrado' : '✗ Erro: ' + result2.error);
  
  // Teste Fornecedor
  Logger.log('\n3. Testando cadastro de Fornecedor...');
  var fornecedor = {
    tipo: 'FORNECEDOR',
    nome: 'Pedro Oliveira',
    email: 'pedro.teste@fornecedor.com',
    senha: 'senha789',
    cnpj: '12.345.678/0001-90'
  };
  var result3 = api_auth_register(fornecedor);
  Logger.log(result3.success ? '✓ Fornecedor cadastrado' : '✗ Erro: ' + result3.error);
  
  Logger.log('\n=== TESTE CONCLUÍDO ===');
}

/**
 * Teste de login
 */
function testeLogin() {
  Logger.log('=== TESTE DE LOGIN ===\n');
  
  // ATENÇÃO: Em produção, use PropertiesService para credenciais de teste
  var props = PropertiesService.getScriptProperties();
  var email = props.getProperty('TEST_USER_EMAIL') || 'teste@uniae.edu.br';
  var senha = props.getProperty('TEST_USER_PASSWORD') || 'CONFIGURE_VIA_PROPERTIES';
  
  if (senha === 'CONFIGURE_VIA_PROPERTIES') {
    Logger.log('⚠️ Configure TEST_USER_EMAIL e TEST_USER_PASSWORD nas propriedades do script');
    return;
  }
  
  // Garante que o usuário existe
  var user = AUTH.findUserByEmail(email);
  if (!user) {
    Logger.log('Usuário de teste não encontrado. Criando...');
    var analista = {
      tipo: 'ANALISTA',
      nome: 'Usuário Teste',
      email: email,
      senha: senha,
      cpf: '000.000.000-00'
    };
    var regResult = api_auth_register(analista);
    if (!regResult.success) {
      Logger.log('✗ Erro ao criar usuário de teste: ' + regResult.error);
      return;
    }
    Logger.log('✓ Usuário de teste criado com sucesso.');
  }
  
  var result = api_auth_login(email, senha);
  
  if (result.success) {
    Logger.log('✓ Login bem-sucedido!');
    Logger.log('Nome: ' + result.session.nome);
    Logger.log('Tipo: ' + result.session.tipo);
    Logger.log('Email: ' + result.session.email);
    Logger.log('Admin: ' + result.session.permissions.admin);
  } else {
    Logger.log('✗ Erro no login: ' + result.error);
  }
}
