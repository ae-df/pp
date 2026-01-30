/**
 * @fileoverview Setup de Usuários do DF
 * @version 4.0.0
 *
 * Dependências:
 * - Core_UI_Safe.gs (getSafeUi, safeAlert, safePrompt)
 * - Core_Constants.gs (constantes do sistema)
 */

'use strict';

// Usa funções de Core_UI_Safe.gs (getSafeUi, safeAlert, safePrompt)

/**
 * SETUP_USUARIOS_DF.gs
 * Configuração de usuários padrão para o sistema UNIAE no DF
 *
 * Cria estrutura de usuários por perfil:
 * - Administradores (SEEDF/DIAE/GPAE)
 * - Coordenadores (CREs)
 * - Nutricionistas
 * - Diretores de Escola
 * - Analistas
 *
 * @version 1.0.0
 * @created 2025-11-27
 */

// ============================================================================
// PERFIS DE USUÁRIO DO DF
// ============================================================================

var PERFIS_USUARIO_DF = {
  ADMIN_SEEDF: {
    codigo: 'ADMIN_SEEDF',
    nome: 'Administrador SEEDF',
    nivel: 'DISTRITAL',
    permissoes: [
      'VISUALIZAR_TUDO',
      'EDITAR_TUDO',
      'GERENCIAR_USUARIOS',
      'GERAR_RELATORIOS_GERENCIAIS',
      'CONFIGURAR_SISTEMA',
      'APROVAR_PROCESSOS'
    ],
    orgao: 'SEEDF/DIAE/GPAE'
  },

  COORDENADOR_CRE: {
    codigo: 'COORD_CRE',
    nome: 'Coordenador CRE',
    nivel: 'REGIONAL',
    permissoes: [
      'VISUALIZAR_CRE',
      'EDITAR_CRE',
      'GERAR_RELATORIOS_CRE',
      'SUPERVISIONAR_UNIDADES',
      'VALIDAR_PDGP'
    ],
    orgao: 'CRE'
  },

  NUTRICIONISTA: {
    codigo: 'NUTRICIONISTA',
    nome: 'Nutricionista',
    nivel: 'REGIONAL',
    permissoes: [
      'VISUALIZAR_CRE',
      'ELABORAR_CARDAPIOS',
      'SUPERVISIONAR_NUTRICAO',
      'VALIDAR_CARDAPIOS_ESPECIAIS',
      'REALIZAR_VISITAS_TECNICAS',
      'REGISTRAR_NAO_CONFORMIDADES'
    ],
    orgao: 'CRE',
    exige_crn: true
  },

  DIRETOR_ESCOLA: {
    codigo: 'DIRETOR',
    nome: 'Diretor de Escola',
    nivel: 'LOCAL',
    permissoes: [
      'VISUALIZAR_UNIDADE',
      'REGISTRAR_RECEBIMENTOS',
      'REGISTRAR_RECUSAS',
      'SOLICITAR_SUBSTITUICOES',
      'GERENCIAR_ESTOQUE_LOCAL',
      'ASSINAR_DOCUMENTOS'
    ],
    orgao: 'UNIDADE_ESCOLAR'
  },

  ANALISTA: {
    codigo: 'ANALISTA',
    nome: 'Analista',
    nivel: 'REGIONAL',
    permissoes: [
      'VISUALIZAR_CRE',
      'REGISTRAR_NOTAS_FISCAIS',
      'CONFERIR_DOCUMENTOS',
      'GERAR_RELATORIOS_OPERACIONAIS',
      'VALIDAR_ENTREGAS'
    ],
    orgao: 'CRE'
  },

  CONSULTA: {
    codigo: 'CONSULTA',
    nome: 'Consulta',
    nivel: 'TODOS',
    permissoes: [
      'VISUALIZAR_DADOS',
      'GERAR_RELATORIOS_BASICOS'
    ],
    orgao: 'QUALQUER'
  }
};

// ============================================================================
// USUÁRIOS PADRÃO PARA TESTES
// ============================================================================

