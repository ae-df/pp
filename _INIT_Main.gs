/**
 * @fileoverview Inicialização Principal do Sistema
 *
 * Ponto de entrada do aplicativo web.
 * SEMPRE começa pela tela de login.
 * Integrado com sistema de Bootstrap e Resiliência.
 *
 * @author UNIAE CRE Team
 * @version 3.0.0
 */

'use strict';

// ============================================================================
// FUNÇÃO PRINCIPAL - PONTO DE ENTRADA
// ============================================================================

/**
 * Função principal do Web App
 * Esta é a primeira função chamada quando alguém acessa o sistema
 *
 * @param {Object} e - Evento de requisição
 * @returns {HtmlOutput} Página HTML
 */
function doGet(e) {
  try {
    // Inicializa sistema se necessário
    if (typeof SystemInit !== 'undefined' && !SystemInit.isReady()) {
      SystemInit.initialize({ silent: true });
    }

    // Log com sistema unificado
    if (typeof UnifiedLogger !== 'undefined') {
      UnifiedLogger.log('Nova requisição', { params: e.parameter });
    } else {
      Logger.log('=== NOVA REQUISIÇÃO ===');
      Logger.log('Parâmetros: ' + JSON.stringify(e.parameter));
    }

    // Verificar se estrutura do banco existe
    if (!_verificarEstruturaBanco()) {
      return _servirPaginaSetup();
    }

    // Obter página solicitada
    var page = e.parameter ? (e.parameter.page || 'index') : 'index';

    // Se for página index ou raiz, servir o index.html principal
    if (page === 'index' || page === '' || !e.parameter || !e.parameter.page) {
      return _servirIndexPrincipal();
    }

    // Verificar autenticação para páginas protegidas
    if (page !== 'login' && page !== 'setup') {
      var sessaoId = e.parameter.sessao;

      // Usa sistema unificado de auth se disponível
      var sessaoValida = false;
      if (typeof UnifiedAuth !== 'undefined') {
        sessaoValida = !!UnifiedAuth.getSession(sessaoId);
      } else if (typeof verificarSessao === 'function') {
        sessaoValida = verificarSessao(sessaoId);
      }

      if (!sessaoId || !sessaoValida) {
        if (typeof UnifiedLogger !== 'undefined') {
          UnifiedLogger.warn('Sessão inválida, redirecionando para login');
        }
        return _servirIndexPrincipal();
      }
    }

    // Rotear para página apropriada
    return _rotearPagina(page, e.parameter);

  } catch (erro) {
    if (typeof UnifiedLogger !== 'undefined') {
      UnifiedLogger.error('Erro em doGet', erro);
    } else {
      Logger.log('Erro em doGet: ' + erro.message);
    }
    return _servirPaginaErro(erro);
  }
}

/**
 * Serve a página index.html principal
 * Interface moderna e unificada do sistema
 * @returns {HtmlOutput}
 */
