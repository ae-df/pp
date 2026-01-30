/**
 * @fileoverview Funções de Análise para Frontend
 * @version 1.0.0
 * @description Funções chamadas pelo index.html para análises e relatórios
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-26
 */

'use strict';

// ============================================================================
// ANÁLISES DE NUTRIÇÃO E ALUNOS ESPECIAIS
// ============================================================================

/**
 * Análise de Alunos com Necessidades Especiais
 * @returns {Object} Resultado da análise
 */
function runAnaliseAlunosEspeciaisServer() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Alunos_Necessidades_Especiais') || 
                ss.getSheetByName('Alunos_NAE');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return {
        success: true,
        data: {
          resumo: { total: 0, ativos: 0, porPatologia: {} },
          alunos: []
        }
      };
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var alunos = [];
    var porPatologia = {};
    var ativos = 0;
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var aluno = {};
      headers.forEach(function(h, idx) {
        aluno[h] = row[idx];
      });
      
      var patologia = aluno.Patologia_Dieta || aluno.Tipo_Necessidade || aluno.patologia || 'Não especificada';
      var status = String(aluno.Status || aluno.status || 'ATIVO').toUpperCase();
      
      if (status === 'ATIVO') ativos++;
      
      porPatologia[patologia] = (porPatologia[patologia] || 0) + 1;
      
      alunos.push({
        nome: aluno.Nome_Completo || aluno.Nome || aluno.nome,
        escola: aluno.Unidade_Escolar || aluno.Escola || aluno.escola,
        patologia: patologia,
        status: status,
        validadeLaudo: aluno.Validade_Laudo || aluno.validade_laudo
      });
    }
    
    return {
      success: true,
      data: {
        resumo: {
          total: alunos.length,
          ativos: ativos,
          porPatologia: porPatologia
        },
        alunos: alunos.slice(0, 50)
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseAlunosEspeciaisServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Análise de Laudos Médicos (vencimentos e pendências)
 * @returns {Object} Resultado da análise
 */
function runAnaliseLaudosServer() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Alunos_Necessidades_Especiais') || 
                ss.getSheetByName('Alunos_NAE');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return {
        success: true,
        data: {
          resumo: { total: 0, vencidos: 0, vencendo30dias: 0, validos: 0 },
          laudosVencendo: [],
          laudosVencidos: []
        }
      };
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var hoje = new Date();
    var em30dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    var vencidos = [];
    var vencendo = [];
    var validos = 0;
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var aluno = {};
      headers.forEach(function(h, idx) {
        aluno[h] = row[idx];
      });
      
      var validadeLaudo = aluno.Validade_Laudo || aluno.validade_laudo;
      if (!validadeLaudo) continue;
      
      var dataValidade = new Date(validadeLaudo);
      if (isNaN(dataValidade.getTime())) continue;
      
      var registro = {
        nome: aluno.Nome_Completo || aluno.Nome || aluno.nome,
        escola: aluno.Unidade_Escolar || aluno.Escola || aluno.escola,
        patologia: aluno.Patologia_Dieta || aluno.Tipo_Necessidade || aluno.patologia,
        validadeLaudo: dataValidade.toLocaleDateString('pt-BR'),
        diasRestantes: Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24))
      };
      
      if (dataValidade < hoje) {
        vencidos.push(registro);
      } else if (dataValidade <= em30dias) {
        vencendo.push(registro);
      } else {
        validos++;
      }
    }
    
    // Ordenar por dias restantes
    vencendo.sort(function(a, b) { return a.diasRestantes - b.diasRestantes; });
    vencidos.sort(function(a, b) { return a.diasRestantes - b.diasRestantes; });
    
    return {
      success: true,
      data: {
        resumo: {
          total: vencidos.length + vencendo.length + validos,
          vencidos: vencidos.length,
          vencendo30dias: vencendo.length,
          validos: validos
        },
        laudosVencendo: vencendo.slice(0, 20),
        laudosVencidos: vencidos.slice(0, 20)
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseLaudosServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Análise de Cardápios Especiais
 * @returns {Object} Resultado da análise
 */
function runAnaliseCardapiosServer() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Cardapios_Especiais');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return {
        success: true,
        data: {
          resumo: { total: 0, porTipo: {}, porStatus: {} },
          cardapios: []
        }
      };
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var cardapios = [];
    var porTipo = {};
    var porStatus = {};
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var cardapio = {};
      headers.forEach(function(h, idx) {
        cardapio[h] = row[idx];
      });
      
      var tipo = cardapio.Tipo_Dieta || cardapio.Patologia || cardapio.tipo || 'Geral';
      var status = cardapio.Status || cardapio.status || 'ATIVO';
      
      porTipo[tipo] = (porTipo[tipo] || 0) + 1;
      porStatus[status] = (porStatus[status] || 0) + 1;
      
      cardapios.push({
        id: cardapio.ID || cardapio.id,
        aluno: cardapio.Aluno_Nome || cardapio.aluno,
        tipo: tipo,
        status: status,
        dataCriacao: cardapio.Data_Criacao || cardapio.dataCriacao
      });
    }
    
    return {
      success: true,
      data: {
        resumo: {
          total: cardapios.length,
          porTipo: porTipo,
          porStatus: porStatus
        },
        cardapios: cardapios.slice(0, 30)
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseCardapiosServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Análise Nutricional
 * @returns {Object} Resultado da análise
 */
function runAnaliseNutricionalServer() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tenta obter dados de itens alimentares
    var sheet = ss.getSheetByName('Itens_Alimentares') || 
                ss.getSheetByName('Produtos');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return {
        success: true,
        data: {
          resumo: { totalItens: 0, gruposAlimentares: {} },
          itens: []
        }
      };
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var itens = [];
    var gruposAlimentares = {};
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var item = {};
      headers.forEach(function(h, idx) {
        item[h] = row[idx];
      });
      
      var grupo = item.Grupo_Alimentar || item.Categoria || item.grupo || 'Outros';
      gruposAlimentares[grupo] = (gruposAlimentares[grupo] || 0) + 1;
      
      itens.push({
        nome: item.Nome || item.Descricao || item.nome,
        grupo: grupo,
        calorias: item.Calorias_100g || item.calorias || 0,
        proteinas: item.Proteinas_g || item.proteinas || 0,
        carboidratos: item.Carboidratos_g || item.carboidratos || 0
      });
    }
    
    return {
      success: true,
      data: {
        resumo: {
          totalItens: itens.length,
          gruposAlimentares: gruposAlimentares
        },
        itens: itens.slice(0, 30)
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseNutricionalServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// ANÁLISES COM INTELIGÊNCIA ARTIFICIAL (GEMINI)
// ============================================================================

/**
 * Análise Geral com IA (Gemini)
 * @returns {Object} Resultado da análise
 */
function runAnaliseIAGeralServer() {
  try {
    // Coleta dados para análise
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var resumo = {
      nfs: 0,
      entregas: 0,
      recusas: 0,
      valorTotal: 0
    };
    
    // Conta NFs
    var nfSheet = ss.getSheetByName('Notas_Fiscais');
    if (nfSheet && nfSheet.getLastRow() > 1) {
      resumo.nfs = nfSheet.getLastRow() - 1;
    }
    
    // Conta Entregas
    var entregasSheet = ss.getSheetByName('Entregas');
    if (entregasSheet && entregasSheet.getLastRow() > 1) {
      resumo.entregas = entregasSheet.getLastRow() - 1;
    }
    
    // Conta Recusas
    var recusasSheet = ss.getSheetByName('Recusas');
    if (recusasSheet && recusasSheet.getLastRow() > 1) {
      resumo.recusas = recusasSheet.getLastRow() - 1;
    }
    
    // Tenta usar Gemini se disponível
    var analiseIA = null;
    try {
      if (isGeminiConfigured()) {
        var prompt = 'Você é um especialista em gestão de alimentação escolar. Analise os seguintes dados e forneça insights práticos:\n\n' +
                     '- Total de Notas Fiscais: ' + resumo.nfs + '\n' +
                     '- Total de Entregas: ' + resumo.entregas + '\n' +
                     '- Total de Recusas: ' + resumo.recusas + '\n\n' +
                     'Forneça:\n1. Análise da situação atual\n2. Pontos de atenção\n3. Recomendações para melhorar a gestão';
        
        var response = sendMessageToGemini(prompt);
        analiseIA = (response && response.success) ? response.message : ('Erro: ' + (response ? response.error : 'Sem resposta'));
      } else {
        analiseIA = 'Configure GEMINI_API_KEY nas Propriedades do Script.';
      }
    } catch (e) {
      Logger.log('Erro Gemini: ' + e.message);
      analiseIA = 'Erro: ' + e.message;
    }
    
    return {
      success: true,
      data: {
        resumo: resumo,
        analiseIA: analiseIA,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseIAGeralServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Análise Nutricional com IA
 * @returns {Object} Resultado da análise
 */
function runAnaliseIANutricaoServer() {
  try {
    var resultado = runAnaliseNutricionalServer();
    
    if (!resultado.success) {
      return resultado;
    }
    
    var analiseIA = null;
    try {
      if (isGeminiConfigured()) {
        var grupos = resultado.data.resumo.gruposAlimentares;
        var prompt = 'Você é um nutricionista especializado em alimentação escolar (PNAE). Analise a distribuição de grupos alimentares abaixo e sugira melhorias:\n\n' +
                     'Distribuição atual:\n' + JSON.stringify(grupos, null, 2) + '\n\n' +
                     'Considere as diretrizes do PNAE e FNDE. Forneça:\n' +
                     '1. Avaliação da distribuição atual\n' +
                     '2. Grupos alimentares que precisam de mais atenção\n' +
                     '3. Sugestões de cardápio equilibrado';
        
        var response = sendMessageToGemini(prompt);
        analiseIA = (response && response.success) ? response.message : ('Erro: ' + (response ? response.error : 'Sem resposta'));
      } else {
        analiseIA = 'Configure GEMINI_API_KEY nas Propriedades do Script.';
      }
    } catch (e) {
      Logger.log('Erro Gemini: ' + e.message);
      analiseIA = 'Erro: ' + e.message;
    }
    
    resultado.data.analiseIA = analiseIA;
    
    return resultado;
    
  } catch (e) {
    Logger.log('Erro em runAnaliseIANutricaoServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Previsão de Demanda com IA
 * @returns {Object} Resultado da análise
 */
function runAnaliseIAPrevisaoServer() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Coleta histórico de entregas
    var entregasSheet = ss.getSheetByName('Entregas');
    var historico = [];
    var produtosContagem = {};
    
    if (entregasSheet && entregasSheet.getLastRow() > 1) {
      var data = entregasSheet.getDataRange().getValues();
      var headers = data[0];
      
      for (var i = 1; i < Math.min(data.length, 100); i++) {
        var row = data[i];
        var entrega = {};
        headers.forEach(function(h, idx) {
          entrega[h] = row[idx];
        });
        
        var produto = entrega.Produto || entrega.produto || entrega.Produto_Descricao || 'Não especificado';
        produtosContagem[produto] = (produtosContagem[produto] || 0) + 1;
        
        historico.push({
          data: entrega.Data_Entrega || entrega.data,
          quantidade: entrega.Quantidade || entrega.quantidade || 0,
          produto: produto
        });
      }
    }
    
    var analiseIA = null;
    try {
      if (isGeminiConfigured()) {
        var prompt = 'Você é um especialista em logística de alimentação escolar. Com base no histórico de entregas, faça uma previsão de demanda:\n\n' +
                     'Total de entregas analisadas: ' + historico.length + '\n' +
                     'Produtos mais frequentes:\n' + JSON.stringify(produtosContagem, null, 2) + '\n\n' +
                     'Forneça:\n' +
                     '1. Previsão de demanda para os próximos 30 dias\n' +
                     '2. Produtos que devem ter estoque prioritário\n' +
                     '3. Recomendações de planejamento de compras';
        
        var response = sendMessageToGemini(prompt);
        analiseIA = (response && response.success) ? response.message : ('Erro: ' + (response ? response.error : 'Sem resposta'));
      } else {
        analiseIA = 'Configure GEMINI_API_KEY nas Propriedades do Script.';
      }
    } catch (e) {
      Logger.log('Erro Gemini: ' + e.message);
      analiseIA = 'Erro: ' + e.message;
    }
    
    return {
      success: true,
      data: {
        historicoEntregas: historico.length,
        produtosMaisFrequentes: produtosContagem,
        previsao: analiseIA,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseIAPrevisaoServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Alertas Inteligentes com IA
 * @returns {Object} Resultado da análise
 */
function runAnaliseIAAlertasServer() {
  try {
    var alertas = [];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Verifica laudos vencendo
    var laudosResult = runAnaliseLaudosServer();
    if (laudosResult.success && laudosResult.data.resumo.vencendo30dias > 0) {
      alertas.push({
        tipo: 'LAUDO_VENCENDO',
        severidade: 'ALTA',
        mensagem: laudosResult.data.resumo.vencendo30dias + ' laudo(s) vencendo nos próximos 30 dias',
        acao: 'Solicitar renovação dos laudos médicos'
      });
    }
    
    if (laudosResult.success && laudosResult.data.resumo.vencidos > 0) {
      alertas.push({
        tipo: 'LAUDO_VENCIDO',
        severidade: 'CRITICA',
        mensagem: laudosResult.data.resumo.vencidos + ' laudo(s) já vencido(s)',
        acao: 'Urgente: Regularizar situação dos alunos'
      });
    }
    
    // Verifica NFs pendentes
    var nfSheet = ss.getSheetByName('Notas_Fiscais');
    if (nfSheet && nfSheet.getLastRow() > 1) {
      var nfData = nfSheet.getDataRange().getValues();
      var headers = nfData[0];
      var statusCol = headers.indexOf('Status') !== -1 ? headers.indexOf('Status') : headers.indexOf('Status_NF');
      
      var pendentes = 0;
      for (var i = 1; i < nfData.length; i++) {
        var status = String(nfData[i][statusCol] || '').toUpperCase();
        if (status === 'PENDENTE' || status === 'EM_ANALISE') {
          pendentes++;
        }
      }
      
      if (pendentes > 5) {
        alertas.push({
          tipo: 'NF_PENDENTE',
          severidade: 'MEDIA',
          mensagem: pendentes + ' nota(s) fiscal(is) pendente(s) de análise',
          acao: 'Priorizar análise das NFs pendentes'
        });
      }
    }
    
    // Análise com IA se disponível
    var analiseIA = null;
    if (alertas.length > 0) {
      try {
        if (isGeminiConfigured()) {
          var prompt = 'Você é um gestor de alimentação escolar. Analise os seguintes alertas e sugira priorização e ações:\n\n' +
                       JSON.stringify(alertas, null, 2) + '\n\n' +
                       'Forneça:\n1. Ordem de prioridade\n2. Ações imediatas recomendadas\n3. Impacto se não resolvidos';
          
          var response = sendMessageToGemini(prompt);
          if (response && response.success) {
            analiseIA = response.message;
          }
        }
      } catch (e) {
        Logger.log('Erro Gemini alertas: ' + e.message);
      }
    }
    
    return {
      success: true,
      data: {
        totalAlertas: alertas.length,
        alertas: alertas,
        recomendacaoIA: analiseIA,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (e) {
    Logger.log('Erro em runAnaliseIAAlertasServer: ' + e.message);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// LOG DE CARREGAMENTO
// ============================================================================

Logger.log('✅ Core_Analises_Frontend.gs carregado - Funções de análise disponíveis');
