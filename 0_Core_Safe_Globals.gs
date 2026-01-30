/**
 * @fileoverview Definições Globais Seguras
 * @version 6.0.0
 *
 * Este arquivo DEVE ser carregado PRIMEIRO (prefixo _ ou 0_)
 * Define fallbacks para funções globais críticas.
 *
 * Resolve problemas de:
 * - AppLogger não definido
 * - getSheet não definido
 * - Contexto UI não disponível
 * - safeGet, ensureArray, assignWithDefault
 *
 * @author UNIAE CRE Team
 * @created 2025-12-04
 * @updated 2025-12-26
 */

'use strict';

// ============================================================================
// FALLBACK PARA APPLOGGER
// ============================================================================

/**
 * Logger global com fallback
 * Se AppLogger não estiver definido, usa Logger nativo
 */
if (typeof AppLogger === 'undefined') {
  var AppLogger = {
    log: function(msg, data) {
      Logger.log('[INFO] ' + msg + (data ? ' ' + JSON.stringify(data) : ''));
    },
    info: function(msg, data) {
      Logger.log('[INFO] ' + msg + (data ? ' ' + JSON.stringify(data) : ''));
    },
    warn: function(msg, data) {
      Logger.log('[WARN] ' + msg + (data ? ' ' + JSON.stringify(data) : ''));
    },
    error: function(msg, err) {
      var errMsg = err ? (err.message || String(err)) : '';
      Logger.log('[ERROR] ' + msg + (errMsg ? ': ' + errMsg : ''));
    },
    debug: function(msg, data) {
      // Debug silencioso em produção
      // Logger.log('[DEBUG] ' + msg);
    }
  };
}

// ============================================================================
// FALLBACK PARA GETSHEET
// ============================================================================

/**
 * Função getSheet com fallback
 * Se Core_Sheet_Accessor não estiver carregado, usa implementação básica
 */
if (typeof getSheet === 'undefined') {
  /**
   * Obtém uma aba da planilha
   * @param {string} sheetName - Nome da aba
   * @returns {Sheet}
   */
  function getSheet(sheetName) {
    // Tenta usar SCHEMA se disponível
    var realName = sheetName;
    if (typeof SCHEMA !== 'undefined' && SCHEMA.getSheetName) {
      realName = SCHEMA.getSheetName(sheetName);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error('Planilha não disponível');
    }

    var sheet = ss.getSheetByName(realName);

    // Tenta nome original se não encontrou
    if (!sheet && realName !== sheetName) {
      sheet = ss.getSheetByName(sheetName);
    }

    if (!sheet) {
      throw new Error('Aba não encontrada: ' + sheetName);
    }

    return sheet;
  }
}

// ============================================================================
// FUNÇÕES UI SEGURAS GLOBAIS
// ============================================================================

/**
 * Verifica se UI está disponível
 */
if (typeof isUiAvailable === 'undefined') {
  function isUiAvailable() {
    try {
      SpreadsheetApp.getUi();
      return true;
    } catch (e) {
      return false;
    }
  }
}

/**
 * Obtém UI de forma segura
 */
if (typeof getSafeUi === 'undefined') {
  function getSafeUi() {
    try {
      return SpreadsheetApp.getUi();
    } catch (e) {
      Logger.log('⚠️ UI não disponível no contexto atual');
      return null;
    }
  }
}

/**
 * Alerta seguro
 */
if (typeof safeAlert === 'undefined') {
  function safeAlert(title, message, buttonSet) {
    var ui = getSafeUi();
    if (ui) {
      try {
        return ui.alert(title, message, buttonSet || ui.ButtonSet.OK);
      } catch (e) {
        Logger.log('Erro ao exibir alerta: ' + e.message);
      }
    }
    Logger.log('📢 ALERTA: ' + title);
    Logger.log('   ' + message);
    return null;
  }
}

/**
 * Alias para compatibilidade com código existente
 */
if (typeof safeUiAlert === 'undefined') {
  function safeUiAlert(title, message, buttonSet) {
    return safeAlert(title, message, buttonSet);
  }
}

/**
 * Alias para getUiSafely
 */
if (typeof getUiSafely === 'undefined') {
  function getUiSafely() {
    return getSafeUi();
  }
}

/**
 * Toast seguro
 */
if (typeof safeToast === 'undefined') {
  function safeToast(message, title, timeout) {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (ss) {
        ss.toast(message, title || 'Aviso', timeout || 3);
        return true;
      }
    } catch (e) {
      Logger.log('📢 TOAST: ' + (title || '') + ' - ' + message);
    }
    return false;
  }
}

// ============================================================================
// UTILITÁRIOS GLOBAIS
// ============================================================================

/**
 * Acesso seguro a propriedades aninhadas de objetos
 * @param {Object} obj - Objeto fonte
 * @param {string} path - Caminho da propriedade (ex: 'user.name')
 * @param {*} [defaultValue] - Valor padrão se não encontrar
 * @returns {*} Valor encontrado ou defaultValue
 */
if (typeof safeGet === 'undefined') {
  function safeGet(obj, path, defaultValue) {
    if (obj === null || obj === undefined) return defaultValue;
    if (!path) return obj;
    
    var keys = path.split('.');
    var current = obj;
    
    for (var i = 0; i < keys.length; i++) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[keys[i]];
    }
    
    return current !== undefined ? current : defaultValue;
  }
}

/**
 * Garante que o valor seja um array
 * @param {*} value - Valor a verificar
 * @returns {Array} Array garantido
 */
if (typeof ensureArray === 'undefined') {
  function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  }
}

/**
 * Atribui valores com defaults
 * @param {Object} target - Objeto destino
 * @param {Object} defaults - Valores padrão
 * @returns {Object} Objeto mesclado
 */
if (typeof assignWithDefault === 'undefined') {
  function assignWithDefault(target, defaults) {
    target = target || {};
    defaults = defaults || {};
    
    var result = {};
    
    // Copia defaults primeiro
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        result[key] = defaults[key];
      }
    }
    
    // Sobrescreve com target
    for (var key in target) {
      if (target.hasOwnProperty(key) && target[key] !== undefined) {
        result[key] = target[key];
      }
    }
    
    return result;
  }
}

/**
 * Gera ID único
 */
if (typeof generateUniqueId === 'undefined') {
  function generateUniqueId(prefix) {
    prefix = prefix || 'ID';
    var timestamp = new Date().getTime().toString(36);
    var random = Math.random().toString(36).substring(2, 8);
    return prefix + '-' + timestamp + '-' + random;
  }
}

/**
 * Formata data para exibição
 */
if (typeof formatDate === 'undefined') {
  function formatDate(date, format) {
    if (!date) return '';
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date.getTime())) return '';

    format = format || 'dd/MM/yyyy';

    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}

/**
 * Valida CNPJ
 */
if (typeof validarCNPJ === 'undefined') {
  function validarCNPJ(cnpj) {
    if (!cnpj) return false;

    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');

    if (cnpj.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Validação dos dígitos verificadores
    var tamanho = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }
}

/**
 * Valida Email
 */
if (typeof validarEmail === 'undefined') {
  function validarEmail(email) {
    if (!email) return false;
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

/**
 * Formata valor monetário
 */
if (typeof formatarMoeda === 'undefined') {
  function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    var numero = parseFloat(valor);
    if (isNaN(numero)) return 'R$ 0,00';
    return 'R$ ' + numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

// ============================================================================
// REGISTRO DO MÓDULO
// ============================================================================

Logger.log('✅ Core_Safe_Globals carregado - Fallbacks disponíveis');
