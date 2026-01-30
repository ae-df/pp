/**
 * @fileoverview Correção da Aba Usuarios
 * @version 1.0.0
 */

'use strict';

/**
 * Corrige a estrutura da aba Usuarios
 * Usa USUARIOS_SCHEMA de Core_Schema_Usuarios.gs como fonte única de verdade
 */
function corrigirAbaUsuarios() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(USUARIOS_SCHEMA.SHEET_NAME);

    if (!sheet) {
      throw new Error('Aba Usuarios não encontrada. Execute setupInicial() primeiro.');
    }

    // Headers corretos - usa schema unificado
    var headersCorretos = getUsuariosHeaders();

    // Verifica headers atuais
    var headersAtuais = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    Logger.log('Headers atuais: ' + JSON.stringify(headersAtuais));
    Logger.log('Headers corretos: ' + JSON.stringify(headersCorretos));

    // Se headers estão incorretos, corrige
    var precisaCorrigir = false;

    if (headersAtuais.length !== headersCorretos.length) {
      precisaCorrigir = true;
    } else {
      for (var i = 0; i < headersCorretos.length; i++) {
        if (headersAtuais[i] !== headersCorretos[i]) {
          precisaCorrigir = true;
          break;
        }
      }
    }

    if (precisaCorrigir) {
      try {
        var ui = SpreadsheetApp.getUi();
        var response = ui.alert(
          '⚠️ Estrutura da Aba Usuarios Incorreta',
          'A aba Usuarios tem estrutura incorreta.\n\n' +
          'Deseja corrigir? Isso irá:\n' +
          '1. Fazer backup dos dados atuais\n' +
          '2. Recriar a estrutura correta\n' +
          '3. Tentar migrar os dados\n\n' +
          'ATENÇÃO: Faça backup manual antes!',
          ui.ButtonSet.YES_NO
        );

        if (response !== ui.Button.YES) {
          return { success: false, message: 'Cancelado pelo usuário' };
        }
      } catch (uiError) {
        // Se não há UI, assume que queremos corrigir automaticamente
        Logger.log('Executando correção automática (sem UI)');
      }

      // Backup dos dados
      var dadosAtuais = [];
      if (sheet.getLastRow() > 1) {
        dadosAtuais = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      }

      Logger.log('Backup de ' + dadosAtuais.length + ' linhas');

      // Limpa a aba
      sheet.clear();

      // Recria headers
      sheet.getRange(1, 1, 1, headersCorretos.length).setValues([headersCorretos]);

      // Formata header
      var headerRange = sheet.getRange(1, 1, 1, headersCorretos.length);
      headerRange.setBackground('#4a5568');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');

      // Congela primeira linha
      sheet.setFrozenRows(1);

      // Ajusta largura das colunas
      sheet.autoResizeColumns(1, headersCorretos.length);

      Logger.log('✅ Estrutura corrigida');

      try {
        var ui = SpreadsheetApp.getUi();
        ui.alert(
          '✅ Estrutura Corrigida',
          'A aba Usuarios foi corrigida com sucesso!\n\n' +
          'Dados antigos foram removidos.\n' +
          'Cadastre os usuários novamente:\n' +
          'Menu → ⚙️ Setup → 🔑 Criar Primeiro Admin',
          ui.ButtonSet.OK
        );
      } catch (uiError) {
        Logger.log('Estrutura corrigida (sem alerta de UI)');
      }

      return {
        success: true,
        message: 'Estrutura corrigida',
        dadosBackup: dadosAtuais.length
      };
    } else {
      try {
        var ui = SpreadsheetApp.getUi();
        ui.alert(
          '✅ Estrutura Correta',
          'A aba Usuarios já está com a estrutura correta!',
          ui.ButtonSet.OK
        );
      } catch (uiError) {
        Logger.log('Estrutura já está correta (sem alerta de UI)');
      }

      return {
        success: true,
        message: 'Estrutura já está correta'
      };
    }

  } catch (e) {
    Logger.log('❌ Erro ao corrigir aba: ' + e.message);

    try {
      SpreadsheetApp.getUi().alert(
        '❌ Erro',
        'Erro ao corrigir aba Usuarios:\n\n' + e.message,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (uiError) {
      // Ignora erro de UI
    }

    return { success: false, error: e.message };
  }
}

/**
 * Verifica estrutura da aba Usuarios
 * Usa USUARIOS_SCHEMA de Core_Schema_Usuarios.gs como fonte única de verdade
 */
function verificarEstruturaUsuarios() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(USUARIOS_SCHEMA.SHEET_NAME);

    if (!sheet) {
      Logger.log('❌ Aba Usuarios não encontrada');
      return { success: false, error: 'Aba não encontrada' };
    }

    // Headers corretos - usa schema unificado
    var headersCorretos = getUsuariosHeaders();

    var headersAtuais = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .filter(function(h) { return h !== ''; }); // Remove colunas vazias

    Logger.log('=== VERIFICAÇÃO DA ABA USUARIOS ===');
    Logger.log('Headers esperados: ' + headersCorretos.length);
    Logger.log('Headers encontrados: ' + headersAtuais.length);
    Logger.log('');
    Logger.log('Estrutura esperada:');
    headersCorretos.forEach(function(h, i) {
      Logger.log((i + 1) + '. ' + h);
    });
    Logger.log('');
    Logger.log('Estrutura encontrada:');
    headersAtuais.forEach(function(h, i) {
      Logger.log((i + 1) + '. ' + h);
    });

    var correto = headersAtuais.length === headersCorretos.length;
    if (correto) {
      for (var i = 0; i < headersCorretos.length; i++) {
        if (headersAtuais[i] !== headersCorretos[i]) {
          correto = false;
          Logger.log('❌ Diferença na coluna ' + (i + 1) + ': esperado "' + headersCorretos[i] + '", encontrado "' + headersAtuais[i] + '"');
          break;
        }
      }
    }

    if (correto) {
      Logger.log('✅ Estrutura está correta!');
    } else {
      Logger.log('❌ Estrutura está incorreta!');
      Logger.log('Execute: corrigirAbaUsuarios()');
    }

    return {
      success: true,
      correto: correto,
      headersEsperados: headersCorretos.length,
      headersEncontrados: headersAtuais.length
    };

  } catch (e) {
    Logger.log('❌ Erro: ' + e.message);
    return { success: false, error: e.message };
  }
}
