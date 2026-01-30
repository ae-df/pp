/**
 * @fileoverview API Backend Integrada para os 3 Workflows (REFATORADO)
 * 
 * INTERVENÇÃO 4/4: Orquestração (Service Layer)
 * 
 * Agora atua como um FACADE/ORCHESTRATOR que delega para:
 * - Core_Workflow_Calculator (Domínio/Lógica Pura)
 * - Core_Workflow_Repository (Dados/Persistência)
 * 
 * Compatibilidade mantida com versões anteriores.
 * 
 * @version 3.0.0 (Refatorado)
 */

'use strict';

// ============================================================================
// FACADE PARA CÁLCULOS (Delegation)
// ============================================================================

/**
 * Calcula valores contábeis de uma NF com base nos recebimentos
 * @delegate WorkflowCalculator.calculateAccountingValues
 */
function calcularValoresContabeis(qtdNF, qtdRecebida, valorUnitario) {
  return WorkflowCalculator.calculateAccountingValues(qtdNF, qtdRecebida, valorUnitario);
}

/**
 * Valida integridade contábil de uma análise
 * @delegate WorkflowCalculator.validateAccountingIntegrity
 */
function validarIntegridadeContabil(dados) {
  var result = WorkflowCalculator.validateAccountingIntegrity(dados);
  // Adaptador de retorno para manter compatibilidade exata com o código antigo se necessário
  return {
    valido: result.valid,
    erros: result.errors,
    calculado: result.calculated
  };
}


// ============================================================================
// WORKFLOW 1: FORNECEDOR
// ============================================================================

function salvarNotaFiscal_Workflow(dados) {
  try {
    // Validação básica
    if (!dados.numero) return { success: false, error: 'Número da NF é obrigatório' };
    
    // Delega ao Repositório
    var id = WorkflowRepository.Invoices.save(dados);
    
    Logger.log('Facade: NF salva via Repository - ' + id);
    return { success: true, id: id };
    
  } catch (e) {
    Logger.log('Erro salvarNotaFiscal_Workflow: ' + e.message);
    return { success: false, error: e.message };
  }
}

function listarNotasFiscais_Workflow() {
  try {
    return WorkflowRepository.Invoices.listAll();
  } catch (e) {
    Logger.log('Erro listarNotasFiscais: ' + e.message);
    return [];
  }
}

// ============================================================================
// WORKFLOW 2: REPRESENTANTE ESCOLAR
// ============================================================================

function salvarRecebimento(dados) {
  try {
    // Orquestração: Valida -> Salva Recebimento -> Atualiza NF -> (Opcional) Registra Recusa
    
    // 1. Validação Contábil/Regra de Negócios (Calculadora)
    var status = 'CONFORME';
    if (dados.quantidadeRecebida < dados.quantidadeEsperada) {
      status = dados.quantidadeRecebida > 0 ? 'PARCIAL' : 'RECUSADO';
    }
    dados.status = status;
    
    // 2. Persistência (Repositório)
    var id = WorkflowRepository.Receipts.save(dados);
    
    // 3. Atualização de Estado (Repositório)
    WorkflowRepository.Invoices.updateStatus(dados.nfId, 'EM_RECEBIMENTO');
    
    // 4. Fluxo de Exceção (Recusa)
    var qtdRecusada = dados.quantidadeRecusada || Math.max(0, (dados.quantidadeEsperada || 0) - dados.quantidadeRecebida);
    if (qtdRecusada > 0) {
      WorkflowRepository.Occurrences.save({
        prefixo: 'OCOR_',
        tipo: dados.quantidadeRecebida > 0 ? 'RECUSA_PARCIAL' : 'RECUSA_TOTAL',
        nfId: dados.nfId,
        escola: dados.escola,
        produto: dados.produto,
        motivo: dados.motivoRecusa,
        acaoTomada: 'Registrado no Recebimento',
        status: 'REGISTRADO'
      });
    }
    
    return { success: true, id: id, status: status, mensagem: 'Recebimento registrado com sucesso' };
    
  } catch (e) {
    Logger.log('Erro salvarRecebimento: ' + e.message);
    return { success: false, error: e.message };
  }
}

