/**
 * @fileoverview Dados Sintéticos para Testes - Sistema de Atesto
 *
 * Gera dados de teste para validar todas as funcionalidades do sistema
 * conforme regras de negócio do Manual de Análise Processual
 *
 * @version 4.0.0
 */

'use strict';

/**
 * Módulo de Dados Sintéticos
 */
var DadosSinteticos = (function() {

  // ============================================================================
  // DADOS BASE
  // ============================================================================

  var FORNECEDORES = [
    { nome: 'Distribuidora Alimentos Ltda', cnpj: '12.345.678/0001-90', tipo: 'COMERCIAL' },
    { nome: 'Cooperativa Agricultura Familiar', cnpj: '23.456.789/0001-01', tipo: 'AGRICULTURA_FAMILIAR' },
    { nome: 'Panificadora Central', cnpj: '34.567.890/0001-12', tipo: 'COMERCIAL' },
    { nome: 'Hortifruti do Campo', cnpj: '45.678.901/0001-23', tipo: 'AGRICULTURA_FAMILIAR' },
    { nome: 'Laticínios Planaltina', cnpj: '56.789.012/0001-34', tipo: 'COMERCIAL' }
  ];

  var UNIDADES_ESCOLARES = [
    { nome: 'EC 01 de Planaltina', codigo: 'EC01PL', cre: 'CRE-PP' },
    { nome: 'EC 02 de Planaltina', codigo: 'EC02PL', cre: 'CRE-PP' },
    { nome: 'CEF 01 de Planaltina', codigo: 'CEF01PL', cre: 'CRE-PP' },
    { nome: 'CED 01 de Planaltina', codigo: 'CED01PL', cre: 'CRE-PP' },
    { nome: 'CEI 01 de Planaltina', codigo: 'CEI01PL', cre: 'CRE-PP' }
  ];

  var PRODUTOS_PERECIVEIS = [
    { nome: 'Pão Francês', unidade: 'kg', conservacao: 'AMBIENTE', perCapita: 0.05 },
    { nome: 'Leite Integral', unidade: 'L', conservacao: 'REFRIGERADO', perCapita: 0.2 },
    { nome: 'Carne Bovina Moída', unidade: 'kg', conservacao: 'CONGELADO', perCapita: 0.08 },
    { nome: 'Frango em Pedaços', unidade: 'kg', conservacao: 'CONGELADO', perCapita: 0.1 },
    { nome: 'Alface Crespa', unidade: 'kg', conservacao: 'REFRIGERADO', perCapita: 0.03 }
  ];

  var RESPONSAVEIS = [
    { nome: 'Maria Silva', matricula: '123456', cargo: 'Diretor' },
    { nome: 'João Santos', matricula: '234567', cargo: 'Vice-Diretor' },
    { nome: 'Ana Oliveira', matricula: '345678', cargo: 'Supervisor' },
    { nome: 'Carlos Souza', matricula: '456789', cargo: 'Secretário' }
  ];

  // ============================================================================
  // GERADORES DE DADOS
  // ============================================================================

  /**
   * Gera número de nota fiscal aleatório
   */
  function gerarNumeroNF() {
    return String(Math.floor(Math.random() * 900000) + 100000);
  }

  /**
   * Gera chave de acesso NF-e válida (formato)
   */
  function gerarChaveAcessoNFe() {
    var uf = '53'; // DF
    var aamm = Utilities.formatDate(new Date(), 'GMT-3', 'yyMM');
    var cnpj = '12345678000190';
    var mod = '55';
    var serie = '001';
    var numero = String(Math.floor(Math.random() * 900000000) + 100000000);
    var tpEmis = '1';
    var cNF = String(Math.floor(Math.random() * 90000000) + 10000000);
    var cDV = String(Math.floor(Math.random() * 10));

    return uf + aamm + cnpj + mod + serie + numero + tpEmis + cNF + cDV;
  }

  /**
   * Gera data aleatória dentro de um período
   */
  function gerarDataAleatoria(diasAtras, diasFrente) {
    diasAtras = diasAtras || 30;
    diasFrente = diasFrente || 0;

    var hoje = new Date();
    var minDate = new Date(hoje.getTime() - (diasAtras * 24 * 60 * 60 * 1000));
    var maxDate = new Date(hoje.getTime() + (diasFrente * 24 * 60 * 60 * 1000));

    return new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));
  }

  /**
   * Gera hora aleatória dentro do horário comercial
   */
  function gerarHoraComercial(dentroHorario) {
    if (dentroHorario === false) {
      // Fora do horário: 06:00-07:59 ou 12:01-13:59 ou 18:01-20:00
      var opcoes = ['06', '07', '12', '13', '19', '20'];
      var hora = opcoes[Math.floor(Math.random() * opcoes.length)];
      var minuto = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      return hora + ':' + minuto;
    }

    // Dentro do horário: 08:00-12:00 ou 14:00-18:00
    var periodos = [
      { inicio: 8, fim: 12 },
      { inicio: 14, fim: 18 }
    ];
    var periodo = periodos[Math.floor(Math.random() * periodos.length)];
    var hora = String(periodo.inicio + Math.floor(Math.random() * (periodo.fim - periodo.inicio))).padStart(2, '0');
    var minuto = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return hora + ':' + minuto;
  }

  /**
   * Gera temperatura conforme tipo de conservação
   */
  function gerarTemperatura(tipoConservacao, conforme) {
    var limites = {
      'CONGELADO': { min: -18, max: -12, foraMin: -10, foraMax: -5 },
      'REFRIGERADO': { min: 0, max: 10, foraMin: 12, foraMax: 18 },
      'CARNE_RESFRIADA': { min: 0, max: 7, foraMin: 9, foraMax: 15 },
      'PESCADO_RESFRIADO': { min: 0, max: 3, foraMin: 5, foraMax: 10 }
    };

    var limite = limites[tipoConservacao] || limites['REFRIGERADO'];

    if (conforme === false) {
      return limite.foraMin + Math.random() * (limite.foraMax - limite.foraMin);
    }

    return limite.min + Math.random() * (limite.max - limite.min);
  }

  // ============================================================================
  // GERADORES DE OBJETOS COMPLETOS
  // ============================================================================

  /**
   * Gera nota fiscal sintética
   */
  function gerarNotaFiscal(opcoes) {
    opcoes = opcoes || {};

    var fornecedor = opcoes.fornecedor || FORNECEDORES[Math.floor(Math.random() * FORNECEDORES.length)];
    var dataEmissao = opcoes.dataEmissao || gerarDataAleatoria(15, 0);
    var valorTotal = opcoes.valorTotal || (Math.random() * 9000 + 1000);

    return {
      numeroNF: opcoes.numeroNF || gerarNumeroNF(),
      serie: opcoes.serie || '001',
      chaveAcesso: opcoes.chaveAcesso || gerarChaveAcessoNFe(),
      dataEmissao: dataEmissao,
      fornecedor: fornecedor.nome,
      cnpjFornecedor: fornecedor.cnpj,
      tipoFornecedor: fornecedor.tipo,
      valorTotal: Math.round(valorTotal * 100) / 100,
      notaEmpenho: opcoes.notaEmpenho || '2025NE' + String(Math.floor(Math.random() * 9000) + 1000),
      contrato: opcoes.contrato || 'CT-' + String(Math.floor(Math.random() * 900) + 100) + '/2025',
      status: opcoes.status || 'RECEBIDA'
    };
  }

  /**
   * Gera recebimento sintético
   */
  function gerarRecebimento(opcoes) {
    opcoes = opcoes || {};

    var unidade = opcoes.unidadeEscolar || UNIDADES_ESCOLARES[Math.floor(Math.random() * UNIDADES_ESCOLARES.length)];
    var responsavel = opcoes.responsavel || RESPONSAVEIS[Math.floor(Math.random() * RESPONSAVEIS.length)];
    var produto = opcoes.produto || PRODUTOS_PERECIVEIS[Math.floor(Math.random() * PRODUTOS_PERECIVEIS.length)];
    var dataEntrega = opcoes.dataEntrega || gerarDataAleatoria(7, 0);
    var conforme = opcoes.conforme !== false;

    return {
      unidadeEscolar: unidade.nome,
      codigoUE: unidade.codigo,
      cre: unidade.cre,
      dataEntrega: dataEntrega,
      horaEntrega: gerarHoraComercial(conforme),
      responsavel: responsavel.nome,
      matriculaResponsavel: responsavel.matricula,
      cargoResponsavel: responsavel.cargo,
      produto: produto.nome,
      tipoGenero: 'PERECIVEL',
      tipoConservacao: produto.conservacao,
      quantidade: opcoes.quantidade || Math.floor(Math.random() * 50) + 10,
      unidadeMedida: produto.unidade,
      temperaturaAferida: produto.conservacao !== 'AMBIENTE' ?
        Math.round(gerarTemperatura(produto.conservacao, conforme) * 10) / 10 : null,
      embalagemOk: conforme,
      validadeOk: conforme,
      rotulagemOk: conforme,
      atesto: {
        assinatura: true,
        matricula: responsavel.matricula,
        data: dataEntrega,
        identificacaoUE: conforme
      },
      status: conforme ? 'RECEBIDO_CONFORME' : 'RECEBIDO_PARCIAL'
    };
  }

  /**
   * Gera recusa sintética
   */
  function gerarRecusa(opcoes) {
    opcoes = opcoes || {};

    var motivos = [
      { codigo: 'TEMP_001', descricao: 'Temperatura inadequada', categoria: 'Temperatura' },
      { codigo: 'EMB_001', descricao: 'Embalagem violada', categoria: 'Embalagem' },
      { codigo: 'VAL_001', descricao: 'Produto vencido', categoria: 'Validade' },
      { codigo: 'QUAL_001', descricao: 'Características alteradas', categoria: 'Qualidade' }
    ];

    var motivo = opcoes.motivo || motivos[Math.floor(Math.random() * motivos.length)];
    var unidade = opcoes.unidadeEscolar || UNIDADES_ESCOLARES[Math.floor(Math.random() * UNIDADES_ESCOLARES.length)];
    var responsavel = opcoes.responsavel || RESPONSAVEIS[Math.floor(Math.random() * RESPONSAVEIS.length)];
    var fornecedor = opcoes.fornecedor || FORNECEDORES[Math.floor(Math.random() * FORNECEDORES.length)];
    var produto = opcoes.produto || PRODUTOS_PERECIVEIS[Math.floor(Math.random() * PRODUTOS_PERECIVEIS.length)];

    return {
      unidadeEscolar: unidade.nome,
      fornecedor: fornecedor.nome,
      cnpjFornecedor: fornecedor.cnpj,
      produto: produto.nome,
      quantidade: opcoes.quantidade || Math.floor(Math.random() * 20) + 5,
      unidadeMedida: produto.unidade,
      categoriaMotivo: motivo.categoria,
      motivoDetalhado: motivo.descricao,
      responsavelRecusa: responsavel.nome,
      matriculaResponsavel: responsavel.matricula,
      cargoResponsavel: responsavel.cargo,
      dataRecusa: opcoes.dataRecusa || new Date(),
      registradoNoTermo: true,
      fotoAnexada: Math.random() > 0.3,
      comunicadoUNIAE: true
    };
  }

  /**
   * Gera análise de comissão sintética
   */
  function gerarAnaliseComissao(opcoes) {
    opcoes = opcoes || {};

    var membros = [
      { nome: 'Ana Costa', matricula: '111111' },
      { nome: 'Bruno Lima', matricula: '222222' },
      { nome: 'Carla Dias', matricula: '333333' },
      { nome: 'Diego Alves', matricula: '444444' }
    ];

    var membrosPresentes = opcoes.membrosPresentes || membros.slice(0, 3 + Math.floor(Math.random() * 2));
    var conforme = opcoes.conforme !== false;

    return {
      membrosPresentes: membrosPresentes,
      dataAnalise: opcoes.dataAnalise || new Date(),
      dataRecebimentoDocs: opcoes.dataRecebimentoDocs || gerarDataAleatoria(5, 0),
      somaVerificada: conforme,
      somaConforme: conforme,
      atestoEscolarVerificado: conforme,
      atestoConforme: conforme,
      conformidadeNFVerificada: conforme,
      nfConforme: conforme,
      observacoesAnalisadas: true,
      sefazConsultada: conforme,
      resultadoSEFAZ: conforme ? 'AUTORIZADA' : 'PENDENTE',
      resultado: conforme ? 'APROVADO' : 'PENDENTE',
      processoSEI: '00080-00' + String(Math.floor(Math.random() * 900000) + 100000) + '/2025-00',
      numeroDespacho: conforme ? 'DESP-' + String(Math.floor(Math.random() * 9000) + 1000) : ''
    };
  }

  /**
   * Gera processo de atesto completo
   */
  function gerarProcessoAtesto(opcoes) {
    opcoes = opcoes || {};

    var nf = gerarNotaFiscal(opcoes.notaFiscal);
    var numEntregas = opcoes.numEntregas || Math.floor(Math.random() * 3) + 1;
    var entregas = [];

    for (var i = 0; i < numEntregas; i++) {
      entregas.push(gerarRecebimento({ conforme: opcoes.conforme }));
    }

    return {
      id: 'PROC_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      dataAbertura: nf.dataEmissao,
      notaFiscal: nf.numeroNF,
      chaveAcessoNFe: nf.chaveAcesso,
      dataEmissaoNF: nf.dataEmissao,
      fornecedor: nf.fornecedor,
      cnpjFornecedor: nf.cnpjFornecedor,
      valorTotal: nf.valorTotal,
      contrato: nf.contrato,
      notaEmpenho: nf.notaEmpenho,
      tipoGenero: 'PERECIVEL',
      entregas: entregas,
      recusas: opcoes.comRecusas ? [gerarRecusa()] : [],
      analiseComissao: opcoes.comAnalise ? gerarAnaliseComissao({ conforme: opcoes.conforme }) : null,
      status: opcoes.status || 'EM_ANALISE'
    };
  }

  // ============================================================================
  // INTERFACE PÚBLICA
  // ============================================================================

  return {
    // Dados base
    FORNECEDORES: FORNECEDORES,
    UNIDADES_ESCOLARES: UNIDADES_ESCOLARES,
    PRODUTOS_PERECIVEIS: PRODUTOS_PERECIVEIS,
    RESPONSAVEIS: RESPONSAVEIS,

    // Geradores simples
    gerarNumeroNF: gerarNumeroNF,
    gerarChaveAcessoNFe: gerarChaveAcessoNFe,
    gerarDataAleatoria: gerarDataAleatoria,
    gerarHoraComercial: gerarHoraComercial,
    gerarTemperatura: gerarTemperatura,

    // Geradores de objetos
    gerarNotaFiscal: gerarNotaFiscal,
    gerarRecebimento: gerarRecebimento,
    gerarRecusa: gerarRecusa,
    gerarAnaliseComissao: gerarAnaliseComissao,
    gerarProcessoAtesto: gerarProcessoAtesto
  };

})();