var USUARIOS_PADRAO_DF = [
  {
    email: 'admin.seedf@se.df.gov.br',
    nome: 'Administrador SEEDF',
    senha: 'Admin@SEEDF2025',
    perfil: 'ADMIN',
    orgao: 'SEEDF/DIAE/GPAE',
    ativo: true,
    observacao: 'Usuário administrador principal'
  },
  {
    email: 'coord.crepp@se.df.gov.br',
    nome: 'Coordenador CRE Plano Piloto',
    senha: 'Coord@CREPP2025',
    perfil: 'GESTOR',
    cre: 'CRE-PP',
    orgao: 'CRE Plano Piloto',
    ativo: true
  },
  {
    email: 'nutricionista.crepp@se.df.gov.br',
    nome: 'Nutricionista CRE PP',
    senha: 'Nutri@CREPP2025',
    perfil: 'NUTRICIONISTA',
    cre: 'CRE-PP',
    crn: '12345/DF',
    orgao: 'CRE Plano Piloto',
    ativo: true
  },
  {
    email: 'diretor.ec308sul@se.df.gov.br',
    nome: 'Diretor EC 308 Sul',
    senha: 'Diretor@EC308',
    perfil: 'REPRESENTANTE',
    cre: 'CRE-PP',
    unidade: 'EC 308 Sul',
    orgao: 'EC 308 Sul',
    ativo: true
  },
  {
    email: 'analista.crepp@se.df.gov.br',
    nome: 'Analista CRE PP',
    senha: 'Analista@CREPP2025',
    perfil: 'ANALISTA',
    cre: 'CRE-PP',
    orgao: 'CRE Plano Piloto',
    ativo: true
  },
  {
    email: 'consulta@se.df.gov.br',
    nome: 'Usuário Consulta',
    senha: 'Consulta@2025',
    perfil: 'ANALISTA', // Perfil de consulta mapeado para ANALISTA (leitura)
    orgao: 'SEEDF',
    ativo: true
  }
];

// ============================================================================
// FUNÇÕES DE SETUP
// ============================================================================

/**
 * Cria usuários padrão do DF
 */
