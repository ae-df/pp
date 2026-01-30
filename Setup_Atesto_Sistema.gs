/**
 * @fileoverview Setup do Sistema de Atesto de Gêneros Alimentícios
 * @version 3.0.0
 *
 * PROPÓSITO:
 * Inicializar todas as estruturas necessárias para o sistema de conferência
 * e atesto de notas fiscais de gêneros alimentícios - UNIAE/CRE-PP
 */

'use strict';

/**
 * Estrutura das abas do sistema
 */
var ESTRUTURA_ABAS = {

  Processos_Atesto: {
    headers: [
      'ID', 'Dados_JSON', 'Data_Criacao', 'Ultima_Atualizacao'
    ],
    descricao: 'Processos de atesto de notas fiscais'
  },

  Notas_Fiscais: {
    headers: [
      'ID', 'Numero_NF', 'Chave_Acesso', 'Data_Emissao', 'Data_Recebimento',
      'CNPJ_Fornecedor', 'Fornecedor', 'Nota_Empenho', 'Valor_Total',
      'Status_NF', 'Responsavel_Conferencia', 'Data_Conferencia',
      'Observacoes', 'Arquivo_PDF', 'Processo_Atesto_ID'
    ],
    descricao: 'Registro de notas fiscais recebidas'
  },

  Recebimento_Generos: {
    headers: [
      'ID', 'Data_Registro', 'Nota_Fiscal', 'Fornecedor', 'CNPJ_Fornecedor',
      'Data_Entrega', 'Hora_Entrega', 'Unidade_Escolar', 'CRE',
      'Tipo_Genero', 'Valor_Total', 'Responsavel_Recebimento',
      'Status', 'Data_Conferencia', 'Responsavel_Conferencia',
      'Total_Itens', 'Itens_Conformes', 'Itens_Nao_Conformes',
      'Temperatura_Aferida', 'Motivos_Recusa', 'Observacoes', 'Base_Legal'
    ],
    descricao: 'Registro de recebimentos nas Unidades Escolares'
  },

  Entregas: {
    headers: [
      'ID', 'Data_Entrega', 'Unidade_Escolar', 'Fornecedor',
      'Produto_Codigo', 'Produto_Descricao', 'Quantidade_Solicitada',
      'Quantidade_Entregue', 'Unidade_Medida', 'Valor_Unitario',
      'Valor_Total', 'Status_Entrega', 'Qualidade_OK',
      'Responsavel_Recebimento', 'Observacoes', 'PDGP_Referencia'
    ],
    descricao: 'Registro de entregas de produtos'
  },

  Recusas: {
    headers: [
      'ID', 'Data_Recusa', 'Fornecedor', 'Produto', 'Quantidade_Recusada',
      'Unidade_Medida', 'Motivo', 'Categoria_Problema', 'Responsavel',
      'Status_Resolucao', 'Data_Resolucao', 'Acao_Tomada',
      'Valor_Impacto', 'Observacoes', 'Unidade_Escolar', 'Nota_Fiscal',
      'Prazo_Substituicao', 'Substituicao_Realizada'
    ],
    descricao: 'Registro de recusas de produtos'
  },

  Glosas: {
    headers: [
      'ID', 'Data_Glosa', 'Numero_NF', 'Fornecedor', 'Produto',
      'Quantidade_Glosada', 'Valor_Unitario', 'Valor_Total_Glosa',
      'Motivo', 'Categoria_Glosa', 'Status_Glosa', 'Responsavel',
      'Data_Contestacao', 'Justificativa_Fornecedor', 'Decisao_Final',
      'Observacoes'
    ],
    descricao: 'Registro de glosas aplicadas'
  },

  Fornecedores: {
    headers: [
      'ID', 'CNPJ', 'Razao_Social', 'Nome_Fantasia', 'Email',
      'Telefone', 'Endereco_Completo', 'Responsavel_Comercial',
      'Status_Fornecedor', 'Avaliacao_Geral', 'Total_Entregas',
      'Total_Recusas', 'Total_Glosas', 'Percentual_Conformidade',
      'Data_Ultima_Avaliacao', 'Observacoes'
    ],
    descricao: 'Cadastro de fornecedores'
  },

  PDGP: {
    headers: [
      'ID', 'Ano', 'Periodo', 'Unidade_Escolar', 'Produto',
      'Categoria_Produto', 'Quantidade_Prevista', 'Unidade_Medida',
      'Valor_Estimado', 'Fornecedor_Previsto', 'Status_Planejamento',
      'Data_Inicio_Prevista', 'Data_Fim_Prevista', 'Observacoes'
    ],
    descricao: 'Plano de Distribuição de Gêneros Perecíveis'
  },

  Unidades_Escolares: {
    headers: [
      'ID', 'Nome', 'Codigo_INEP', 'Endereco', 'Telefone',
      'Email', 'Diretor', 'Vice_Diretor', 'Responsavel_Alimentacao',
      'Modalidades_Ensino', 'Total_Alunos', 'Status', 'Observacoes'
    ],
    descricao: 'Cadastro de Unidades Escolares vinculadas à CRE-PP'
  },

  Controle_Conferencia: {
    headers: [
      'ID_Controle', 'Data_Controle', 'Empresa_Fornecedor', 'Numero_NF',
      'Valor_Total', 'Tipo_Produto', 'Status_Soma', 'Data_Soma',
      'Responsavel_Soma', 'Base_Legal_Soma', 'Observacoes_Soma',
      'Status_PDGP', 'Data_PDGP', 'Responsavel_PDGP', 'Base_Legal_PDGP',
      'Observacoes_PDGP', 'Status_Consulta_NF', 'Data_Consulta_NF',
      'Responsavel_Consulta_NF', 'Base_Legal_Consulta', 'Chave_Acesso_Verificada',
      'Site_SEFAZ_Consultado', 'Status_Atesto', 'Data_Atesto',
      'Responsavel_Atesto', 'Base_Legal_Atesto', 'Comissao_Constituida',
      'Numero_Despacho', 'Protocolo_Perecivel_Aplicado', 'Status_Geral',
      'Status_Conformidade_Legal', 'Percentual_Conclusao', 'Prazo_Limite',
      'Dias_Pendente', 'Violacoes_Legais', 'Tem_Cancelamento', 'Tem_Devolucao',
      'Detalhes_Ocorrencias', 'Registro_Proprio_Ocorrencias',
      'Fiscal_Contrato_Designado', 'Comissao_Recebimento_Ativa',
      'Atribuicoes_UNIAE_Formalizadas', 'Log_Alteracoes',
      'Ultima_Validacao_Legal', 'Score_Conformidade'
    ],
    descricao: 'Controle de conferência com base legal'
  },

  Comissao_Membros: {
    headers: [
      'ID', 'Comissao_ID', 'Data_Registro', 'Nome', 'CPF', 'Cargo',
      'Matricula', 'Email', 'Telefone', 'E_Nutricionista', 'CRN',
      'Data_Designacao', 'Data_Desligamento', 'Status', 'Unidade_Escolar',
      'Observacoes'
    ],
    descricao: 'Membros da Comissão de Recebimento'
  },

  Comissao_Atestacoes: {
    headers: [
      'ID', 'Data_Atestacao', 'Comissao_ID', 'Nota_Fiscal', 'Fornecedor',
      'CNPJ_Fornecedor', 'Valor_Total', 'Data_Emissao_NF', 'Data_Recebimento',
      'Unidade_Escolar', 'CRE', 'Tipo_Atestacao', 'Membros_Presentes',
      'Quantidade_Itens', 'Conformidades', 'Nao_Conformidades',
      'Observacoes', 'Status', 'Base_Legal', 'PDGP', 'Distribuicao'
    ],
    descricao: 'Atestações realizadas pela Comissão'
  },

  Usuarios: {
    headers: [
      'email', 'nome', 'senha', 'tipo', 'instituicao', 'telefone', 
      'cpf', 'cnpj', 'ativo', 'dataCriacao', 'dataAtualizacao', 
      'ultimoAcesso', 'token'
    ],
    descricao: 'Usuários do sistema (Schema Unificado)'
  },

  System_Logs: {
    headers: [
      'Timestamp', 'Nivel', 'Modulo', 'Mensagem', 'Usuario', 'Detalhes'
    ],
    descricao: 'Logs do sistema'
  }
};