// ============================================================================
// FUNÇÕES DE TESTE PÚBLICAS
// ============================================================================

/**
 * Testa validação de recebimento com dados sintéticos
 */
function testarValidacaoRecebimento() {
  Logger.log('=== TESTE: Validação de Recebimento ===\n');

  // Teste 1: Recebimento conforme
  Logger.log('1. Recebimento CONFORME:');
  var recebimentoOk = DadosSinteticos.gerarRecebimento({ conforme: true });
  var resultadoOk = InputValidation.validarRecebimentoUE(recebimentoOk);
  Logger.log('   Válido: ' + resultadoOk.valido);
  Logger.log('   Erros: ' + resultadoOk.erros.length);
  Logger.log('   Avisos: ' + resultadoOk.avisos.length);

  // Teste 2: Recebimento não conforme
  Logger.log('\n2. Recebimento NÃO CONFORME:');
  var recebimentoNok = DadosSinteticos.gerarRecebimento({ conforme: false });
  var resultadoNok = InputValidation.validarRecebimentoUE(recebimentoNok);
  Logger.log('   Válido: ' + resultadoNok.valido);
  Logger.log('   Erros: ' + resultadoNok.erros.join('; '));
  Logger.log('   Avisos: ' + resultadoNok.avisos.join('; '));

  // Teste 3: Dados incompletos
  Logger.log('\n3. Dados INCOMPLETOS:');
  var resultadoIncompleto = InputValidation.validarRecebimentoUE({});
  Logger.log('   Válido: ' + resultadoIncompleto.valido);
  Logger.log('   Erros: ' + resultadoIncompleto.erros.length);

  Logger.log('\n=== FIM DO TESTE ===');
}

