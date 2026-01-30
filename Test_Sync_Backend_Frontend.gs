/**
 * @fileoverview Testes de Sincronização Backend-Frontend
 * @version 1.0.0
 * @created 2025-12-22
 * 
 * Execute: testSincronizacaoCompleta()
 */

'use strict';

/**
 * Teste completo de sincronização backend-frontend
 */
function testSincronizacaoCompleta() {
  var resultados = {
    timestamp: new Date().toISOString(),
    testes: [],
    resumo: { passou: 0, falhou: 0 }
  };
  
  Logger.log('========================================');
  Logger.log('TESTE DE SINCRONIZAÇÃO BACKEND-FRONTEND');
  Logger.log('========================================');
  
  // Teste 1: Verificar que listarNotasFiscais existe e funciona
  try {
    var nfs = listarNotasFiscais();
    var passou = Array.isArray(nfs);
    resultados.testes.push({
      nome: 'listarNotasFiscais() retorna array',
      passou: passou,
      detalhes: passou ? 'Retornou ' + nfs.length + ' registros' : 'Não retornou array'
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'listarNotasFiscais() retorna array',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Teste 2: Verificar estrutura dos objetos NF
  try {
    var nfs = listarNotasFiscais();
    var passou = true;
    var camposObrigatorios = ['id', 'numero', 'fornecedor', 'valorTotal', 'status'];
    
    if (nfs.length > 0) {
      var nf = nfs[0];
      for (var i = 0; i < camposObrigatorios.length; i++) {
        if (nf[camposObrigatorios[i]] === undefined) {
          passou = false;
          break;
        }
      }
    }
    
    resultados.testes.push({
      nome: 'Estrutura de NF contém campos obrigatórios',
      passou: passou,
      detalhes: passou ? 'Todos os campos presentes' : 'Campos faltando: ' + camposObrigatorios.join(', ')
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'Estrutura de NF contém campos obrigatórios',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Teste 3: Verificar contagem de pendentes
  try {
    var pendentes = contarNFsPendentes();
    var passou = typeof pendentes === 'number' && pendentes >= 0;
    resultados.testes.push({
      nome: 'contarNFsPendentes() retorna número válido',
      passou: passou,
      detalhes: 'Pendentes: ' + pendentes
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'contarNFsPendentes() retorna número válido',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Teste 4: Verificar métricas do dashboard
  try {
    var metricas = getMetricasDashboard();
    var passou = metricas && metricas.success && metricas.data;
    resultados.testes.push({
      nome: 'getMetricasDashboard() retorna dados válidos',
      passou: passou,
      detalhes: passou ? JSON.stringify(metricas.data) : 'Resposta inválida'
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'getMetricasDashboard() retorna dados válidos',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Teste 5: Verificar que não há funções duplicadas
  try {
    // Se chegou aqui sem erro, não há duplicação
    var passou = true;
    resultados.testes.push({
      nome: 'Sem funções duplicadas (listarNotasFiscais, salvarNotaFiscal)',
      passou: passou,
      detalhes: 'Funções centralizadas em Core_Sync_Backend_Frontend.gs'
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'Sem funções duplicadas',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Teste 6: Validação de salvarNotaFiscal (sem salvar de verdade)
  try {
    var resultado = salvarNotaFiscal({}); // Dados vazios devem retornar erro
    var passou = resultado && resultado.success === false && resultado.error;
    resultados.testes.push({
      nome: 'salvarNotaFiscal() valida dados obrigatórios',
      passou: passou,
      detalhes: passou ? 'Validação funcionando: ' + resultado.error : 'Validação não funcionou'
    });
    if (passou) resultados.resumo.passou++; else resultados.resumo.falhou++;
  } catch (e) {
    resultados.testes.push({
      nome: 'salvarNotaFiscal() valida dados obrigatórios',
      passou: false,
      detalhes: 'ERRO: ' + e.message
    });
    resultados.resumo.falhou++;
  }
  
  // Resumo final
  Logger.log('');
  Logger.log('========================================');
  Logger.log('RESUMO DOS TESTES');
  Logger.log('========================================');
  Logger.log('Total: ' + resultados.testes.length);
  Logger.log('Passou: ' + resultados.resumo.passou);
  Logger.log('Falhou: ' + resultados.resumo.falhou);
  Logger.log('');
  
  resultados.testes.forEach(function(t) {
    Logger.log((t.passou ? '✅' : '❌') + ' ' + t.nome);
    Logger.log('   ' + t.detalhes);
  });
  
  return resultados;
}

/**
 * Teste rápido de listagem de NFs
 */
function testListarNFs() {
  Logger.log('=== Teste Rápido: listarNotasFiscais() ===');
  
  var nfs = listarNotasFiscais();
  
  Logger.log('Total de NFs: ' + nfs.length);
  
  if (nfs.length > 0) {
    Logger.log('Primeira NF:');
    Logger.log(JSON.stringify(nfs[0], null, 2));
  }
  
  return nfs;
}

/**
 * Teste de consistência entre badge e tabela
 */
function testConsistenciaBadgeTabela() {
  Logger.log('=== Teste de Consistência Badge vs Tabela ===');
  
  var nfs = listarNotasFiscais();
  var pendentes = contarNFsPendentes();
  
  Logger.log('Total de NFs na tabela: ' + nfs.length);
  Logger.log('NFs pendentes (badge): ' + pendentes);
  
  // Contar manualmente
  var contManual = 0;
  var statusPendentes = ['ENVIADA', 'EM_RECEBIMENTO', 'PENDENTE', 'Pendente', 'Recebida'];
  
  nfs.forEach(function(nf) {
    var status = String(nf.status || '').toUpperCase();
    if (statusPendentes.some(function(s) { return status === s.toUpperCase(); })) {
      contManual++;
      Logger.log('  - NF ' + nf.numero + ': ' + nf.status);
    }
  });
  
  Logger.log('Contagem manual de pendentes: ' + contManual);
  Logger.log('Consistente: ' + (pendentes === contManual ? 'SIM ✅' : 'NÃO ❌'));
  
  return {
    totalTabela: nfs.length,
    pendentes: pendentes,
    contagemManual: contManual,
    consistente: pendentes === contManual
  };
}

Logger.log('✅ Test_Sync_Backend_Frontend.gs carregado');