/**
 * Inicializa todas as abas do sistema
 */
function inicializarSistemaAtesto() {
  var ui = getSafeUi();

  try {
    if (ui) {
      ui.alert('Inicialização do Sistema',
        'Este processo irá criar/atualizar todas as estruturas necessárias.\n\n' +
        'Sistema de Atesto de Gêneros Alimentícios\n' +
        'UNIAE/CRE-PP\n\n' +
        'Clique OK para continuar.',
        ui.ButtonSet.OK
      );
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var criadas = [];
    var atualizadas = [];

    // Criar/atualizar cada aba
    for (var nomeAba in ESTRUTURA_ABAS) {
      var config = ESTRUTURA_ABAS[nomeAba];
      var sheet = ss.getSheetByName(nomeAba);

      if (!sheet) {
        // Criar nova aba
        sheet = ss.insertSheet(nomeAba);
        sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
        sheet.getRange(1, 1, 1, config.headers.length)
          .setFontWeight('bold')
          .setBackground('#1a73e8')
          .setFontColor('white');
        sheet.setFrozenRows(1);
        criadas.push(nomeAba);
      } else {
        // Verificar se precisa atualizar headers
        var headersAtuais = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var precisaAtualizar = false;

        for (var i = 0; i < config.headers.length; i++) {
          if (headersAtuais[i] !== config.headers[i]) {
            precisaAtualizar = true;
            break;
          }
        }

        if (precisaAtualizar || headersAtuais.length < config.headers.length) {
          sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
          sheet.getRange(1, 1, 1, config.headers.length)
            .setFontWeight('bold')
            .setBackground('#1a73e8')
            .setFontColor('white');
          atualizadas.push(nomeAba);
        }
      }
    }

    // Criar aba de instruções
    criarAbaInstrucoes(ss);

    var mensagem = '✅ SISTEMA INICIALIZADO COM SUCESSO!\n\n';
    mensagem += 'Abas criadas: ' + (criadas.length > 0 ? criadas.join(', ') : 'Nenhuma') + '\n';
    mensagem += 'Abas atualizadas: ' + (atualizadas.length > 0 ? atualizadas.join(', ') : 'Nenhuma') + '\n\n';
    mensagem += 'O sistema está pronto para uso.\n';
    mensagem += 'Acesse o menu "📋 Notas" para começar.';

    if (ui) {
      ui.alert('Inicialização Concluída', mensagem, ui.ButtonSet.OK);
    }

    Logger.log(mensagem);

    return {
      success: true,
      criadas: criadas,
      atualizadas: atualizadas
    };

  } catch (error) {
    var msgErro = 'Erro na inicialização: ' + error.message;
    Logger.log(msgErro);
    if (ui) {
      ui.alert('Erro', msgErro, ui.ButtonSet.OK);
    }
    return { success: false, error: error.message };
  }
}

/**
 * Cria aba de instruções do sistema
 */
function criarAbaInstrucoes(ss) {
  var nomeAba = '_INSTRUCOES';
  var sheet = ss.getSheetByName(nomeAba);

  if (!sheet) {
    sheet = ss.insertSheet(nomeAba);
  }

  sheet.clear();

  var instrucoes = [
    ['SISTEMA DE ATESTO DE GÊNEROS ALIMENTÍCIOS'],
    ['UNIAE/CRE-PP - Coordenação Regional de Ensino de Planaltina'],
    [''],
    ['PROPÓSITO:'],
    ['Facilitar a análise processual sobre a conferência dos recebimentos de gêneros'],
    ['alimentícios nas Unidades Escolares vinculadas à CRE-PP, assim como o atesto'],
    ['das Notas Fiscais emitidas em favor dos diferentes fornecedores.'],
    [''],
    ['BASE LEGAL:'],
    ['• Lei nº 4.320/1964 (Arts. 62 e 63) - Liquidação da despesa'],
    ['• Lei nº 11.947/2009 - PNAE'],
    ['• Lei nº 14.133/2021 (Art. 117) - Fiscalização de contratos'],
    ['• Resolução CD/FNDE nº 06/2020 - Atestação por Comissão'],
    ['• Manual da Alimentação Escolar do DF'],
    [''],
    ['FLUXO PROCESSUAL:'],
    ['1. RECEBIMENTO NA UE - Conferência física na Unidade Escolar'],
    ['2. CONSOLIDAÇÃO - Agrupamento dos Termos com a Nota Fiscal'],
    ['3. ANÁLISE COMISSÃO - Verificação documental pela UNIAE (5 dias úteis)'],
    ['4. ATESTO EXECUTOR - Confirmação e encaminhamento para liquidação'],
    [''],
    ['COMO USAR:'],
    ['1. Acesse o menu "📋 Notas" na barra de menus'],
    ['2. Use "Novo Processo" para iniciar um processo de atesto'],
    ['3. Registre os recebimentos nas Unidades Escolares'],
    ['4. Realize a análise pela Comissão de Recebimento'],
    ['5. Gere relatórios para o SEI'],
    [''],
    ['VERSÃO: 3.0.0'],
    ['Última atualização: ' + new Date().toLocaleDateString('pt-BR')]
  ];

  sheet.getRange(1, 1, instrucoes.length, 1).setValues(instrucoes);
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.getRange(2, 1).setFontSize(12).setFontColor('#5f6368');
  sheet.setColumnWidth(1, 600);
}

/**
 * Abre a interface principal do sistema
 */
function abrirInterfaceAtesto() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('UI_Atesto_Principal')
      .setWidth(1200)
      .setHeight(800)
      .setTitle('Sistema de Atesto - UNIAE/CRE-PP');

    SpreadsheetApp.getUi().showModalDialog(html, 'Sistema de Atesto de Gêneros Alimentícios');
  } catch (error) {
    Logger.log('Erro ao abrir interface: ' + error.message);
    SpreadsheetApp.getUi().alert('Erro', 'Não foi possível abrir a interface: ' + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Adiciona item ao menu para abrir a interface
 */
function adicionarMenuAtesto() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('📋 Sistema de Atesto')
    .addItem('🚀 Abrir Interface Principal', 'abrirInterfaceAtesto')
    .addItem('⚙️ Inicializar Sistema', 'inicializarSistemaAtesto')
    .addSeparator()
    .addItem('📝 Novo Processo de Atesto', 'novoProcessoAtestoMenu')
    .addItem('📦 Registrar Recebimento', 'registrarRecebimentoMenu')
    .addItem('✅ Análise da Comissão', 'analiseComissaoMenu')
    .addSeparator()
    .addItem('📊 Dashboard', 'abrirDashboardAtesto')
    .addItem('📄 Gerar Relatório SEI', 'gerarRelatorioSEIMenu')
    .addSeparator()
    .addItem('ℹ️ Sobre o Sistema', 'sobreSistemaAtesto')
    .addToUi();
}

/**
 * Exibe informações sobre o sistema
 */
function sobreSistemaAtesto() {
  var ui = SpreadsheetApp.getUi();

  ui.alert('Sobre o Sistema',
    'SISTEMA DE ATESTO DE GÊNEROS ALIMENTÍCIOS\n' +
    'Versão 3.0.0\n\n' +
    'UNIAE/CRE-PP\n' +
    'Coordenação Regional de Ensino de Planaltina\n\n' +
    'Propósito:\n' +
    'Facilitar a análise processual sobre a conferência dos\n' +
    'recebimentos de gêneros alimentícios nas Unidades Escolares\n' +
    'e o atesto das Notas Fiscais.\n\n' +
    'Base Legal:\n' +
    '• Lei 4.320/64 • Lei 11.947/2009\n' +
    '• Lei 14.133/2021 • Resolução FNDE 06/2020',
    ui.ButtonSet.OK
  );
}


/**
 * Funções de Menu - Ações Rápidas
 */

/**
 * Novo processo de atesto via menu
 */
function novoProcessoAtestoMenu() {
  var ui = SpreadsheetApp.getUi();

  var nf = ui.prompt('Novo Processo de Atesto', 'Digite o número da Nota Fiscal:', ui.ButtonSet.OK_CANCEL);
  if (nf.getSelectedButton() !== ui.Button.OK) return;

  var fornecedor = ui.prompt('Novo Processo', 'Digite o nome do Fornecedor:', ui.ButtonSet.OK_CANCEL);
  if (fornecedor.getSelectedButton() !== ui.Button.OK) return;

  var valor = ui.prompt('Novo Processo', 'Digite o Valor Total (R$):', ui.ButtonSet.OK_CANCEL);
  if (valor.getSelectedButton() !== ui.Button.OK) return;

  var dados = {
    notaFiscal: nf.getResponseText().trim(),
    fornecedor: fornecedor.getResponseText().trim(),
    valorTotal: parseFloat(valor.getResponseText().replace(',', '.')) || 0,
    tipoGenero: 'PERECIVEL'
  };

  var resultado = iniciarProcessoAtesto(dados);

  if (resultado.success) {
    ui.alert('Sucesso',
      'Processo criado com sucesso!\n\nID: ' + resultado.data.id + '\nNF: ' + dados.notaFiscal,
      ui.ButtonSet.OK);
  } else {
    ui.alert('Erro', 'Erro ao criar processo: ' + resultado.error, ui.ButtonSet.OK);
  }
}

/**
 * Registrar recebimento via menu
 */
function registrarRecebimentoMenu() {
  // Usar getSafeUi para evitar erro de contexto
  var ui = typeof getSafeUi === 'function' ? getSafeUi() : null;
  
  if (!ui) {
    Logger.log('⚠️ Função registrarRecebimentoMenu deve ser executada a partir do menu da planilha');
    return;
  }

  var idProcesso = ui.prompt('Registrar Recebimento', 'Digite o ID do Processo:', ui.ButtonSet.OK_CANCEL);
  if (idProcesso.getSelectedButton() !== ui.Button.OK) return;

  var ue = ui.prompt('Recebimento', 'Digite o nome da Unidade Escolar:', ui.ButtonSet.OK_CANCEL);
  if (ue.getSelectedButton() !== ui.Button.OK) return;

  var responsavel = ui.prompt('Recebimento', 'Digite o nome do Responsável:', ui.ButtonSet.OK_CANCEL);
  if (responsavel.getSelectedButton() !== ui.Button.OK) return;

  var matricula = ui.prompt('Recebimento', 'Digite a Matrícula do Responsável:', ui.ButtonSet.OK_CANCEL);
  if (matricula.getSelectedButton() !== ui.Button.OK) return;

  var dados = {
    unidadeEscolar: ue.getResponseText().trim(),
    dataEntrega: new Date(),
    responsavel: responsavel.getResponseText().trim(),
    matriculaResponsavel: matricula.getResponseText().trim(),
    quantitativaOk: true,
    qualitativaOk: true,
    assinatura: true,
    identificacaoUE: true
  };

  var resultado = registrarRecebimentoUE(idProcesso.getResponseText().trim(), dados);

  if (resultado.success) {
    ui.alert('Sucesso', 'Recebimento registrado com sucesso!', ui.ButtonSet.OK);
  } else {
    ui.alert('Erro', 'Erro ao registrar: ' + resultado.error, ui.ButtonSet.OK);
  }
}

/**
 * Análise da comissão via menu
 */
function analiseComissaoMenu() {
  var ui = SpreadsheetApp.getUi();

  var idProcesso = ui.prompt('Análise da Comissão', 'Digite o ID do Processo:', ui.ButtonSet.OK_CANCEL);
  if (idProcesso.getSelectedButton() !== ui.Button.OK) return;

  var membros = ui.prompt('Análise',
    'Digite os membros presentes (mínimo 3):\n(Nome - Matrícula, separados por vírgula)',
    ui.ButtonSet.OK_CANCEL);
  if (membros.getSelectedButton() !== ui.Button.OK) return;

  var listaMembros = membros.getResponseText().split(',').map(function(m) { return m.trim(); });

  if (listaMembros.length < 3) {
    ui.alert('Erro', 'É necessário no mínimo 3 membros da Comissão!', ui.ButtonSet.OK);
    return;
  }

  var resultado = ui.prompt('Análise',
    'Resultado da análise:\n1 - Aprovado\n2 - Pendente\n3 - Rejeitado\n\nDigite o número:',
    ui.ButtonSet.OK_CANCEL);
  if (resultado.getSelectedButton() !== ui.Button.OK) return;

  var resultadoMap = { '1': 'APROVADO', '2': 'PENDENTE', '3': 'REJEITADO' };
  var resultadoFinal = resultadoMap[resultado.getResponseText().trim()] || 'PENDENTE';

  var dados = {
    membrosPresentes: listaMembros,
    somaVerificada: true,
    somaConforme: true,
    atestoVerificado: true,
    atestoConforme: true,
    sefazConsultada: true,
    resultado: resultadoFinal
  };

  var res = registrarAnaliseComissaoUNIAE(idProcesso.getResponseText().trim(), dados);

  if (res.success) {
    ui.alert('Sucesso', 'Análise registrada com sucesso!\nResultado: ' + resultadoFinal, ui.ButtonSet.OK);
  } else {
    ui.alert('Erro', 'Erro ao registrar análise: ' + res.error, ui.ButtonSet.OK);
  }
}

/**
 * Gerar relatório SEI via menu
 */
function gerarRelatorioSEIMenu() {
  var ui = SpreadsheetApp.getUi();

  var idProcesso = ui.prompt('Gerar Relatório SEI', 'Digite o ID do Processo:', ui.ButtonSet.OK_CANCEL);
  if (idProcesso.getSelectedButton() !== ui.Button.OK) return;

  var resultado = gerarRelatorioProcessoSEI(idProcesso.getResponseText().trim());

  if (resultado.success) {
    // Criar documento no Google Docs
    var doc = DocumentApp.create('Relatório SEI - ' + idProcesso.getResponseText().trim());
    var body = doc.getBody();
    body.setText(resultado.data.texto);
    doc.saveAndClose();

    ui.alert('Sucesso',
      'Relatório gerado com sucesso!\n\nO documento foi criado no Google Drive.\nNome: ' + doc.getName(),
      ui.ButtonSet.OK);
  } else {
    ui.alert('Erro', 'Erro ao gerar relatório: ' + resultado.error, ui.ButtonSet.OK);
  }
}

/**
 * Abre dashboard de atesto
 */
function abrirDashboardAtesto() {
  abrirInterfaceAtesto();
}

/**
 * Função auxiliar para obter ou criar aba de forma segura
 */
function getOrCreateSheetSafe(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // Verificar se existe configuração para esta aba
    if (ESTRUTURA_ABAS && ESTRUTURA_ABAS[sheetName]) {
      var config = ESTRUTURA_ABAS[sheetName];
      sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
      sheet.getRange(1, 1, 1, config.headers.length)
        .setFontWeight('bold')
        .setBackground('#1a73e8')
        .setFontColor('white');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

/**
 * Logger do sistema
 */
var SystemLogger = {
  info: function(msg, data) {
    Logger.log('[INFO] ' + msg + (data ? ' - ' + JSON.stringify(data) : ''));
  },
  warn: function(msg, data) {
    Logger.log('[WARN] ' + msg + (data ? ' - ' + JSON.stringify(data) : ''));
  },
  error: function(msg, error) {
    Logger.log('[ERROR] ' + msg + (error ? ' - ' + (error.message || error) : ''));
  }
};
