/**
 * Test_Fixes.gs
 * Script para verificar as correções de erros do sistema
 */

function verificarCorrecoes() {
  console.log('=== INICIANDO VERIFICAÇÃO DE CORREÇÕES ===');

  // 1. Verificar Include Undefined
  console.log('\n1. Testando Include Undefined...');
  try {
    if (typeof include === 'function') {
      const result = include(undefined);
      if (result && result.includes('Erro: Nome do arquivo não definido')) {
        console.log('✅ Include undefined tratado corretamente');
      } else {
        console.error('❌ Falha no tratamento de include undefined');
      }

      const resultMissing = include('ArquivoInexistente');
      if (resultMissing && resultMissing.includes('não encontrado')) {
        console.log('✅ Include arquivo inexistente tratado corretamente');
      } else {
        console.error('❌ Falha no tratamento de arquivo inexistente');
      }
    } else {
      console.warn('⚠️ Função include não encontrada no escopo global');
    }
  } catch (e) {
    console.error('❌ Erro ao testar include:', e);
  }

  // 2. Verificar UI Context
  console.log('\n2. Testando UI Context...');
  try {
    if (typeof isUIContext === 'function') {
      const context = isUIContext();
      console.log(`ℹ️ Contexto UI atual: ${context}`);

      // Tentar chamar função que exige UI
      if (typeof mostrarDialogoConsultarNotas === 'function') {
        console.log('Tentando chamar mostrarDialogoConsultarNotas...');
        mostrarDialogoConsultarNotas();
        console.log('✅ Chamada protegida completada sem erro fatal');
      }
    } else {
      console.warn('⚠️ Função isUIContext não encontrada');
    }
  } catch (e) {
    console.error('❌ Erro ao testar UI Context:', e);
  }

  // 3. Verificar Busca Usuário Seguro
  console.log('\n3. Testando Busca Usuário Segura...');
  try {
    if (typeof _buscarUsuarioPorId === 'function') {
      const user = _buscarUsuarioPorId('ID_INEXISTENTE');
      if (user === null) {
        console.log('✅ Busca por ID inexistente retornou null corretamente');
      } else {
        console.error('❌ Busca por ID inexistente retornou:', user);
      }
    }

    if (typeof _buscarUsuarioPorEmail === 'function') {
      const user = _buscarUsuarioPorEmail('email@inexistente.com');
      if (user === null) {
        console.log('✅ Busca por Email inexistente retornou null corretamente');
      } else {
        console.error('❌ Busca por Email inexistente retornou:', user);
      }
    }
  } catch (e) {
    console.error('❌ Erro ao testar busca de usuário:', e);
  }

  // 4. Verificar Validação Operações
  console.log('\n4. Testando Validação Operações...');
  try {
    if (typeof registrarEntrega === 'function') {
      const resultado = registrarEntrega(null);
      if (resultado && resultado.sucesso === false && resultado.mensagem.includes('Dados da entrega não fornecidos')) {
        console.log('✅ Validação de dados nulos em registrarEntrega funcionou');
      } else {
        console.error('❌ Falha na validação de dados nulos:', resultado);
      }

      const resultadoIncompleto = registrarEntrega({});
      if (resultadoIncompleto && resultadoIncompleto.sucesso === false) {
        console.log('✅ Validação de dados incompletos funcionou');
      } else {
        console.error('❌ Falha na validação de dados incompletos:', resultadoIncompleto);
      }
    }
  } catch (e) {
    console.error('❌ Erro ao testar operações:', e);
  }

  console.log('\n=== VERIFICAÇÃO CONCLUÍDA ===');
}