function listarNFsPendentesParaEscola(escola) {
  // Lógica complexa de filtro mantida no Facade ou movida para um Service específico?
  // Por simplicidade na refatoração, vamos reconstruir usando os métodos do Repositório.
  
  try {
    var allNFs = WorkflowRepository.Invoices.listAll();
    var resultado = [];
    
    // Filtrar apenas ENVIADA ou EM_RECEBIMENTO
    allNFs.forEach(function(nf) {
      if (nf.status === 'ENVIADA' || nf.status === 'EM_RECEBIMENTO') {
        // Verificar se escola já recebeu
        var recibos = WorkflowRepository.Receipts.findByNfId(nf.id);
        var jaRecebeu = recibos.some(function(r) { return r.escola === escola; });
        
        var totalRecebido = recibos.reduce(function(acc, r) { return acc + (Number(r.qtdRecebida) || 0); }, 0);
        
        nf.recebimentos = recibos.map(function(r) { return r.escola; });
        nf.totalRecebido = totalRecebido;
        nf.jaRecebeuEscola = jaRecebeu;
        
        resultado.push(nf);
      }
    });
    
    return resultado.reverse();
  } catch (e) {
    Logger.log('Erro listarNFsPendentesParaEscola: ' + e.message);
    return [];
  }
}

function registrarRecusa(dados) {
  try {
    var id = WorkflowRepository.Occurrences.save({
      prefixo: 'RECUSA_',
      tipo: 'RECUSA_RECEBIMENTO',
      nfId: dados.nfId,
      escola: dados.escola,
      produto: dados.produto,
      motivo: dados.motivo,
      acaoTomada: 'Notificação de Qualidade',
      status: 'AGUARDANDO_REPOSICAO'
    });
    
    // Atualizar NF
    WorkflowRepository.Invoices.updateStatus(dados.nfId, 'REJEITADO');
    
    return { success: true, id: id, mensagem: 'Recusa registrada.' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// WORKFLOW 3: ANALISTA
// ============================================================================

function listarNFsParaAnalise() {
  try {
    var allNFs = WorkflowRepository.Invoices.listAll();
    var resultado = [];
    
    allNFs.forEach(function(nf) {
      if (nf.status === 'ENVIADA' || nf.status === 'EM_RECEBIMENTO') {
        var recibos = WorkflowRepository.Receipts.findByNfId(nf);
        var totalRecebido = recibos.reduce(function(acc, r) { return acc + (Number(r.qtdRecebida) || 0); }, 0);
        
        // Uso da Calculadora para enriquecer o objeto
        var calc = WorkflowCalculator.calculateAccountingValues(nf.quantidade, totalRecebido, nf.valorUnitario);
        
        // Merge de propriedades
        nf.recebimentos = recibos; // Detalhes completos
        nf.totalRecebido = totalRecebido;
        nf.diferenca = calc.diferenca;
        nf.valorGlosaCalculado = calc.valorGlosa;
        nf.valorAprovadoCalculado = calc.valorAprovado;
        nf.percentualGlosa = calc.percentualGlosa;
        nf.qtdEscolas = recibos.length;
        
        resultado.push(nf);
      }
    });
    
    return resultado.reverse();
  } catch (e) {
    return [];
  }
}

function salvarAnalise(dados) {
  try {
    // 1. Validação de Domínio
    var validacao = WorkflowCalculator.validateAccountingIntegrity(dados);
    if (!validacao.valid) {
      Logger.log('Correção automática de análise baseada na calculadora');
      dados.valorGlosa = validacao.calculated.valorGlosa;
      dados.valorAprovado = validacao.calculated.valorAprovado;
      dados.percentualGlosa = validacao.calculated.percentualGlosa;
      dados.validacaoContabil = 'CORRIGIDO_AUTO';
    } else {
      dados.validacaoContabil = 'OK';
    }
    
    // 2. Determinar Status Final
    var statusFinal = 'APROVADO';
    if (dados.decisao === 'GLOSADO') statusFinal = 'GLOSADO';
    if (dados.decisao === 'REJEITADO') statusFinal = 'REJEITADO';
    if (dados.decisao === 'APROVADO_PARCIAL') statusFinal = 'APROVADO_PARCIAL';
    
    dados.status = statusFinal;
    
    // 3. Persistência
    var id = WorkflowRepository.Analyses.save(dados);
    WorkflowRepository.Invoices.updateStatus(dados.nfId, statusFinal);
    
    return { success: true, id: id, status: statusFinal };
    
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// COMPATIBILIDADE / LEGADO / MENUS
// ============================================================================

// Mantém funções de menu originais para não quebrar a UI
function abrirWorkflowFornecedor() { _abrirSidebar('UI_Workflow_Fornecedor', 'Fornecedor'); }
function abrirWorkflowRepresentante() { _abrirSidebar('UI_Workflow_Representante', 'Escola'); }
function abrirWorkflowAnalista() { _abrirSidebar('UI_Workflow_Analista', 'Analista'); }
function abrirWorkflowNutricionista() { _abrirSidebar('UI_Workflow_Nutricionista', 'Nutricionista'); }

function _abrirSidebar(arquivo, titulo) {
  try {
    var html = HtmlService.createHtmlOutputFromFile(arquivo).setWidth(420).setHeight(650).setTitle(titulo);
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (e) {
    Logger.log('Erro sidebar: ' + e.message);
  }
}