/**
 * Testa validação de nota fiscal com dados sintéticos
 */
function testarValidacaoNotaFiscal() {
  Logger.log('=== TESTE: Validação de Nota Fiscal ===\n');

  // Teste 1: NF válida
  Logger.log('1. Nota Fiscal VÁLIDA:');
  var nfOk = DadosSinteticos.gerarNotaFiscal();
  var resultadoOk = InputValidation.validarNotaFiscal(nfOk);
  Logger.log('   Válido: ' + resultadoOk.valido);
  Logger.log('   Número: ' + nfOk.numeroNF);
  Logger.log('   Fornecedor: ' + nfOk.fornecedor);
  Logger.log('   Valor: R$ ' + nfOk.valorTotal.toFixed(2));

  // Teste 2: NF sem CNPJ
  Logger.log('\n2. Nota Fiscal SEM CNPJ:');
  var nfSemCnpj = DadosSinteticos.gerarNotaFiscal();
  nfSemCnpj.cnpjFornecedor = null;
  var resultadoSemCnpj = InputValidation.validarNotaFiscal(nfSemCnpj);
  Logger.log('   Válido: ' + resultadoSemCnpj.valido);
  Logger.log('   Avisos: ' + resultadoSemCnpj.avisos.join('; '));

  // Teste 3: NF com CNPJ inválido
  Logger.log('\n3. Nota Fiscal com CNPJ INVÁLIDO:');
  var nfCnpjInvalido = DadosSinteticos.gerarNotaFiscal();
  nfCnpjInvalido.cnpjFornecedor = '11.111.111/1111-11';
  var resultadoCnpjInvalido = InputValidation.validarNotaFiscal(nfCnpjInvalido);
  Logger.log('   Válido: ' + resultadoCnpjInvalido.valido);
  Logger.log('   Erros: ' + resultadoCnpjInvalido.erros.join('; '));

  Logger.log('\n=== FIM DO TESTE ===');
}

