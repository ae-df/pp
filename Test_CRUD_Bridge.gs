/**
 * @fileoverview Testes para o Core_CRUD_Frontend_Bridge
 * Execute testCRUDBridge() para verificar a integração
 */

'use strict';

/**
 * Testa todas as funções do CRUD Bridge
 */
function testCRUDBridge() {
  var results = [];
  
  Logger.log('=== INICIANDO TESTES DO CRUD BRIDGE ===');
  
  // Teste 1: listNotasFiscaisUnificado
  try {
    var nfs = listNotasFiscaisUnificado(10);
    results.push({
      teste: 'listNotasFiscaisUnificado',
      sucesso: nfs.success,
      registros: nfs.data ? nfs.data.length : 0,
      detalhes: nfs.success ? 'OK' : nfs.error
    });
    Logger.log('✅ listNotasFiscaisUnificado: ' + (nfs.data ? nfs.data.length : 0) + ' registros');
  } catch (e) {
    results.push({ teste: 'listNotasFiscaisUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ listNotasFiscaisUnificado: ' + e.message);
  }
  
  // Teste 2: listEntregasUnificado
  try {
    var entregas = listEntregasUnificado(10);
    results.push({
      teste: 'listEntregasUnificado',
      sucesso: entregas.success,
      registros: entregas.data ? entregas.data.length : 0,
      detalhes: entregas.success ? 'OK' : entregas.error
    });
    Logger.log('✅ listEntregasUnificado: ' + (entregas.data ? entregas.data.length : 0) + ' registros');
  } catch (e) {
    results.push({ teste: 'listEntregasUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ listEntregasUnificado: ' + e.message);
  }
  
  // Teste 3: listRecusasUnificado
  try {
    var recusas = listRecusasUnificado(10);
    results.push({
      teste: 'listRecusasUnificado',
      sucesso: recusas.success,
      registros: recusas.data ? recusas.data.length : 0,
      detalhes: recusas.success ? 'OK' : recusas.error
    });
    Logger.log('✅ listRecusasUnificado: ' + (recusas.data ? recusas.data.length : 0) + ' registros');
  } catch (e) {
    results.push({ teste: 'listRecusasUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ listRecusasUnificado: ' + e.message);
  }
  
  // Teste 4: listGlosasUnificado
  try {
    var glosas = listGlosasUnificado(10);
    results.push({
      teste: 'listGlosasUnificado',
      sucesso: glosas.success,
      registros: glosas.data ? glosas.data.length : 0,
      detalhes: glosas.success ? 'OK' : glosas.error
    });
    Logger.log('✅ listGlosasUnificado: ' + (glosas.data ? glosas.data.length : 0) + ' registros');
  } catch (e) {
    results.push({ teste: 'listGlosasUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ listGlosasUnificado: ' + e.message);
  }
  
  // Teste 5: getDashboardMetricsUnificado
  try {
    var metrics = getDashboardMetricsUnificado();
    results.push({
      teste: 'getDashboardMetricsUnificado',
      sucesso: metrics.success,
      detalhes: metrics.success ? JSON.stringify(metrics.data) : metrics.error
    });
    Logger.log('✅ getDashboardMetricsUnificado: ' + JSON.stringify(metrics.data));
  } catch (e) {
    results.push({ teste: 'getDashboardMetricsUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ getDashboardMetricsUnificado: ' + e.message);
  }
  
  // Teste 6: listAlunosEspeciaisUnificado
  try {
    var alunos = listAlunosEspeciaisUnificado(10);
    results.push({
      teste: 'listAlunosEspeciaisUnificado',
      sucesso: alunos.success,
      registros: alunos.data ? alunos.data.length : 0,
      detalhes: alunos.success ? 'OK' : alunos.error
    });
    Logger.log('✅ listAlunosEspeciaisUnificado: ' + (alunos.data ? alunos.data.length : 0) + ' registros');
  } catch (e) {
    results.push({ teste: 'listAlunosEspeciaisUnificado', sucesso: false, detalhes: e.message });
    Logger.log('❌ listAlunosEspeciaisUnificado: ' + e.message);
  }
  
  // Resumo
  var sucessos = results.filter(function(r) { return r.sucesso; }).length;
  var falhas = results.filter(function(r) { return !r.sucesso; }).length;
  
  Logger.log('');
  Logger.log('=== RESUMO DOS TESTES ===');
  Logger.log('Total: ' + results.length);
  Logger.log('Sucessos: ' + sucessos);
  Logger.log('Falhas: ' + falhas);
  
  return {
    total: results.length,
    sucessos: sucessos,
    falhas: falhas,
    resultados: results
  };
}

/**
 * Verifica a estrutura das sheets
 */
function verificarEstruturaSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetsParaVerificar = [
    'Notas_Fiscais',
    'Workflow_NotasFiscais',
    'Entregas',
    'Recusas',
    'Glosas',
    'Alunos_Necessidades_Especiais'
  ];
  
  Logger.log('=== VERIFICAÇÃO DE ESTRUTURA DAS SHEETS ===');
  
  sheetsParaVerificar.forEach(function(nome) {
    var sheet = ss.getSheetByName(nome);
    if (sheet) {
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();
      var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
      
      Logger.log('');
      Logger.log('📋 ' + nome + ':');
      Logger.log('   Linhas: ' + lastRow + ' (dados: ' + (lastRow - 1) + ')');
      Logger.log('   Colunas: ' + lastCol);
      Logger.log('   Headers: ' + headers.join(', '));
    } else {
      Logger.log('');
      Logger.log('❌ ' + nome + ': NÃO EXISTE');
    }
  });
}

/**
 * Testa a normalização de campos
 */
function testNormalizacaoCampos() {
  Logger.log('=== TESTE DE NORMALIZAÇÃO DE CAMPOS ===');
  
  var nfs = listNotasFiscaisUnificado(3);
  
  if (nfs.success && nfs.data && nfs.data.length > 0) {
    Logger.log('Primeiro registro normalizado:');
    var primeiro = nfs.data[0];
    
    Logger.log('  numero_nf: ' + primeiro.numero_nf);
    Logger.log('  Numero_NF: ' + primeiro.Numero_NF);
    Logger.log('  fornecedor: ' + primeiro.fornecedor);
    Logger.log('  Fornecedor: ' + primeiro.Fornecedor);
    Logger.log('  valor_total: ' + primeiro.valor_total);
    Logger.log('  Valor_Total: ' + primeiro.Valor_Total);
    Logger.log('  status: ' + primeiro.status);
    Logger.log('  Status_NF: ' + primeiro.Status_NF);
    Logger.log('  rowIndex: ' + primeiro.rowIndex);
    Logger.log('  _source: ' + primeiro._source);
  } else {
    Logger.log('Nenhum registro encontrado para testar');
  }
}