function criarUsuariosPadraoDF(forcarCriacao) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Usuarios');

    if (!sheet) {
      Logger.log('❌ Aba Usuarios não encontrada');
      return {
        sucesso: false,
        erro: 'Aba Usuarios não encontrada'
      };
    }

    // Verificar se já existem usuários
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && !forcarCriacao) {
      Logger.log('⚠️ Já existem usuários cadastrados');

      // Tentar usar UI apenas se disponível
      try {
        var ui = SpreadsheetApp.getUi();
        var resposta = ui.alert(
          'Usuários Existentes',
          'Já existem usuários cadastrados. Deseja adicionar os usuários padrão do DF mesmo assim?\n\n' +
          'Isso NÃO irá sobrescrever usuários existentes.',
          ui.ButtonSet.YES_NO
        );

        if (resposta !== ui.Button.YES) {
          return {
            sucesso: false,
            mensagem: 'Operação cancelada pelo usuário'
          };
        }
      } catch (e) {
        // UI não disponível, continuar automaticamente
        Logger.log('⚠️ UI não disponível, continuando automaticamente...');
      }
    }

    // Obter emails já cadastrados
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    // Usa 'email' conforme USUARIOS_SCHEMA (minúsculo)
    var emailIdx = headers.indexOf('email');
    var emailsExistentes = {};

    for (var i = 1; i < data.length; i++) {
      if (emailIdx >= 0 && data[i][emailIdx]) {
        emailsExistentes[data[i][emailIdx].toLowerCase()] = true;
      }
    }

    // Criar usuários
    var usuariosCriados = 0;
    var usuariosIgnorados = 0;

    USUARIOS_PADRAO_DF.forEach(function(usuario) {
      if (emailsExistentes[usuario.email.toLowerCase()]) {
        Logger.log('⚠️ Usuário já existe: ' + usuario.email);
        usuariosIgnorados++;
        return;
      }

      // Arquitetura 100% digital: senha em texto plano
      var senhaTextoPlano = usuario.senha; // Texto plano - não usar hash

      // Criar linha conforme USUARIOS_SCHEMA
      // Headers: email, nome, senha, tipo, instituicao, telefone, cpf, cnpj, ativo, dataCriacao, dataAtualizacao, ultimoAcesso, token
      var novaLinha = [
        usuario.email,                           // email
        usuario.nome,                            // nome
        senhaTextoPlano,                         // senha (texto plano)
        usuario.perfil,                          // tipo (usar perfil como tipo)
        usuario.orgao,                           // instituicao
        '',                                      // telefone
        '',                                      // cpf
        '',                                      // cnpj
        usuario.ativo ? 'ATIVO' : 'INATIVO',    // ativo
        new Date(),                              // dataCriacao
        '',                                      // dataAtualizacao
        '',                                      // ultimoAcesso
        ''                                       // token
      ];

      sheet.appendRow(novaLinha);
      usuariosCriados++;
      Logger.log('✅ Usuário criado: ' + usuario.email);
    });

    // Formatar cabeçalho
    sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff');

    Logger.log('✅ Setup de usuários concluído');
    Logger.log('   - Usuários criados: ' + usuariosCriados);
    Logger.log('   - Usuários ignorados (já existentes): ' + usuariosIgnorados);

    // Mostrar resumo (apenas se UI disponível)
    try {
      var ui = SpreadsheetApp.getUi();
      ui.alert(
        '✅ Usuários Padrão Criados',
        'Setup de usuários do DF concluído!\n\n' +
        '✅ Usuários criados: ' + usuariosCriados + '\n' +
        '⚠️ Usuários ignorados: ' + usuariosIgnorados + '\n\n' +
        'CREDENCIAIS DE TESTE:\n\n' +
        '📧 Admin: admin.seedf@se.df.gov.br\n' +
        '🔑 Senha: Admin@SEEDF2025\n\n' +
        '📧 Analista: analista.crepp@se.df.gov.br\n' +
        '🔑 Senha: Analista@CREPP2025\n\n' +
        '⚠️ IMPORTANTE: Altere as senhas após o primeiro acesso!',
        ui.ButtonSet.OK
      );
    } catch (e) {
      // UI não disponível, apenas log
      Logger.log('📧 CREDENCIAIS CRIADAS:');
      Logger.log('   Admin: admin.seedf@se.df.gov.br / Admin@SEEDF2025');
      Logger.log('   Analista: analista.crepp@se.df.gov.br / Analista@CREPP2025');
    }

    return {
      sucesso: true,
      usuariosCriados: usuariosCriados,
      usuariosIgnorados: usuariosIgnorados,
      credenciais: {
        admin: { email: 'admin.seedf@se.df.gov.br', senha: 'Admin@SEEDF2025' },
        analista: { email: 'analista.crepp@se.df.gov.br', senha: 'Analista@CREPP2025' }
      }
    };

  } catch (e) {
    Logger.log('❌ Erro ao criar usuários: ' + e.message);
    return {
      sucesso: false,
      erro: e.message
    };
  }
}

/**
 * Lista todos os usuários cadastrados
 */
function listarUsuariosDF() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Usuarios');

    if (!sheet || sheet.getLastRow() <= 1) {
      Logger.log('⚠️ Nenhum usuário cadastrado');
      return [];
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var usuarios = [];

    for (var i = 1; i < data.length; i++) {
      var usuario = {};
      headers.forEach(function(header, idx) {
        usuario[header] = data[i][idx];
      });
      usuarios.push(usuario);
    }

    return usuarios;

  } catch (e) {
    Logger.log('❌ Erro ao listar usuários: ' + e.message);
    return [];
  }
}

/**
 * Exibe relatório de usuários
 */