/**
 * Testa validação de análise da comissão
 */
function testarValidacaoAnaliseComissao() {
  Logger.log('=== TESTE: Validação de Análise da Comissão ===\n');

  // Teste 1: Análise conforme
  Logger.log('1. Análise CONFORME:');
  var analiseOk = DadosSinteticos.gerarAnaliseComissao({ conforme: true });
  var resultadoOk = InputValidation.validarAnaliseComissao(analiseOk);
  Logger.log('   Válido: ' + resultadoOk.valido);
  Logger.log('   Membros: ' + analiseOk.membrosPresentes.length);
  Logger.log('   Resultado: ' + analiseOk.resultado);

  // Teste 2: Análise com poucos membros
  Logger.log('\n2. Análise com POUCOS MEMBROS:');
  var analisePoucosMembros = DadosSinteticos.gerarAnaliseComissao();
  analisePoucosMembros.membrosPresentes = [{ nome: 'Teste', matricula: '123' }];
  var resultadoPoucos = InputValidation.validarAnaliseComissao(analisePoucosMembros);
  Logger.log('   Válido: ' + resultadoPoucos.valido);
  Logger.log('   Erros: ' + resultadoPoucos.erros.join('; '));

  // Teste 3: Análise incompleta
  Logger.log('\n3. Análise INCOMPLETA:');
  var analiseIncompleta = DadosSinteticos.gerarAnaliseComissao();
  analiseIncompleta.somaVerificada = false;
  var resultadoIncompleta = InputValidation.validarAnaliseComissao(analiseIncompleta);
  Logger.log('   Válido: ' + resultadoIncompleta.valido);
  Logger.log('   Erros: ' + resultadoIncompleta.erros.join('; '));

  Logger.log('\n=== FIM DO TESTE ===');
}

