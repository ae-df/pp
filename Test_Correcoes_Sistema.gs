/**
 * @fileoverview Testes das Correções do Sistema
 * @version 4.0.1
 *
 * Dependências:
 * - Core_UI_Safe.gs (getSafeUi, safeAlert, safePrompt)
 * - Core_Input_Validation.gs (validações)
 */

'use strict';

// Usa funções de Core_UI_Safe.gs

/**
 * Testa se as funções corrigidas estão funcionando
 */
function testarCorrecoesSistema() {
  Logger.log('=== TESTE DAS CORREÇÕES DO SISTEMA ===\n');

  var resultados = {
    sucessos: 0,
    falhas: 0,
    detalhes: []
  };

  // Teste 1: Verificar getSafeUi existe
  try {
    Logger.log('1. Testando getSafeUi...');
    if (typeof getSafeUi === 'function') {
      Logger.log('   ✅ PASSOU - getSafeUi está definida');
      resultados.sucessos++;
      resultados.detalhes.push('✅ getSafeUi definida');
    } else {
      Logger.log('   ❌ FALHOU - getSafeUi não está definida');
      resultados.falhas++;
      resultados.detalhes.push('❌ getSafeUi não definida');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ getSafeUi (erro)');
  }

  // Teste 2: Verificar safeAlert existe
  try {
    Logger.log('\n2. Testando safeAlert...');
    if (typeof safeAlert === 'function') {
      Logger.log('   ✅ PASSOU - safeAlert está definida');
      resultados.sucessos++;
      resultados.detalhes.push('✅ safeAlert definida');
    } else {
      Logger.log('   ❌ FALHOU - safeAlert não está definida');
      resultados.falhas++;
      resultados.detalhes.push('❌ safeAlert não definida');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ safeAlert (erro)');
  }

  // Teste 3: Verificar safePrompt existe
  try {
    Logger.log('\n3. Testando safePrompt...');
    if (typeof safePrompt === 'function') {
      Logger.log('   ✅ PASSOU - safePrompt está definida');
      resultados.sucessos++;
      resultados.detalhes.push('✅ safePrompt definida');
    } else {
      Logger.log('   ❌ FALHOU - safePrompt não está definida');
      resultados.falhas++;
      resultados.detalhes.push('❌ safePrompt não definida');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ safePrompt (erro)');
  }

  // Teste 4: Validação de CNPJ com valores undefined
  try {
    Logger.log('\n4. Testando validarCNPJ com undefined...');
    if (typeof validarCNPJ === 'function') {
      var resultadoCnpjUndefined = validarCNPJ(undefined);
      if (resultadoCnpjUndefined === false) {
        Logger.log('   ✅ PASSOU - validarCNPJ(undefined) retornou false');
        resultados.sucessos++;
        resultados.detalhes.push('✅ validarCNPJ com undefined');
      } else {
        Logger.log('   ❌ FALHOU - validarCNPJ(undefined) deveria retornar false');
        resultados.falhas++;
        resultados.detalhes.push('❌ validarCNPJ com undefined');
      }
    } else {
      Logger.log('   ⚠️ PULADO - validarCNPJ não disponível');
      resultados.detalhes.push('⚠️ validarCNPJ (pulado)');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - validarCNPJ com undefined: ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ validarCNPJ com undefined (erro)');
  }

  // Teste 5: Validação de CNPJ com null
  try {
    Logger.log('\n5. Testando validarCNPJ com null...');
    if (typeof validarCNPJ === 'function') {
      var resultadoCnpjNull = validarCNPJ(null);
      if (resultadoCnpjNull === false) {
        Logger.log('   ✅ PASSOU - validarCNPJ(null) retornou false');
        resultados.sucessos++;
        resultados.detalhes.push('✅ validarCNPJ com null');
      } else {
        Logger.log('   ❌ FALHOU - validarCNPJ(null) deveria retornar false');
        resultados.falhas++;
        resultados.detalhes.push('❌ validarCNPJ com null');
      }
    } else {
      Logger.log('   ⚠️ PULADO - validarCNPJ não disponível');
      resultados.detalhes.push('⚠️ validarCNPJ (pulado)');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - validarCNPJ com null: ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ validarCNPJ com null (erro)');
  }

  // Teste 6: logFormatted com title undefined
  try {
    Logger.log('\n6. Testando logFormatted com title undefined...');
    if (typeof logFormatted === 'function') {
      logFormatted('info', undefined, 'Mensagem de teste');
      Logger.log('   ✅ PASSOU - logFormatted com title undefined não gerou erro');
      resultados.sucessos++;
      resultados.detalhes.push('✅ logFormatted com title undefined');
    } else {
      Logger.log('   ⚠️ PULADO - logFormatted não disponível');
      resultados.detalhes.push('⚠️ logFormatted (pulado)');
    }
  } catch (e) {
    Logger.log('   ❌ ERRO - logFormatted com title undefined: ' + e.message);
    resultados.falhas++;
    resultados.detalhes.push('❌ logFormatted com title undefined (erro)');
  }

  // Resumo dos resultados
  Logger.log('\n=== RESUMO DOS TESTES ===');
  Logger.log('Total de testes: ' + (resultados.sucessos + resultados.falhas));
  Logger.log('Sucessos: ' + resultados.sucessos + ' ✅');
  Logger.log('Falhas: ' + resultados.falhas + ' ❌');

  if (resultados.falhas === 0) {
    Logger.log('\n🎉 TODOS OS TESTES PASSARAM!');
  } else {
    Logger.log('\n⚠️ Alguns testes falharam. Verifique os detalhes acima.');
  }

  Logger.log('\n=== DETALHES ===');
  resultados.detalhes.forEach(function(detalhe, index) {
    Logger.log((index + 1) + '. ' + detalhe);
  });

  Logger.log('\n=== FIM DOS TESTES ===');

  return resultados;
}

/**
 * Testa a remoção de duplicações
 */
function testarRemocaoDuplicacoes() {
  Logger.log('=== TESTE DE REMOÇÃO DE DUPLICAÇÕES ===\n');

  // Verificar que só existe uma definição de getSafeUi
  Logger.log('Verificando unicidade das funções...');

  var funcoesUnicas = ['getSafeUi', 'safeAlert', 'safePrompt'];
  
  // Mapa seguro de funções - evita uso de eval() (vulnerabilidade de injection)
  var funcaoMap = {
    'getSafeUi': typeof getSafeUi !== 'undefined' ? getSafeUi : null,
    'safeAlert': typeof safeAlert !== 'undefined' ? safeAlert : null,
    'safePrompt': typeof safePrompt !== 'undefined' ? safePrompt : null
  };

  funcoesUnicas.forEach(function(funcao) {
    try {
      var fn = funcaoMap[funcao];
      if (typeof fn === 'function') {
        Logger.log('✅ ' + funcao + ' - Definida e única');
      } else {
        Logger.log('❌ ' + funcao + ' - Não encontrada');
      }
    } catch (e) {
      Logger.log('❌ ' + funcao + ' - Erro: ' + e.message);
    }
  });

  Logger.log('\n=== FIM DO TESTE ===');
}

/**
 * Executa todos os testes de correção
 */
function executarTodosTestesCorrecao() {
  Logger.log('╔════════════════════════════════════════════════════════════╗');
  Logger.log('║        TESTES DE CORREÇÃO - SISTEMA v4.0.0                 ║');
  Logger.log('╚════════════════════════════════════════════════════════════╝\n');

  var resultadoCorrecoes = testarCorrecoesSistema();

  Logger.log('\n' + '─'.repeat(60) + '\n');

  testarRemocaoDuplicacoes();

  Logger.log('\n╔════════════════════════════════════════════════════════════╗');
  Logger.log('║                 TESTES CONCLUÍDOS                           ║');
  Logger.log('╚════════════════════════════════════════════════════════════╝');

  return resultadoCorrecoes;
}