function exibirRelatorioUsuariosDF() {
  try {
    var usuarios = listarUsuariosDF();

    if (usuarios.length === 0) {
      Logger.log('⚠️ Nenhum usuário cadastrado');
      try {
        var ui = SpreadsheetApp.getUi();
        ui.alert(
          'Usuários',
          'Nenhum usuário cadastrado no sistema.',
          ui.ButtonSet.OK
        );
      } catch (e) {
        // UI não disponível
      }
      return;
    }

    // Agrupar por perfil
    var porPerfil = {};
    var ativos = 0;
    var inativos = 0;

    usuarios.forEach(function(usuario) {
      // Suportar diferentes formatos de propriedades
      var perfil = usuario.Perfil || usuario.perfil || usuario.tipo || 'SEM_PERFIL';
      var ativo = usuario.Ativo || usuario.ativo || 'INATIVO';

      if (!porPerfil[perfil]) {
        porPerfil[perfil] = [];
      }
      porPerfil[perfil].push(usuario);

      // Suporta ambos formatos: SIM/NAO e ATIVO/INATIVO
      if (ativo === 'SIM' || ativo === 'ATIVO') {
        ativos++;
      } else {
        inativos++;
      }
    });

    // Montar mensagem
    var mensagem = 'USUÁRIOS CADASTRADOS NO SISTEMA\n\n';
    mensagem += '═══════════════════════════════════════\n';
    mensagem += 'Total: ' + usuarios.length + ' usuários\n';
    mensagem += 'Ativos: ' + ativos + '\n';
    mensagem += 'Inativos: ' + inativos + '\n';
    mensagem += '═══════════════════════════════════════\n\n';

    // Listar por perfil
    for (var perfil in porPerfil) {
      var perfilInfo = PERFIS_USUARIO_DF[perfil];
      var nomePerfil = perfilInfo ? perfilInfo.nome : perfil;

      mensagem += '📋 ' + nomePerfil + ' (' + porPerfil[perfil].length + ')\n';

      porPerfil[perfil].forEach(function(usuario) {
        // Suportar diferentes formatos de propriedades (com ou sem underscore)
        var nome = usuario.Nome || usuario.nome || 'Nome não informado';
        var email = usuario.Email || usuario.email || 'Email não informado';
        var ativo = usuario.Ativo || usuario.ativo || 'INATIVO';
        var cre = usuario.CRE || usuario.cre;
        var unidade = usuario.Unidade_Escolar || usuario.unidade_escolar || usuario.instituicao;

        // Suporta ambos formatos: SIM/NAO e ATIVO/INATIVO
        var status = (ativo === 'SIM' || ativo === 'ATIVO') ? '✅' : '❌';
        mensagem += '   ' + status + ' ' + nome + '\n';
        mensagem += '      📧 ' + email + '\n';
        if (cre) {
          mensagem += '      🏢 ' + cre + '\n';
        }
        if (unidade) {
          mensagem += '      🏫 ' + unidade + '\n';
        }
      });

      mensagem += '\n';
    }

    // Exibir em HTML para melhor formatação (se UI disponível)
    try {
      var html = HtmlService.createHtmlOutput(
        '<pre style="font-family: monospace; font-size: 12px;">' +
        mensagem +
        '</pre>'
      )
      .setWidth(600)
      .setHeight(500);

      SpreadsheetApp.getUi().showModalDialog(html, '👥 Usuários do Sistema');
    } catch (e) {
      // UI não disponível, apenas log
      Logger.log(mensagem);
    }

  } catch (e) {
    Logger.log('❌ Erro ao exibir relatório: ' + e.message);
    try {
      var ui = SpreadsheetApp.getUi();
      ui.alert(
        'Erro',
        'Erro ao gerar relatório de usuários: ' + e.message,
        ui.ButtonSet.OK
      );
    } catch (uiError) {
      // UI não disponível
    }
  }
}

/**
 * Reseta senha de um usuário
 */
function resetarSenhaUsuario(email, novaSenha) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Usuarios');

    if (!sheet) {
      throw new Error('Aba Usuarios não encontrada');
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    // Usa headers conforme USUARIOS_SCHEMA (minúsculas)
    var emailIdx = headers.indexOf('email');
    var senhaIdx = headers.indexOf('senha');

    if (emailIdx === -1 || senhaIdx === -1) {
      throw new Error('Colunas necessárias não encontradas. Esperado: email, senha');
    }

    for (var i = 1; i < data.length; i++) {
      if (data[i][emailIdx].toLowerCase() === email.toLowerCase()) {
        // Arquitetura 100% digital: senha em texto plano
        sheet.getRange(i + 1, senhaIdx + 1).setValue(novaSenha);

        Logger.log('✅ Senha resetada para: ' + email);
        return {
          sucesso: true,
          mensagem: 'Senha resetada com sucesso'
        };
      }
    }

    throw new Error('Usuário não encontrado: ' + email);

  } catch (e) {
    Logger.log('❌ Erro ao resetar senha: ' + e.message);
    return {
      sucesso: false,
      erro: e.message
    };
  }
}

