// ATENÇÃO : Este arquivo usa arrow functions e requer V8 runtime
// Configure em : Projeto > Configurações > Configurações do script > V8

'use strict';

/**
 * ==
 * SHEETS.GS v3.1 - ORQUESTRADOR CRUD CENTRAL
 * ==
 *
 * FONTE ÚNICA DA VERDADE : Estruturas e CRUD centralizados
 *
 * @version 3.1.0
 * @created 2025-11-04
 * @fixed Correção de duplicação SHEET_STRUCTURES
 */

// ==
// ESTRUTURAS DE DADOS - FONTE ÚNICA DA VERDADE
// ==

var SHEET_STRUCTURES = {

  // == DADOS PRINCIPAIS ==

  Notas_Fiscais : {
    name : 'Notas_Fiscais',
    description : 'Registro central de todas as notas fiscais recebidas - arquitetura 100% digital',
    columns : [
      'ID_NF', 'Numero_NF', 'Chave_Acesso', 'Data_Emissao', 'Data_Recebimento',
      'Fornecedor_CNPJ', 'Fornecedor_Nome', 'Nota_Empenho', 'Valor_Total', 'Status_NF',
      'Responsavel_Conferencia', 'Data_Conferencia', 'Observacoes', 'Arquivo_PDF',
      'Criado_Por', 'Timestamp_Criacao', 'Timestamp_Modificacao',
      'Modificado_Por', 'Versao_Registro'
    ],
    validations : {
      Status_NF : ['Recebida', 'Conferida', 'Atestada', 'Paga', 'Glosada']
    }
  },

  Entregas : {
    name : 'Entregas',
    description : 'Controle de entregas por produto e unidade escolar - arquitetura 100% digital',
    columns : [
      'ID_Entrega', 'Data_Entrega', 'Unidade_Escolar', 'Fornecedor_Nome', 'Produto_Codigo',
      'Produto_Nome', 'Quantidade_Solicitada', 'Quantidade_Entregue', 'Unidade_Medida',
      'Valor_Unitario', 'Valor_Total', 'Status_Entrega', 'Qualidade_OK', 'Responsavel_Recebimento',
      'Observacoes', 'Assinatura_Digital', 'Criado_Por',
      'Temperatura_Recebimento', 'Foto_Produto', 'Timestamp_Recebimento', 'Timestamp_Modificacao',
      'Modificado_Por', 'Versao_Registro', 'Latitude', 'Longitude'
    ],
    validations : {
      Status_Entrega : ['Programada', 'Entregue', 'Parcial', 'Recusada'],
      Qualidade_OK : ['S', 'N']
    }
  },

  Recusas : {
    name : 'Recusas',
    description : 'Registro de produtos recusados e não conformidades - arquitetura 100% digital',
    columns : [
      'ID_Recusa', 'Data_Recusa', 'Fornecedor_Nome', 'Produto_Nome', 'Quantidade_Recusada',
      'Unidade_Medida', 'Motivo_Recusa', 'Categoria_Problema', 'Responsavel_Recusa',
      'Status_Resolucao', 'Data_Resolucao', 'Acao_Tomada', 'Valor_Impacto', 'Observacoes',
      'Criado_Por', 'Foto_Evidencia', 'Assinatura_Responsavel',
      'Timestamp_Recusa', 'Timestamp_Modificacao', 'Modificado_Por', 'Versao_Registro'
    ],
    validations : {
      Categoria_Problema : ['Qualidade', 'Quantidade', 'Prazo', 'Documentação'],
      Status_Resolucao : ['Pendente', 'Substituído', 'Glosado', 'Resolvido']
    }
  },

  Glosas : {
    name : 'Glosas',
    description : 'Controle de glosas aplicadas',
    columns : [
      'ID_Glosa', 'Data_Glosa', 'Numero_NF', 'Fornecedor_Nome', 'Produto_Item',
      'Quantidade_Glosada', 'Valor_Unitario', 'Valor_Total_Glosa', 'Motivo_Glosa',
      'Categoria_Glosa', 'Status_Glosa', 'Responsavel_Glosa', 'Data_Contestacao',
      'Justificativa_Fornecedor', 'Decisao_Final', 'Observacoes'
    ],
    validations : {
      Categoria_Glosa : ['Qualidade', 'Quantidade', 'Prazo', 'Documentação', 'Preço'],
      Status_Glosa : ['Aplicada', 'Contestada', 'Confirmada', 'Estornada']
    }
  },

  // == PLANEJAMENTO ==

  PDGP : {
    name : 'PDGP',
    description : 'Programa de Distribuição de Gêneros Perecíveis - Planejamento',
    columns : [
      'ID_PDGP', 'Ano_Referencia', 'Periodo', 'Unidade_Escolar', 'Produto_Nome',
      'Categoria_Produto', 'Quantidade_Planejada', 'Unidade_Medida', 'Valor_Estimado',
      'Fornecedor_Previsto', 'Status_Planejamento', 'Data_Inicio_Prevista',
      'Data_Fim_Prevista', 'Observacoes'
    ],
    validations : {
      Categoria_Produto : ['Grãos', 'Laticínios', 'Carnes', 'Verduras', 'Frutas', 'Outros'],
      Status_Planejamento : ['Planejado', 'Em_Execução', 'Concluído', 'Cancelado']
    }
  },

  PDGA : {
    name : 'PDGA',
    description : 'Planejamento de Demanda e Gestão Anual',
    columns : ['Ano', 'Trimestre', 'Produto', 'Unidade', 'Quantidade Planejada', 'Valor Estimado', 'Status'],
    required : ['Ano', 'Produto']
  },

  // == CADASTROS ==

  Fornecedores : {
    name : 'Fornecedores',
    description : 'Cadastro e avaliação de fornecedores',
    columns : [
      'ID_Fornecedor', 'CNPJ', 'Razao_Social', 'Nome_Fantasia', 'Email_Contato',
      'Telefone', 'Endereco_Completo', 'Responsavel_Comercial', 'Status_Fornecedor',
      'Avaliacao_Geral', 'Total_Entregas', 'Total_Recusas', 'Total_Glosas',
      'Percentual_Conformidade', 'Data_Ultima_Avaliacao', 'Observacoes'
    ],
    validations : {
      Status_Fornecedor : ['Ativo', 'Inativo', 'Suspenso', 'Bloqueado']
    }
  },

  Config_Membros_Comissao : {
    name : 'Config_Membros_Comissao',
    description : 'Configuração dos membros da comissão de recebimento',
    columns : [
      'ID_Membro', 'Nome_Completo', 'Cargo_Funcao', 'Email_Institucional', 'Telefone',
      'Unidade_Lotacao', 'Status_Ativo', 'Data_Inicio', 'Data_Fim',
      'Responsabilidades', 'Observacoes'
    ],
    validations : {
      Status_Ativo : ['S', 'N']
    }
  },

  Usuarios : {
    name : 'Usuarios',
    description : 'Cadastro de usuários do sistema com autenticação 100% digital',
    columns : [
      // Identificação - Arquitetura 100% digital: senha em texto plano
      'ID_Usuario', 'Email', 'Senha', 'Nome_Completo', 'CPF', 'Matricula',
      // Perfil e Permissões
      'Tipo_Usuario', 'Permissoes', 'Unidade_Lotacao', 'Cargo',
      // Status e Controle
      'Status', 'Motivo_Bloqueio', 'Data_Cadastro', 'Data_Ativacao', 'Data_Expiracao',
      'Ultimo_Acesso', 'IP_Ultimo_Acesso',
      // Segurança
      'Tentativas_Login', 'Data_Ultimo_Bloqueio', 'Token_Recuperacao', 'Token_Expiracao',
      'Requer_Troca_Senha', 'Data_Ultima_Troca_Senha',
      // Contato
      'Telefone', 'Telefone_Alternativo', 'Email_Alternativo',
      // Auditoria
      'Criado_Por', 'Modificado_Por', 'Data_Modificacao', 'Observacoes'
    ],
    validations : {
      Tipo_Usuario : ['Analista Educacional', 'Administrador', 'Diretor de Unidade de Ensino'],
      Status : ['Ativo', 'Inativo', 'Bloqueado', 'Pendente_Ativacao'],
      Requer_Troca_Senha : ['S', 'N']
    }
  },

  // == CONTROLE E AUDITORIA ==

  Controle_Conferencia : {
    name : 'Controle_Conferencia',
    description : 'Controle de conferência de notas fiscais baseado no fluxo CSV',
    columns : [
      'ID_Controle', 'Data_Controle', 'Empresa_Fornecedor', 'Numero_NF', 'Valor_Total',
      // Etapas de conferência
      'Status_Soma', 'Data_Soma', 'Responsavel_Soma', 'Observacoes_Soma',
      'Status_PDGP', 'Data_PDGP', 'Responsavel_PDGP', 'Observacoes_PDGP',
      'Status_Consulta_NF', 'Data_Consulta_NF', 'Responsavel_Consulta_NF', 'Chave_Acesso_Verificada',
      'Status_Atesto', 'Data_Atesto', 'Responsavel_Atesto', 'Numero_Despacho',
      // Status geral
      'Status_Geral', 'Percentual_Conclusao', 'Prazo_Limite', 'Dias_Pendente',
      'Tem_Cancelamento', 'Tem_Devolucao', 'Detalhes_Ocorrencias'
    ],
    validations : {
      Status_Soma : ['PENDENTE', 'CONCLUIDO', 'COM_PROBLEMA'],
      Status_PDGP : ['PENDENTE', 'CONCLUIDO', 'COM_PROBLEMA'],
      Status_Consulta_NF : ['PENDENTE', 'CONCLUIDO', 'COM_PROBLEMA'],
      Status_Atesto : ['PENDENTE', 'CONCLUIDO', 'COM_PROBLEMA'],
      Status_Geral : ['PENDENTE', 'EM_CONFERENCIA', 'CONCLUIDO', 'COM_PROBLEMA'],
      Tem_Cancelamento : ['SIM', 'NAO'],
      Tem_Devolucao : ['SIM', 'NAO']
    }
  },

  Auditoria_Log : {
    name : 'Auditoria_Log',
    description : 'Log de auditoria e conformidade - Portaria 244/2006',
    columns : [
      'ID_Auditoria', 'Data_Auditoria', 'Tipo_Auditoria', 'Categoria', 'Descricao',
      'Gravidade', 'Status_Achado', 'Responsavel_Auditoria', 'Acao_Recomendada',
      'Prazo_Resolucao', 'Data_Resolucao', 'Observacoes'
    ],
    validations : {
      Tipo_Auditoria : ['Conformidade', 'Irregularidade', 'Tendência', 'Preços'],
      Gravidade : ['Baixa', 'Média', 'Alta', 'Crítica'],
      Status_Achado : ['Aberto', 'Em_Análise', 'Resolvido', 'Arquivado']
    }
  },

  Textos_Padrao : {
    name : 'Textos_Padrao',
    description : 'Textos padrão para relatórios e documentos',
    columns : [
      'ID_Texto', 'Categoria', 'Nome_Template', 'Titulo', 'Conteudo_Texto',
      'Variaveis_Disponiveis', 'Status_Ativo', 'Data_Criacao', 'Data_Ultima_Alteracao',
      'Responsavel_Alteracao', 'Observacoes'
    ],
    validations : {
      Status_Ativo : ['S', 'N']
    }
  },

  System_Logs : {
    name : 'System_Logs',
    description : 'Logs do sistema para rastreabilidade',
    columns : ['ID_Log', 'Data_Hora', 'Tipo_Evento', 'Mensagem', 'Nivel', 'Usuario', 'Detalhes'],
    required : ['Data_Hora', 'Tipo_Evento', 'Mensagem']
  }
};