/**
 * Testa validação de recusa
 */
function testarValidacaoRecusa() {
  Logger.log('=== TESTE: Validação de Recusa ===\n');

  // Teste 1: Recusa válida
  Logger.log('1. Recusa VÁLIDA:');
  var recusaOk = DadosSinteticos.gerarRecusa();
  var resultadoOk = InputValidation.validarRecusa(recusaOk);
  Logger.log('   Válido: ' + resultadoOk.valido);
  Logger.log('   Produto: ' + recusaOk.produto);
  Logger.log('   Motivo: ' + recusaOk.motivoDetalhado);

  // Teste 2: Recusa sem dados obrigatórios
  Logger.log('\n2. Recusa SEM DADOS:');
  var resultadoSemDados = InputValidation.validarRecusa({});
  Logger.log('   Válido: ' + resultadoSemDados.valido);
  Logger.log('   Erros: ' + resultadoSemDados.erros.length);

  Logger.log('\n=== FIM DO TESTE ===');
}

/**
 * Executa todos os testes de validação
 */
function executarTodosTestesValidacao() {
  Logger.log('╔════════════════════════════════════════════════════════════╗');
  Logger.log('║     TESTES DE VALIDAÇÃO - SISTEMA DE ATESTO v4.0.0         ║');
  Logger.log('╚════════════════════════════════════════════════════════════╝\n');

  testarValidacaoRecebimento();
  Logger.log('\n' + '─'.repeat(60) + '\n');

  testarValidacaoNotaFiscal();
  Logger.log('\n' + '─'.repeat(60) + '\n');

  testarValidacaoAnaliseComissao();
  Logger.log('\n' + '─'.repeat(60) + '\n');

  testarValidacaoRecusa();

  Logger.log('\n╔════════════════════════════════════════════════════════════╗');
  Logger.log('║                    TESTES CONCLUÍDOS                        ║');
  Logger.log('╚════════════════════════════════════════════════════════════╝');
}