/**
 * Adiciona usuário ao menu
 */
function adicionarMenuUsuarios() {
  try {
    var ui = SpreadsheetApp.getUi();

    ui.createMenu('👥 Usuários')
      .addItem('➕ Criar Usuários Padrão DF', 'criarUsuariosPadraoDF')
      .addItem('📋 Listar Usuários', 'exibirRelatorioUsuariosDF')
      .addSeparator()
      .addItem('🔑 Resetar Senha', 'menuResetarSenha')
      .addToUi();

    Logger.log('✅ Menu de usuários adicionado');
  } catch (e) {
    Logger.log('⚠️ Não foi possível adicionar menu (UI não disponível): ' + e.message);
  }
}

/**
 * Menu para resetar senha
 */
function menuResetarSenha() {
  var ui = SpreadsheetApp.getUi();

  var resposta = ui.prompt(
    'Resetar Senha',
    'Digite o email do usuário:',
    ui.ButtonSet.OK_CANCEL
  );

  if (resposta.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  var email = resposta.getResponseText().trim();

  if (!email) {
    ui.alert('Erro', 'Email não pode ser vazio', ui.ButtonSet.OK);
    return;
  }

  var respostaSenha = ui.prompt(
    'Resetar Senha',
    'Digite a nova senha para ' + email + ':',
    ui.ButtonSet.OK_CANCEL
  );

  if (respostaSenha.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  var novaSenha = respostaSenha.getResponseText().trim();

  if (!novaSenha || novaSenha.length < 8) {
    ui.alert('Erro', 'Senha deve ter no mínimo 8 caracteres', ui.ButtonSet.OK);
    return;
  }

  var resultado = resetarSenhaUsuario(email, novaSenha);

  if (resultado.sucesso) {
    ui.alert('Sucesso', 'Senha resetada com sucesso!', ui.ButtonSet.OK);
  } else {
    ui.alert('Erro', 'Erro ao resetar senha: ' + resultado.erro, ui.ButtonSet.OK);
  }
}

// ============================================================================
// DOCUMENTAÇÃO DE CREDENCIAIS
// ============================================================================

/**
 * Gera documento com credenciais padrão
 */
function gerarDocumentoCredenciais() {
  var doc = '# CREDENCIAIS PADRÃO - SISTEMA UNIAE DF\n\n';
  doc += '**Data de Geração:** ' + new Date().toLocaleString('pt-BR') + '\n\n';
  doc += '⚠️ **IMPORTANTE:** Altere todas as senhas após o primeiro acesso!\n\n';
  doc += '---\n\n';

  USUARIOS_PADRAO_DF.forEach(function(usuario) {
    doc += '## ' + usuario.nome + '\n\n';
    doc += '- **Email:** `' + usuario.email + '`\n';
    doc += '- **Senha:** `' + usuario.senha + '`\n';
    doc += '- **Perfil:** ' + usuario.perfil + '\n';
    doc += '- **Órgão:** ' + usuario.orgao + '\n';
    if (usuario.cre) {
      doc += '- **CRE:** ' + usuario.cre + '\n';
    }
    if (usuario.unidade) {
      doc += '- **Unidade:** ' + usuario.unidade + '\n';
    }
    doc += '\n';
  });

  doc += '---\n\n';
  doc += '## Perfis e Permissões\n\n';

  for (var perfil in PERFIS_USUARIO_DF) {
    var info = PERFIS_USUARIO_DF[perfil];
    doc += '### ' + info.nome + '\n\n';
    doc += '- **Nível:** ' + info.nivel + '\n';
    doc += '- **Órgão:** ' + info.orgao + '\n';
    doc += '- **Permissões:**\n';
    info.permissoes.forEach(function(perm) {
      doc += '  - ' + perm + '\n';
    });
    doc += '\n';
  }

  Logger.log(doc);
  return doc;
}

/**
 * Registra setup de usuários
 */
function registrarSetupUsuariosDF() {
  Logger.log('✅ Setup de usuários DF carregado');
  Logger.log('   - ' + USUARIOS_PADRAO_DF.length + ' usuários padrão definidos');
  Logger.log('   - ' + Object.keys(PERFIS_USUARIO_DF).length + ' perfis configurados');
}

// ============================================================================
// FUNÇÃO SIMPLIFICADA PARA EXECUÇÃO DIRETA
// ============================================================================

/**
 * Cria usuários padrão de forma simplificada (sem UI)
 * Use esta função para executar via script ou trigger
 */
function criarUsuariosPadraoDF_Simples() {
  Logger.log('🚀 Iniciando criação de usuários padrão do DF...');

  var resultado = criarUsuariosPadraoDF(true); // força criação

  if (resultado.sucesso) {
    Logger.log('✅ SUCESSO!');
    Logger.log('   Usuários criados: ' + resultado.usuariosCriados);
    Logger.log('   Usuários ignorados: ' + resultado.usuariosIgnorados);
    Logger.log('');
    Logger.log('📧 CREDENCIAIS DE ACESSO:');
    Logger.log('');
    Logger.log('1️⃣ ADMINISTRADOR SEEDF');
    Logger.log('   Email: admin.seedf@se.df.gov.br');
    Logger.log('   Senha: Admin@SEEDF2025');
    Logger.log('');
    Logger.log('2️⃣ ANALISTA CRE PP (RECOMENDADO PARA TESTES)');
    Logger.log('   Email: analista.crepp@se.df.gov.br');
    Logger.log('   Senha: Analista@CREPP2025');
    Logger.log('');
    Logger.log('3️⃣ NUTRICIONISTA CRE PP');
    Logger.log('   Email: nutricionista.crepp@se.df.gov.br');
    Logger.log('   Senha: Nutri@CREPP2025');
    Logger.log('');
    Logger.log('4️⃣ DIRETOR EC 308 SUL');
    Logger.log('   Email: diretor.ec308sul@se.df.gov.br');
    Logger.log('   Senha: Diretor@EC308');
    Logger.log('');
    Logger.log('5️⃣ COORDENADOR CRE PP');
    Logger.log('   Email: coord.crepp@se.df.gov.br');
    Logger.log('   Senha: Coord@CREPP2025');
    Logger.log('');
    Logger.log('6️⃣ CONSULTA');
    Logger.log('   Email: consulta@se.df.gov.br');
    Logger.log('   Senha: Consulta@2025');
    Logger.log('');
    Logger.log('⚠️ IMPORTANTE: Altere as senhas após o primeiro acesso!');
  } else {
    Logger.log('❌ ERRO: ' + resultado.erro);
  }

  return resultado;
}

/**
 * Testa login com usuário padrão
 * ATENÇÃO: Configure as credenciais via PropertiesService antes de executar
 */
function testarLoginUsuarioPadrao() {
  Logger.log('🧪 Testando login com usuário analista...');

  try {
    // Credenciais devem ser configuradas via PropertiesService
    var props = PropertiesService.getScriptProperties();
    var email = props.getProperty('ANALISTA_EMAIL');
    var senha = props.getProperty('ANALISTA_PASSWORD');

    if (!email || !senha) {
      Logger.log('⚠️ Configure ANALISTA_EMAIL e ANALISTA_PASSWORD nas propriedades do script');
      Logger.log('   Acesse: Projeto > Configurações > Propriedades do script');
      return;
    }

    Logger.log('📧 Email configurado: ' + email);
    Logger.log('🔑 Senha: [PROTEGIDA]');

    // Se você tiver uma função de autenticação, chame aqui
    // var resultado = autenticarUsuario(email, senha);

    Logger.log('✅ Credenciais carregadas das propriedades do script');

  } catch (e) {
    Logger.log('❌ Erro no teste: ' + e.message);
  }
}