function _servirIndexPrincipal() {
  try {
    return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('UNIAE - Sistema de Gestão de Alimentação Escolar')
      .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (erro) {
    Logger.log('Erro ao servir index.html: ' + erro.message);
    return _servirPaginaErro(erro);
  }
}

// ============================================================================
// ROTEAMENTO
// ============================================================================

/**
 * Roteia para a página apropriada
 * @private
 */
function _rotearPagina(page, params) {
  const rotas = {
    // Autenticação
    'login': _servirPaginaLogin,
    'setup': _servirPaginaSetup,

    // Dashboards por tipo de usuário
    'dashboard_analista': _servirDashboardAnalista,
    'dashboard_escola': _servirDashboardEscola,
    'dashboard_fornecedor': _servirDashboardFornecedor,
    'dashboard_nutricionista': _servirDashboardNutricionista,

    // Páginas genéricas
    'dashboard': _servirDashboardGenerico,
    'perfil': _servirPaginaPerfil,
    'ajuda': _servirPaginaAjuda
  };

  const handler = rotas[page] || _servirPagina404;
  return handler(params);
}

// ============================================================================
// PÁGINAS
// ============================================================================

/**
 * Serve página de login
 * @private
 */
function _servirPaginaLogin(mensagem) {
  try {
    const template = HtmlService.createTemplateFromFile('UI_Login_Mobile');

    if (mensagem) {
      template.mensagem = mensagem;
    }

    return template.evaluate()
      .setTitle('Login - UNIAE CRE')
      .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (erro) {
    Logger.log(`Erro ao servir login: ${erro.message}`);
    return HtmlService.createHtmlOutput(`
      <h1>Erro ao carregar login</h1>
      <p>${erro.message}</p>
    `);
  }
}

/**
 * Serve página de setup inicial
 * @private
 */
function _servirPaginaSetup() {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Setup - UNIAE CRE</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
          color: #4285f4;
          margin-bottom: 20px;
        }
        .btn {
          background: #4285f4;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          margin-top: 20px;
        }
        .btn:hover {
          background: #3367d6;
        }
        .status {
          margin-top: 20px;
          padding: 12px;
          border-radius: 4px;
          display: none;
        }
        .success {
          background: #e6f4ea;
          color: #1e8e3e;
        }
        .error {
          background: #fce8e6;
          color: #d93025;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 Setup Inicial</h1>
        <p>Bem-vindo ao Sistema UNIAE CRE!</p>
        <p>Clique no botão abaixo para criar a estrutura do banco de dados.</p>

        <button class="btn" onclick="executarSetup()">
          Criar Estrutura do Banco
        </button>

        <div id="status" class="status"></div>
      </div>

      <script>
        function executarSetup() {
          const btn = document.querySelector('.btn');
          const status = document.getElementById('status');

          btn.disabled = true;
          btn.textContent = 'Criando estrutura...';
          status.style.display = 'none';

          google.script.run
            .withSuccessHandler(function(resultado) {
              btn.disabled = false;
              btn.textContent = 'Estrutura Criada!';

              status.className = 'status success';
              status.textContent = 'Estrutura criada com sucesso! Redirecionando para login...';
              status.style.display = 'block';

              setTimeout(() => {
                window.location.href = '?page=login';
              }, 2000);
            })
            .withFailureHandler(function(erro) {
              btn.disabled = false;
              btn.textContent = 'Tentar Novamente';

              status.className = 'status error';
              status.textContent = 'Erro: ' + erro.message;
              status.style.display = 'block';
            })
            .criarEstruturaBancoDados();
        }
      </script>
    </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle('Setup - UNIAE CRE')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Serve dashboard do analista
 * @private
 */
function _servirDashboardAnalista(params) {
  return _servirDashboardAcessivel('Analista UNIAE', params);
}

/**
 * Serve dashboard da escola
 * @private
 */
function _servirDashboardEscola(params) {
  return _servirDashboardAcessivel('Representante Escolar', params);
}

/**
 * Serve dashboard do fornecedor
 * @private
 */
function _servirDashboardFornecedor(params) {
  return _servirDashboardAcessivel('Fornecedor', params);
}

/**
 * Serve dashboard do nutricionista
 * @private
 */
function _servirDashboardNutricionista(params) {
  return _servirDashboardAcessivel('Nutricionista', params);
}

/**
 * Serve dashboard acessível mobile-first
 * @private
 */
function _servirDashboardAcessivel(tipoUsuario, params) {
  try {
    const template = HtmlService.createTemplateFromFile('UI_Dashboard_Mobile_Acessivel');
    template.tipoUsuario = tipoUsuario;

    return template.evaluate()
      .setTitle('Dashboard - UNIAE CRE')
      .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (erro) {
    Logger.log(`Erro ao servir dashboard: ${erro.message}`);
    return _servirDashboardTemporario(tipoUsuario, params);
  }
}

/**
 * Dashboard temporário (placeholder)
 * @private
 */
function _servirDashboardTemporario(tipoUsuario, params) {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - UNIAE CRE</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
        }
        .header {
          background: #4285f4;
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h2 {
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header small {
          opacity: 0.9;
          font-size: 12px;
        }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
        }
        .welcome {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .welcome h1 {
          color: #202124;
          margin-bottom: 8px;
          font-size: 24px;
        }
        .welcome p {
          color: #5f6368;
          line-height: 1.6;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
          color: #5f6368;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .stat-card .value {
          color: #202124;
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .stat-card .label {
          color: #5f6368;
          font-size: 12px;
        }
        .info-card {
          background: #e8f0fe;
          border-left: 4px solid #4285f4;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .info-card h3 {
          color: #1967d2;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .info-card p {
          color: #3c4043;
          font-size: 14px;
          line-height: 1.6;
        }
        .example-items {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .example-items h3 {
          color: #202124;
          margin-bottom: 16px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e8eaed;
        }
        .item:last-child {
          border-bottom: none;
        }
        .item-name {
          color: #202124;
          font-weight: 500;
        }
        .item-details {
          color: #5f6368;
          font-size: 14px;
        }
        .item-price {
          color: #34a853;
          font-weight: 600;
        }
        .btn {
          background: #4285f4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .btn:hover {
          background: #3367d6;
        }
        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2>🍎 UNIAE CRE PP/Cruzeiro</h2>
          <small>${tipoUsuario}</small>
        </div>
        <button class="btn" onclick="fazerLogout()">Sair</button>
      </div>

      <div class="container">
        <div class="welcome">
          <h1>Bem-vindo ao Sistema de Gestão de Alimentação Escolar</h1>
          <p>Sistema em desenvolvimento para gerenciamento de notas fiscais e entregas de alimentos para as escolas da CRE PP/Cruzeiro.</p>
        </div>

        <div class="info-card">
          <h3>📊 Contexto Real - Alimentação Escolar SEDF</h3>
          <p>
            <strong>Valores médios por refeição (PNAE 2024):</strong><br>
            • Ensino Fundamental: R$ 0,50 por aluno/dia<br>
            • Ensino Integral: R$ 2,00 por aluno/dia<br>
            • Educação Infantil (Creche): R$ 1,32 por aluno/dia
          </p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <h3>Alunos Atendidos</h3>
            <div class="value">~450</div>
            <div class="label">Por escola (média)</div>
          </div>
          <div class="stat-card">
            <h3>Refeições/Dia</h3>
            <div class="value">900</div>
            <div class="label">Café + Almoço</div>
          </div>
          <div class="stat-card">
            <h3>Orçamento Mensal</h3>
            <div class="value">R$ 7.200</div>
            <div class="label">Por escola (média)</div>
          </div>
        </div>

        <div class="example-items">
          <h3>📦 Exemplo de Produtos Típicos (Valores Reais)</h3>
          <div class="item">
            <div>
              <div class="item-name">Arroz branco tipo 1</div>
              <div class="item-details">50kg - Uso diário</div>
            </div>
            <div class="item-price">R$ 4,50/kg</div>
          </div>
          <div class="item">
            <div>
              <div class="item-name">Feijão carioca tipo 1</div>
              <div class="item-details">30kg - Uso diário</div>
            </div>
            <div class="item-price">R$ 7,00/kg</div>
          </div>
          <div class="item">
            <div>
              <div class="item-name">Frango congelado</div>
              <div class="item-details">40kg - 3x por semana</div>
            </div>
            <div class="item-price">R$ 8,50/kg</div>
          </div>
          <div class="item">
            <div>
              <div class="item-name">Leite UHT integral</div>
              <div class="item-details">100L - Uso diário</div>
            </div>
            <div class="item-price">R$ 4,50/L</div>
          </div>
          <div class="item">
            <div>
              <div class="item-name">Banana prata</div>
              <div class="item-details">30kg - Uso diário</div>
            </div>
            <div class="item-price">R$ 4,50/kg</div>
          </div>
          <div class="item">
            <div>
              <div class="item-name">Pão francês</div>
              <div class="item-details">60kg - Uso diário</div>
            </div>
            <div class="item-price">R$ 12,00/kg</div>
          </div>
        </div>
      </div>

      <script>
        function fazerLogout() {
          const sessaoId = localStorage.getItem('sessao_id');

          google.script.run
            .withSuccessHandler(function() {
              localStorage.removeItem('sessao_id');
              localStorage.removeItem('usuario');
              window.location.href = '?page=login';
            })
            .fazerLogout(sessaoId);
        }
      </script>
    </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setTitle('Dashboard - UNIAE CRE')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Serve dashboard genérico
 * @private
 */
function _servirDashboardGenerico(params) {
  return _servirDashboardTemporario('Usuário', params);
}

/**
 * Serve página de perfil
 * @private
 */
function _servirPaginaPerfil(params) {
  return HtmlService.createHtmlOutput('<h1>Perfil</h1><p>Em desenvolvimento...</p>');
}

/**
 * Serve página de ajuda
 * @private
 */
function _servirPaginaAjuda(params) {
  return HtmlService.createHtmlOutput('<h1>Ajuda</h1><p>Em desenvolvimento...</p>');
}

/**
 * Serve página 404
 * @private
 */
function _servirPagina404() {
  return HtmlService.createHtmlOutput('<h1>404</h1><p>Página não encontrada</p>');
}

/**
 * Serve página de erro
 * @private
 */
function _servirPaginaErro(erro) {
  const html = `
    <h1>Erro</h1>
    <p>${erro.message}</p>
    <a href="?page=login">Voltar para login</a>
  `;
  return HtmlService.createHtmlOutput(html);
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Verifica se estrutura do banco existe
 * @private
 */
function _verificarEstruturaBanco() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('USR_Usuarios');
    return sheet !== null;
  } catch (erro) {
    return false;
  }
}

/**
 * Menu de administração do sistema (não usar como trigger principal)
 * Use onOpen() de Code.gs como trigger principal
 * @private
 */
function _init_createAdminMenu() {
  const ui = getUiSafely();
  if (!ui) return;

  ui.createMenu('🍎 UNIAE CRE')
    .addItem('🚀 Dashboard Rápido', 'abrirDashboardIntuitivo')
    .addItem('🌐 Abrir Sistema Web', 'abrirSistema')
    .addSeparator()
    .addSubMenu(ui.createMenu('⚡ Ações Rápidas')
      .addItem('➕ Nova Nota Fiscal', 'abrirNovaNFRapido')
      .addItem('🚚 Registrar Entrega', 'abrirEntregaRapido')
      .addItem('✅ Atestar NFs', 'abrirAtestarRapido'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Estrutura')
      .addItem('🆕 Criar Estrutura Nova', 'criarEstruturaBancoDados')
      .addItem('🔄 Atualizar Estrutura (Seguro)', 'atualizarEstruturaMenu')
      .addItem('✅ Verificar Integridade', 'verificarIntegridadeMenu')
      .addItem('📦 Migrar Dados Antigos', 'migrarDadosMenu'))
    .addSeparator()
    .addItem('👤 Cadastrar Usuário', 'abrirCadastroUsuario')
    .addItem('📊 Ver Auditoria', 'abrirAuditoria')
    .addSeparator()
    .addItem('🧹 Limpar Dados Teste', 'limparDadosTesteMenu')
    .addToUi();
}

/**
 * Abre o sistema
 */
function abrirSistema() {
  const url = ScriptApp.getService().getUrl();
  const html = `
    <script>
      window.open('${url}', '_blank');
      google.script.host.close();
    </script>
  `;

  safeShowModalDialog(
    HtmlService.createHtmlOutput(html),
    'Abrindo sistema...'
  );
}

/**
 * Verifica integridade via menu
 */
function verificarIntegridadeMenu() {
  const resultado = verificarIntegridadeEstrutura();

  if (resultado.success) {
    safeUiAlert('✅ Estrutura OK',
      `Todas as ${resultado.abasOK.length} abas estão corretas!`);
  } else {
    safeUiAlert('⚠️ Problemas Encontrados',
      `Abas faltando: ${resultado.abasFaltando.join(', ')}\n` +
      `Abas com problemas: ${resultado.abasComProblemas.join(', ')}`);
  }
}

/**
 * Abre cadastro de usuário
 */
function abrirCadastroUsuario() {
  try {
    var ui = getUiSafely();
    if (!ui) return;
    
    var html = HtmlService.createHtmlOutputFromFile('UI_CadastroUsuario')
      .setWidth(450)
      .setHeight(650)
      .setTitle('Cadastro de Usuário');
    
    ui.showModalDialog(html, 'Cadastro de Usuário');
  } catch (e) {
    Logger.log('Erro ao abrir cadastro: ' + e.message);
    safeUiAlert('Erro', 'Não foi possível abrir o cadastro: ' + e.message);
  }
}

/**
 * Abre auditoria
 */
function abrirAuditoria() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('AUD_Auditoria');

  if (sheet) {
    ss.setActiveSheet(sheet);
  } else {
    safeUiAlert('Aviso', 'Aba de auditoria não encontrada');
  }
}

/**
 * Atualiza estrutura via menu (SEGURO - não apaga dados)
 */
function atualizarEstruturaMenu() {
  const ui = getUiSafely();
  if (!ui) {
    Logger.log('UI não disponível para atualizarEstruturaMenu');
    return;
  }

  const confirmacao = ui.alert(
    '🔄 Atualizar Estrutura',
    'Esta operação é SEGURA e irá:\n\n' +
    '✅ Adicionar abas faltantes\n' +
    '✅ Adicionar colunas faltantes\n' +
    '✅ PRESERVAR todos os dados existentes\n\n' +
    'Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacao !== ui.Button.YES) {
    return;
  }

  try {
    ui.alert('⏳ Processando...',
      'Aguarde enquanto atualizamos a estrutura.',
      ui.ButtonSet.OK);

    const resultado = atualizarEstruturaSemPerderDados();

    let mensagem = '✅ Atualização concluída!\n\n';

    if (resultado.abasCriadas.length > 0) {
      mensagem += `📁 Abas criadas: ${resultado.abasCriadas.length}\n`;
      mensagem += resultado.abasCriadas.join(', ') + '\n\n';
    }

    if (resultado.colunasAdicionadas.length > 0) {
      mensagem += `➕ Colunas adicionadas: ${resultado.colunasAdicionadas.length}\n`;
      mensagem += resultado.colunasAdicionadas.slice(0, 5).join(', ');
      if (resultado.colunasAdicionadas.length > 5) {
        mensagem += `\n... e mais ${resultado.colunasAdicionadas.length - 5}`;
      }
      mensagem += '\n\n';
    }

    if (resultado.abasAtualizadas.length > 0) {
      mensagem += `🔄 Abas atualizadas: ${resultado.abasAtualizadas.length}\n`;
      mensagem += resultado.abasAtualizadas.join(', ') + '\n\n';
    }

    if (resultado.erros.length > 0) {
      mensagem += `⚠️ Erros: ${resultado.erros.length}\n`;
    }

    if (resultado.abasCriadas.length === 0 &&
        resultado.colunasAdicionadas.length === 0) {
      mensagem = '✅ Estrutura já está atualizada!\n\nNenhuma mudança necessária.';
    }

    ui.alert('Resultado', mensagem, ui.ButtonSet.OK);

  } catch (erro) {
    ui.alert('❌ Erro',
      `Erro ao atualizar estrutura:\n${erro.message}`,
      ui.ButtonSet.OK);
  }
}

/**
 * Migra dados antigos via menu
 */
function migrarDadosMenu() {
  const ui = getUiSafely();
  if (!ui) {
    Logger.log('UI não disponível para migrarDadosMenu');
    return;
  }

  const confirmacao = ui.alert(
    '📦 Migrar Dados Antigos',
    'Esta operação irá:\n\n' +
    '✅ Migrar dados de abas antigas\n' +
    '✅ Preservar dados originais\n' +
    '✅ Renomear abas antigas\n\n' +
    'Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacao !== ui.Button.YES) {
    return;
  }

  try {
    const resultado = migrarDadosAntigos();

    if (resultado.success) {
      ui.alert('✅ Migração Concluída',
        `${resultado.registrosMigrados} registros migrados com sucesso!`,
        ui.ButtonSet.OK);
    } else {
      ui.alert('⚠️ Aviso',
        'Nenhum dado antigo encontrado para migrar.',
        ui.ButtonSet.OK);
    }

  } catch (erro) {
    ui.alert('❌ Erro',
      `Erro na migração:\n${erro.message}`,
      ui.ButtonSet.OK);
  }
}

/**
 * Limpa dados de teste via menu
 */
function limparDadosTesteMenu() {
  const ui = getUiSafely();
  if (!ui) {
    Logger.log('UI não disponível para limparDadosTesteMenu');
    return;
  }

  const confirmacao = ui.alert(
    '⚠️ ATENÇÃO - OPERAÇÃO DESTRUTIVA',
    'Esta operação irá:\n\n' +
    '❌ APAGAR TODOS OS DADOS\n' +
    '✅ Manter estrutura (headers)\n' +
    '✅ Recriar usuário admin\n\n' +
    '🚨 ESTA AÇÃO NÃO PODE SER DESFEITA!\n\n' +
    'Tem certeza absoluta?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacao !== ui.Button.YES) {
    return;
  }

  // Segunda confirmação
  const confirmacao2 = ui.alert(
    '🚨 ÚLTIMA CONFIRMAÇÃO',
    'Você está prestes a APAGAR TODOS OS DADOS!\n\n' +
    'Digite SIM para confirmar:',
    ui.ButtonSet.OK_CANCEL
  );

  if (confirmacao2 !== ui.Button.OK) {
    return;
  }

  try {
    const resultado = limparDadosTeste();

    if (resultado.success) {
      ui.alert('✅ Dados Limpos',
        resultado.message,
        ui.ButtonSet.OK);
    }

  } catch (erro) {
    ui.alert('❌ Erro',
      `Erro ao limpar dados:\n${erro.message}`,
      ui.ButtonSet.OK);
  }
}