// ==
// OPERAÇÕES CRUD GENÉRICAS
// ==

/**
 * CREATE - Adiciona registro em qualquer planilha
 */
function createRecord(sheetName, data) {
  try {
    // Validação robusta
    if (!sheetName || typeof sheetName != 'string' || sheetName.trim() == '') {
      var error = new Error('sheetName inválido : ' + sheetName + '');
      Logger.log('Erro em createRecord : ' + error.message + '');
      Logger.log('Stack trace : ' + error.stack + '');
      return { success : false, error : error.message };
    }

    if (!data || typeof data != 'object') {
      var error = new Error('data inválido : ' + data + '');
      Logger.log('Erro em createRecord : ' + error.message + '');
      return { success : false, error : error.message };
    }

    var structure = SHEET_STRUCTURES[sheetName];
    if (!structure) {
      throw new Error('Planilha não encontrada : ' + sheetName + '. Planilhas disponíveis : ' + Object.keys(SHEET_STRUCTURES).join(', ') + '');
    }

    // Validar campos obrigatórios
    if (structure.required) {
      for (var field of structure.required) {
        if (!data[field] && data[field] != 0) {
          throw new Error('Campo obrigatório : ' + field + '');
        }
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet não existe : ' + sheetName + '. Execute initializeSheets() primeiro.');
    }

    // Montar linha de dados
    var row = structure.columns.map(col => data[col] || '');
    sheet.appendRow(row);

    logOperation('CREATE', sheetName, { data: data });

  } catch (error) {
    Logger.log('Erro em createRecord : ' + error.message + '');
    Logger.log('Stack trace : ' + error.stack + '');
    return {
      success : false,
      error : error.message
    };
  }
}


/**
 * READ - Lê registros de qualquer planilha
 */
function readRecords(sheetName, filters) {
  try {
    // Validação robusta
    if (!sheetName || typeof sheetName != 'string' || sheetName.trim() == '') {
      var error = new Error('sheetName inválido : ' + sheetName + '');
      Logger.log('Erro em readRecords : ' + error.message + '');
      Logger.log('Stack trace : ' + error.stack + '');
      return { success : false, error : error.message, data : [], count : 0 };
    }

    var structure = SHEET_STRUCTURES[sheetName];
    if (!structure) {
      throw new Error('Planilha não encontrada : ' + sheetName + '. Planilhas disponíveis : ' + Object.keys(SHEET_STRUCTURES).join(', ') + '');
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet não existe : ' + sheetName + '. Execute initializeSheets() primeiro.');
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);

    // Converter para array de objetos
    var records = rows.map(row => {
      var record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
    });

    // Aplicar filtros
    if (Object.keys(filters).length > 0) {
      records = records.filter(record => {
        return Object.keys(filters).every(key => record[key] == filters[key]);
      });
    }

    return {
      success : true,
      data : records,
      count : records.length
    };

  } catch (error) {
    Logger.log('Erro em readRecords : ' + error.message);
    Logger.log('Stack trace : ' + error.stack);
    return {
      success : false,
      error : error.message,
      data : [],
      count : 0
    };
  }
}

/**
 * UPDATE - Atualiza registro em qualquer planilha
 */
function updateRecord(sheetName, rowIndex, data) {
  try {
    var structure = SHEET_STRUCTURES[sheetName];
    if (!structure) {
      throw new Error('Estrutura não definida para : ' + sheetName);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet não encontrada : ' + sheetName);
    }

    var actualRow = rowIndex + 1; // +1 para pular header;

    // Atualizar apenas campos fornecidos
    structure.columns.forEach(function(col, index) {
      if (data.hasOwnProperty(col) && data[col] != undefined) {
        sheet.getRange(actualRow, index + 1).setValue(data[col]);
      }
    });

    logOperation('UPDATE', sheetName, { rowIndex : rowIndex, data : data });

    return { success : true, rowIndex : rowIndex };

  } catch (error) {
    Logger.log('Erro em updateRecord : ' + error.message);
    Logger.log('Stack trace : ' + error.stack);
    return {
      success : false,
      error : error.message
    };
  }
}

/**
 * DELETE - Remove registro de qualquer planilha
 */
function deleteRecord(sheetName, rowIndex) {
  try {
    // Validação robusta
    if (!sheetName || typeof sheetName != 'string' || sheetName.trim() == '') {
      throw new Error('Nome da sheet inválido');
    }

    if (typeof rowIndex != 'number' || rowIndex < 1) {
      throw new Error('Índice de linha inválido');
    }

    var structure = SHEET_STRUCTURES[sheetName];
    if (!structure) {
      throw new Error('Estrutura não definida para : ' + sheetName);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet não encontrada : ' + sheetName);
    }

    var actualRow = rowIndex + 1; // +1 para pular header;
    sheet.deleteRow(actualRow);

    logOperation('DELETE', sheetName, { rowIndex : rowIndex });

    return { success : true, rowIndex : rowIndex };

  } catch (error) {
    Logger.log('Erro em deleteRecord : ' + error.message);
    Logger.log('Stack trace : ' + error.stack);
    return {
      success : false,
      error : error.message
    };
  }
}

// ==
// FUNÇÕES DE BUSCA ESPECIALIZADAS
// ==

function findById(sheetName, id) {
  var result = readRecords(sheetName);
  if (!result.success) return result;

  var idField = SHEET_STRUCTURES[sheetName].columns[0];
  var record = result.data.find(r => r[idField] == id);

  return record ? { success : true, data : record } : { success : false, error : 'Registro não encontrado' };
}

function findByField(sheetName, fieldName, value) {
  var filters = {};
  filters[fieldName] = value;
  return readRecords(sheetName, filters);
}

// ==
// INICIALIZAÇÃO E SETUP
// ==

function initializeSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var created = 0;
  var fixed = 0;

  Object.keys(SHEET_STRUCTURES).forEach(sheetName => {
    var sheet = ss.getSheetByName(sheetName);
    var headers = SHEET_STRUCTURES[sheetName].columns;

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      Logger.log('✅ Sheet criada : ' + sheetName + '');
      created++;
    } else if (sheet.getLastColumn() == 0 || sheet.getLastRow() == 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      Logger.log('🔧 Headers adicionados : ' + sheetName + '');
      fixed++;
    }
  });

  Logger.log('✅ Inicialização completa : ' + created + ' criadas, ' + fixed + ' corrigidas');
}

function validateSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var report = [];

  Object.keys(SHEET_STRUCTURES).forEach(sheetName => {
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      report.push('❌ ' + sheetName + ' : Sheet não existe');
      return;
    }

    var lastCol = sheet.getLastColumn();
    if (lastCol == 0) {
      report.push('⚠️ ' + sheetName + ' : Sheet vazia (sem headers)');
      return;
    }

    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var expected = SHEET_STRUCTURES[sheetName].columns;

    if (JSON.stringify(headers) == JSON.stringify(expected)) {
      report.push('✅ ' + sheetName + ' : OK');
    } else {
      report.push('⚠️ ' + sheetName + ' : Headers não correspondem');
    }
  });

  Logger.log(report.join('\n'));
}

// ==
// FUNÇÕES AUXILIARES
// ==

function getOrCreateSheetSafe(sheetName, customHeaders) {
  if (!sheetName || typeof sheetName != 'string' || sheetName.trim() == '') {
    var error = new Error('sheetName é obrigatório e deve ser uma string não vazia. Recebido : ' + sheetName);
    Logger.log('ERRO : getOrCreateSheetSafe chamado com parâmetro inválido : ' + sheetName);
    Logger.log('Stack trace : ' + error.stack);

    var stackLines = error.stack.split('\n');
    if (stackLines.length > 2) {
      Logger.log('Chamado por : ' + stackLines[2]);
    }

    throw error;
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      if (SHEET_STRUCTURES[sheetName]) {
        Logger.log('Criando sheet automaticamente : ' + sheetName);
        sheet = ss.insertSheet(sheetName);
        var headers = SHEET_STRUCTURES[sheetName].columns;
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      } else if (customHeaders && Array.isArray(customHeaders) && customHeaders.length > 0) {
        Logger.log('Criando sheet com headers customizados : ' + sheetName);
        sheet = ss.insertSheet(sheetName);
        sheet.getRange(1, 1, 1, customHeaders.length).setValues([customHeaders]);
        sheet.getRange(1, 1, 1, customHeaders.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      } else {
        Logger.log('Sheet não existe e não tem estrutura definida : ' + sheetName);
        return null;
      }
    }

    return sheet;

  } catch (error) {
    Logger.log('Erro em getOrCreateSheetSafe(' + sheetName + ') : ' + error.message);
    return null;
  }
}

/** 
 * Retorna todas as estruturas de sheets 
 * Preferir uso direto de SHEET_STRUCTURES ou getAllSheetStructures() de Core_Dados.gs
 */
function getSheetStructures() {
  return SHEET_STRUCTURES;
}

/** 
 * Retorna estrutura de uma sheet específica
 * @deprecated Preferir getSheetStructure() de Core_Dados.gs para consistência
 */
function _sheets_getSheetStructure(sheetName) {
  return SHEET_STRUCTURES[sheetName] || null;
}

/**
 * Retorna headers de uma sheet (via SHEET_STRUCTURES)
 * @deprecated Preferir getSheetHeaders() de Core_Sheet_Accessor.gs
 */
function _sheets_getSheetHeaders(sheetName) {
  var structure = SHEET_STRUCTURES[sheetName];
  return structure ? structure.columns : [];
}

/**
 * Retorna validações de uma sheet
 * @deprecated Preferir getSheetValidations() de Core_Dados.gs
 */
function _sheets_getSheetValidations(sheetName) {
  var structure = SHEET_STRUCTURES[sheetName];
  return structure ? (structure.validations || {}) : {};
}

function logOperation(operation, sheetName, details) {
  if (sheetName == 'System_Logs') return;

  try {
    var logData = {
      Data_Hora : new Date(),
      Tipo_Evento : operation,
      Mensagem : operation + ' em ' + sheetName,
      Nivel : 'INFO',
      Usuario : Session.getActiveUser().getEmail(),
      Detalhes : JSON.stringify(details)
    };

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('System_Logs');
    if (sheet) {
      var structure = SHEET_STRUCTURES['System_Logs'];
      var row = structure.columns.map(function(col) { return logData[col] || ''; });
      sheet.appendRow(row);
    }
  } catch (error) {
    Logger.log('Erro ao registrar log : ' + error.message);
  }
}

// ==
// FUNÇÕES DE COMPATIBILIDADE
// ==
// NOTA : Estas funções foram desabilitadas para evitar conflito com Core_Dados.gs
// As implementações principais estão em Core_Dados.gs

// function addSheetRow(sheetName, data) { return createRecord(sheetName, data); }
// function getSheetData(sheetName, filters) { return readRecords(sheetName, filters); }
// function updateSheetRow(sheetName, rowIndex, data) { return updateRecord(sheetName, rowIndex, data); }
// function deleteSheetRow(sheetName, rowIndex) { return deleteRecord(sheetName, rowIndex); };
