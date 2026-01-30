/**
 * @fileoverview Dados Sintéticos Completos para Testes
 * @version 1.0.0
 * @description Cria dados de teste para todos os fluxos principais:
 * - Recusas de gêneros alimentícios
 * - Glosas
 * - Processos de Atesto
 * - Entregas
 * - Notas Fiscais
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-19
 */

'use strict';

// ============================================================================
// DADOS SINTÉTICOS - RECUSAS
// ============================================================================

/**
 * Motivos de recusa conforme Manual de Análise Processual
 */
var MOTIVOS_RECUSA_SINTETICOS = {
  DOCUMENTACAO: [
    'Nota fiscal com dados divergentes',
    'Ausência de certificado de qualidade',
    'Documentação incompleta do lote'
  ],
  TRANSPORTE: [
    'Temperatura inadequada durante transporte',
    'Veículo sem condições sanitárias',
    'Ausência de termógrafo'
  ],
  EMBALAGEM: [
    'Embalagem violada',
    'Embalagem amassada/danificada',
    'Rótulo ilegível ou ausente'
  ],
  QUALIDADE: [
    'Produto com aspecto alterado',
    'Odor desagradável',
    'Presença de corpo estranho',
    'Produto fora da especificação'
  ],
  VALIDADE: [
    'Produto vencido',
    'Validade inferior ao mínimo exigido',
    'Data de fabricação ilegível'
  ],
  QUANTIDADE: [
    'Quantidade inferior ao solicitado',
    'Peso abaixo do especificado'
  ]
};

/**
 * Dados sintéticos de Recusas para teste
 */
var RECUSAS_TESTE = [
  {
    id: 'REC-20251219-001',
    dataRecusa: new Date(2025, 11, 15),
    horaRecusa: '08:45:00',
    unidadeEscolar: 'EC 01 Plano Piloto',
    fornecedor: 'Hortifruti Central',
    cnpjFornecedor: '11.222.333/0001-44',
    notaFiscal: '000003',
    termoRecebimento: 'TR-2025-0015',
    produto: 'Leite Integral UHT',
    quantidade: 50,
    unidadeMedida: 'litros',
    lote: 'LT2025120501',
    validade: '15/03/2026',
    categoriaMotivo: 'TRANSPORTE',
    motivoDetalhado: 'Temperatura inadequada durante transporte - medição de 12°C quando deveria ser máximo 7°C',
    observacoes: 'Produto chegou com temperatura acima do permitido. Termômetro do veículo indicava 12°C.',
    fotoAnexada: 'Sim',
    linkFoto: '',
    responsavelRecusa: 'Maria Santos',
    matriculaResponsavel: '234567',
    cargoResponsavel: 'Diretora',
    comunicadoUNIAE: 'Sim',
    dataComunicacao: new Date(2025, 11, 15),
    comunicadoFornecedor: 'Sim',
    prazoSubstituicao: '24 horas',
    dataLimiteSubstituicao: new Date(2025, 11, 16),
    statusSubstituicao: 'Substituída no Prazo',
    status: 'Substituída',
    impactoAlimentacao: 'Não',
    acaoImediata: 'Utilizado estoque de reserva',
    registradoPor: 'escola@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 15)
  },
  {
    id: 'REC-20251219-002',
    dataRecusa: new Date(2025, 11, 16),
    horaRecusa: '10:30:00',
    unidadeEscolar: 'CEF 02 Taguatinga',
    fornecedor: 'Alimentos Brasil LTDA',
    cnpjFornecedor: '12.345.678/0001-99',
    notaFiscal: '000001',
    termoRecebimento: 'TR-2025-0018',
    produto: 'Carne Bovina Moída',
    quantidade: 30,
    unidadeMedida: 'kg',
    lote: 'CB2025121001',
    validade: '20/12/2025',
    categoriaMotivo: 'QUALIDADE',
    motivoDetalhado: 'Produto com aspecto alterado - coloração escurecida e odor desagradável',
    observacoes: 'Carne apresentava sinais de deterioração. Coloração marrom escura e odor forte.',
    fotoAnexada: 'Sim',
    linkFoto: '',
    responsavelRecusa: 'João Oliveira',
    matriculaResponsavel: '345678',
    cargoResponsavel: 'Diretor',
    comunicadoUNIAE: 'Sim',
    dataComunicacao: new Date(2025, 11, 16),
    comunicadoFornecedor: 'Sim',
    prazoSubstituicao: '24 horas',
    dataLimiteSubstituicao: new Date(2025, 11, 17),
    statusSubstituicao: 'Aguardando',
    status: 'Registrada',
    impactoAlimentacao: 'Sim',
    acaoImediata: 'Cardápio alternativo aplicado',
    registradoPor: 'escola2@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 16)
  },
  {
    id: 'REC-20251219-003',
    dataRecusa: new Date(2025, 11, 17),
    horaRecusa: '07:15:00',
    unidadeEscolar: 'EC 05 Ceilândia',
    fornecedor: 'Distribuidora de Alimentos XYZ',
    cnpjFornecedor: '98.765.432/0001-10',
    notaFiscal: '000002',
    termoRecebimento: 'TR-2025-0022',
    produto: 'Pão Francês',
    quantidade: 200,
    unidadeMedida: 'unidades',
    lote: 'PF2025121701',
    validade: '17/12/2025',
    categoriaMotivo: 'EMBALAGEM',
    motivoDetalhado: 'Embalagem violada - sacos plásticos rasgados expondo o produto',
    observacoes: 'Aproximadamente 40% dos pães estavam em embalagens violadas.',
    fotoAnexada: 'Sim',
    linkFoto: '',
    responsavelRecusa: 'Ana Paula Costa',
    matriculaResponsavel: '456789',
    cargoResponsavel: 'Vice-Diretora',
    comunicadoUNIAE: 'Sim',
    dataComunicacao: new Date(2025, 11, 17),
    comunicadoFornecedor: 'Pendente',
    prazoSubstituicao: '24 horas',
    dataLimiteSubstituicao: new Date(2025, 11, 18),
    statusSubstituicao: 'Aguardando',
    status: 'Registrada',
    impactoAlimentacao: 'Sim',
    acaoImediata: 'Solicitado pão de emergência à CRE',
    registradoPor: 'escola3@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 17)
  },
  {
    id: 'REC-20251219-004',
    dataRecusa: new Date(2025, 11, 18),
    horaRecusa: '09:00:00',
    unidadeEscolar: 'CED 01 Samambaia',
    fornecedor: 'Hortifruti Central',
    cnpjFornecedor: '11.222.333/0001-44',
    notaFiscal: '000004',
    termoRecebimento: 'TR-2025-0025',
    produto: 'Banana Prata',
    quantidade: 100,
    unidadeMedida: 'kg',
    lote: 'BP2025121501',
    validade: '22/12/2025',
    categoriaMotivo: 'QUALIDADE',
    motivoDetalhado: 'Frutas muito maduras - inadequadas para consumo nos próximos dias',
    observacoes: 'Bananas já apresentavam manchas escuras extensas. Prazo de consumo comprometido.',
    fotoAnexada: 'Sim',
    linkFoto: '',
    responsavelRecusa: 'Carlos Mendes',
    matriculaResponsavel: '567890',
    cargoResponsavel: 'Diretor',
    comunicadoUNIAE: 'Sim',
    dataComunicacao: new Date(2025, 11, 18),
    comunicadoFornecedor: 'Sim',
    prazoSubstituicao: '48 horas',
    dataLimiteSubstituicao: new Date(2025, 11, 20),
    statusSubstituicao: 'Substituída Fora do Prazo',
    status: 'Substituída',
    impactoAlimentacao: 'Não',
    acaoImediata: 'Substituída por maçã do estoque',
    registradoPor: 'escola4@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 18)
  },
  {
    id: 'REC-20251219-005',
    dataRecusa: new Date(2025, 11, 19),
    horaRecusa: '08:00:00',
    unidadeEscolar: 'EC 03 Gama',
    fornecedor: 'Alimentos Brasil LTDA',
    cnpjFornecedor: '12.345.678/0001-99',
    notaFiscal: '000005',
    termoRecebimento: 'TR-2025-0028',
    produto: 'Iogurte Natural',
    quantidade: 80,
    unidadeMedida: 'unidades',
    lote: 'IN2025121001',
    validade: '10/12/2025',
    categoriaMotivo: 'VALIDADE',
    motivoDetalhado: 'Produto vencido - data de validade 10/12/2025, entrega em 19/12/2025',
    observacoes: 'Lote inteiro com validade vencida há 9 dias.',
    fotoAnexada: 'Sim',
    linkFoto: '',
    responsavelRecusa: 'Fernanda Lima',
    matriculaResponsavel: '678901',
    cargoResponsavel: 'Diretora',
    comunicadoUNIAE: 'Sim',
    dataComunicacao: new Date(2025, 11, 19),
    comunicadoFornecedor: 'Sim',
    prazoSubstituicao: '24 horas',
    dataLimiteSubstituicao: new Date(2025, 11, 20),
    statusSubstituicao: 'Aguardando',
    status: 'Registrada',
    impactoAlimentacao: 'Sim',
    acaoImediata: 'Cardápio sem sobremesa láctea',
    registradoPor: 'escola5@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 19)
  }
];


// ============================================================================
// DADOS SINTÉTICOS - GLOSAS
// ============================================================================

/**
 * Motivos de glosa conforme Manual
 */
var MOTIVOS_GLOSA = [
  'Quantidade entregue inferior à faturada',
  'Produto em desacordo com especificação',
  'Preço unitário divergente do contrato',
  'Desconto por atraso na entrega',
  'Produto parcialmente recusado'
];

/**
 * Dados sintéticos de Glosas para teste
 */
var GLOSAS_TESTE = [
  {
    id: 'GLO-20251219-001',
    nfId: 'NF_001',
    numeroNF: '000001',
    fornecedor: 'Alimentos Brasil LTDA',
    cnpjFornecedor: '12.345.678/0001-99',
    valorNF: 15000.00,
    valorGlosa: 450.00,
    percentualGlosa: 3.0,
    motivo: 'Quantidade entregue inferior à faturada',
    descricaoDetalhada: 'Faturados 100kg de arroz, entregues apenas 85kg. Diferença de 15kg.',
    produto: 'Arroz Tipo 1',
    quantidadeFaturada: 100,
    quantidadeEntregue: 85,
    unidadeMedida: 'kg',
    precoUnitario: 30.00,
    valorDiferenca: 450.00,
    dataGlosa: new Date(2025, 11, 10),
    responsavel: 'Ana Paula Silva',
    matriculaResponsavel: '000.000.000-02',
    statusGlosa: 'Aplicada',
    contestacao: 'Não',
    dataContestacao: '',
    parecerContestacao: '',
    valorFinalNF: 14550.00,
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 10)
  },
  {
    id: 'GLO-20251219-002',
    nfId: 'NF_002',
    numeroNF: '000002',
    fornecedor: 'Distribuidora de Alimentos XYZ',
    cnpjFornecedor: '98.765.432/0001-10',
    valorNF: 8500.50,
    valorGlosa: 255.02,
    percentualGlosa: 3.0,
    motivo: 'Desconto por atraso na entrega',
    descricaoDetalhada: 'Entrega realizada com 2 dias de atraso. Aplicado desconto de 3% conforme contrato.',
    produto: 'Diversos',
    quantidadeFaturada: 0,
    quantidadeEntregue: 0,
    unidadeMedida: '',
    precoUnitario: 0,
    valorDiferenca: 255.02,
    dataGlosa: new Date(2025, 11, 12),
    responsavel: 'Ana Paula Silva',
    matriculaResponsavel: '000.000.000-02',
    statusGlosa: 'Aplicada',
    contestacao: 'Sim',
    dataContestacao: new Date(2025, 11, 14),
    parecerContestacao: 'Contestação indeferida - atraso comprovado por registro de entrega',
    valorFinalNF: 8245.48,
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 12)
  },
  {
    id: 'GLO-20251219-003',
    nfId: 'NF_003',
    numeroNF: '000003',
    fornecedor: 'Hortifruti Central',
    cnpjFornecedor: '11.222.333/0001-44',
    valorNF: 3200.00,
    valorGlosa: 160.00,
    percentualGlosa: 5.0,
    motivo: 'Produto parcialmente recusado',
    descricaoDetalhada: 'Recusa parcial de 50 litros de leite por temperatura inadequada. Vinculado à recusa REC-20251219-001.',
    produto: 'Leite Integral UHT',
    quantidadeFaturada: 200,
    quantidadeEntregue: 150,
    unidadeMedida: 'litros',
    precoUnitario: 3.20,
    valorDiferenca: 160.00,
    dataGlosa: new Date(2025, 11, 15),
    responsavel: 'Ana Paula Silva',
    matriculaResponsavel: '000.000.000-02',
    statusGlosa: 'Pendente Substituição',
    contestacao: 'Não',
    dataContestacao: '',
    parecerContestacao: '',
    valorFinalNF: 3040.00,
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 15)
  }
];

// ============================================================================
// DADOS SINTÉTICOS - PROCESSOS DE ATESTO
// ============================================================================

/**
 * Dados sintéticos de Processos de Atesto
 */
var PROCESSOS_ATESTO_TESTE = [
  {
    id: 'PAT-20251219-001',
    numeroSEI: '00080-00012345/2025-01',
    nfId: 'NF_001',
    numeroNF: '000001',
    fornecedor: 'Alimentos Brasil LTDA',
    valorNF: 15000.00,
    valorLiquido: 14550.00,
    status: 'EM_CONFERENCIA',
    etapaAtual: 'ETAPA_2_CONFERENCIA',
    dataAbertura: new Date(2025, 11, 5),
    dataFechamento: '',
    responsavel: 'Ana Paula Silva',
    
    // Etapa 1 - Recebimento
    statusRecebimento: 'CONCLUIDO',
    dataRecebimento: new Date(2025, 11, 5),
    responsavelRecebimento: 'Roberto Lima',
    
    // Etapa 2 - Conferência
    statusConferencia: 'EM_ANDAMENTO',
    dataInicioConferencia: new Date(2025, 11, 8),
    responsavelConferencia: 'Ana Paula Silva',
    itensConferidos: 20,
    itensTotal: 25,
    
    // Etapa 3 - Análise Documental
    statusAnalise: 'PENDENTE',
    dataAnalise: '',
    responsavelAnalise: '',
    
    // Etapa 4 - Atesto
    statusAtesto: 'PENDENTE',
    dataAtesto: '',
    responsavelAtesto: '',
    numeroDespacho: '',
    
    observacoes: 'Glosa aplicada por diferença de quantidade. Aguardando conclusão da conferência.',
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 5)
  },
  {
    id: 'PAT-20251219-002',
    numeroSEI: '00080-00012346/2025-02',
    nfId: 'NF_002',
    numeroNF: '000002',
    fornecedor: 'Distribuidora de Alimentos XYZ',
    valorNF: 8500.50,
    valorLiquido: 8245.48,
    status: 'CONCLUIDO',
    etapaAtual: 'FINALIZADO',
    dataAbertura: new Date(2025, 11, 3),
    dataFechamento: new Date(2025, 11, 15),
    responsavel: 'Ana Paula Silva',
    
    statusRecebimento: 'CONCLUIDO',
    dataRecebimento: new Date(2025, 11, 3),
    responsavelRecebimento: 'Maria Santos',
    
    statusConferencia: 'CONCLUIDO',
    dataInicioConferencia: new Date(2025, 11, 5),
    responsavelConferencia: 'Ana Paula Silva',
    itensConferidos: 15,
    itensTotal: 15,
    
    statusAnalise: 'CONCLUIDO',
    dataAnalise: new Date(2025, 11, 12),
    responsavelAnalise: 'Ana Paula Silva',
    
    statusAtesto: 'CONCLUIDO',
    dataAtesto: new Date(2025, 11, 15),
    responsavelAtesto: 'Administrador Sistema',
    numeroDespacho: 'DESP-2025-0089',
    
    observacoes: 'Processo concluído com glosa por atraso. Contestação indeferida.',
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 3)
  },
  {
    id: 'PAT-20251219-003',
    numeroSEI: '00080-00012347/2025-03',
    nfId: 'NF_003',
    numeroNF: '000003',
    fornecedor: 'Hortifruti Central',
    valorNF: 3200.00,
    valorLiquido: 3040.00,
    status: 'PENDENCIA_RECUSA',
    etapaAtual: 'ETAPA_1_RECEBIMENTO',
    dataAbertura: new Date(2025, 11, 15),
    dataFechamento: '',
    responsavel: 'Ana Paula Silva',
    
    statusRecebimento: 'PARCIAL',
    dataRecebimento: new Date(2025, 11, 15),
    responsavelRecebimento: 'Maria Santos',
    
    statusConferencia: 'PENDENTE',
    dataInicioConferencia: '',
    responsavelConferencia: '',
    itensConferidos: 0,
    itensTotal: 10,
    
    statusAnalise: 'PENDENTE',
    dataAnalise: '',
    responsavelAnalise: '',
    
    statusAtesto: 'PENDENTE',
    dataAtesto: '',
    responsavelAtesto: '',
    numeroDespacho: '',
    
    observacoes: 'Aguardando substituição de produto recusado (leite). Vinculado à recusa REC-20251219-001.',
    registradoPor: 'analista@uniae.gov.br',
    dataRegistro: new Date(2025, 11, 15)
  }
];


// ============================================================================
// DADOS SINTÉTICOS - ENTREGAS ADICIONAIS
// ============================================================================

/**
 * Dados sintéticos de Entregas expandidos
 */
var ENTREGAS_TESTE_COMPLETO = [
  {
    id: 'ENT_001',
    notaFiscalId: 'NF_003',
    numeroNF: '000003',
    fornecedor: 'Hortifruti Central',
    unidadeEscolar: 'EC 01 Plano Piloto',
    dataEntrega: new Date(2025, 11, 5),
    horaEntrega: '09:30',
    responsavelRecebimento: 'Roberto Lima',
    matriculaResponsavel: '123456',
    quantidadeVolumes: 8,
    temperaturaAdequada: true,
    embalagemIntegra: true,
    documentacaoOk: true,
    status: 'ENTREGUE',
    usuarioRegistro: 'escola@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 5)
  },
  {
    id: 'ENT_002',
    notaFiscalId: 'NF_001',
    numeroNF: '000001',
    fornecedor: 'Alimentos Brasil LTDA',
    unidadeEscolar: 'CEF 02 Taguatinga',
    dataEntrega: new Date(2025, 11, 6),
    horaEntrega: '08:15',
    responsavelRecebimento: 'João Oliveira',
    matriculaResponsavel: '345678',
    quantidadeVolumes: 15,
    temperaturaAdequada: true,
    embalagemIntegra: true,
    documentacaoOk: true,
    status: 'ENTREGUE',
    usuarioRegistro: 'escola2@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 6)
  },
  {
    id: 'ENT_003',
    notaFiscalId: 'NF_002',
    numeroNF: '000002',
    fornecedor: 'Distribuidora de Alimentos XYZ',
    unidadeEscolar: 'EC 05 Ceilândia',
    dataEntrega: new Date(2025, 11, 4),
    horaEntrega: '10:00',
    responsavelRecebimento: 'Ana Paula Costa',
    matriculaResponsavel: '456789',
    quantidadeVolumes: 12,
    temperaturaAdequada: true,
    embalagemIntegra: false,
    documentacaoOk: true,
    status: 'ENTREGUE_COM_RESSALVA',
    usuarioRegistro: 'escola3@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 4),
    observacoes: 'Algumas embalagens amassadas, porém produto íntegro'
  },
  {
    id: 'ENT_004',
    notaFiscalId: 'NF_003',
    numeroNF: '000003',
    fornecedor: 'Hortifruti Central',
    unidadeEscolar: 'EC 01 Plano Piloto',
    dataEntrega: new Date(2025, 11, 15),
    horaEntrega: '08:45',
    responsavelRecebimento: 'Maria Santos',
    matriculaResponsavel: '234567',
    quantidadeVolumes: 5,
    temperaturaAdequada: false,
    embalagemIntegra: true,
    documentacaoOk: true,
    status: 'PARCIALMENTE_RECUSADA',
    usuarioRegistro: 'escola@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 15),
    observacoes: 'Leite recusado por temperatura inadequada. Demais itens aceitos.',
    recusaVinculada: 'REC-20251219-001'
  },
  {
    id: 'ENT_005',
    notaFiscalId: 'NF_001',
    numeroNF: '000001',
    fornecedor: 'Alimentos Brasil LTDA',
    unidadeEscolar: 'CEF 02 Taguatinga',
    dataEntrega: new Date(2025, 11, 16),
    horaEntrega: '10:30',
    responsavelRecebimento: 'João Oliveira',
    matriculaResponsavel: '345678',
    quantidadeVolumes: 3,
    temperaturaAdequada: false,
    embalagemIntegra: true,
    documentacaoOk: true,
    status: 'RECUSADA',
    usuarioRegistro: 'escola2@seedf.gov.br',
    dataRegistro: new Date(2025, 11, 16),
    observacoes: 'Carne com sinais de deterioração. Recusa total do lote.',
    recusaVinculada: 'REC-20251219-002'
  }
];

// ============================================================================
// FUNÇÕES DE SETUP
// ============================================================================

/**
 * Headers da planilha Recusas (formato completo)
 */
var RECUSAS_HEADERS = [
  'ID', 'Data Recusa', 'Hora Recusa', 'Unidade Escolar', 'Fornecedor', 'CNPJ Fornecedor',
  'Nota Fiscal', 'Termo Recebimento', 'Produto', 'Quantidade', 'Unidade Medida',
  'Lote', 'Validade', 'Categoria Motivo', 'Motivo Detalhado', 'Observações',
  'Foto Anexada', 'Link Foto', 'Responsável Recusa', 'Matrícula Responsável',
  'Cargo Responsável', 'Comunicado UNIAE', 'Data Comunicação', 'Comunicado Fornecedor',
  'Prazo Substituição', 'Data Limite Substituição', 'Status Substituição', 'Status',
  'Impacto Alimentação', 'Ação Imediata', 'Registrado Por', 'Data Registro'
];

/**
 * Headers da planilha Glosas
 */
var GLOSAS_HEADERS = [
  'ID', 'NF_ID', 'Numero_NF', 'Fornecedor', 'CNPJ_Fornecedor', 'Valor_NF',
  'Valor_Glosa', 'Percentual_Glosa', 'Motivo', 'Descricao_Detalhada',
  'Produto', 'Qtd_Faturada', 'Qtd_Entregue', 'Unidade_Medida', 'Preco_Unitario',
  'Valor_Diferenca', 'Data_Glosa', 'Responsavel', 'Matricula_Responsavel',
  'Status_Glosa', 'Contestacao', 'Data_Contestacao', 'Parecer_Contestacao',
  'Valor_Final_NF', 'Registrado_Por', 'Data_Registro'
];

/**
 * Headers da planilha Processos_Atesto
 */
var PROCESSOS_ATESTO_HEADERS = [
  'ID', 'Numero_SEI', 'NF_ID', 'Numero_NF', 'Fornecedor', 'Valor_NF', 'Valor_Liquido',
  'Status', 'Etapa_Atual', 'Data_Abertura', 'Data_Fechamento', 'Responsavel',
  'Status_Recebimento', 'Data_Recebimento', 'Responsavel_Recebimento',
  'Status_Conferencia', 'Data_Inicio_Conferencia', 'Responsavel_Conferencia',
  'Itens_Conferidos', 'Itens_Total',
  'Status_Analise', 'Data_Analise', 'Responsavel_Analise',
  'Status_Atesto', 'Data_Atesto', 'Responsavel_Atesto', 'Numero_Despacho',
  'Observacoes', 'Registrado_Por', 'Data_Registro'
];

/**
 * Configura planilha de Recusas com dados de teste
 */
function setupRecusasTeste() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('SETUP: Configurando Recusas de Teste');
  Logger.log('═══════════════════════════════════════════════');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Recusas');
  
  if (!sheet) {
    sheet = ss.insertSheet('Recusas');
    Logger.log('Planilha Recusas criada');
  }
  
  // Limpa dados existentes
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  // Define headers
  sheet.getRange(1, 1, 1, RECUSAS_HEADERS.length).setValues([RECUSAS_HEADERS]);
  sheet.getRange(1, 1, 1, RECUSAS_HEADERS.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, RECUSAS_HEADERS.length).setBackground('#cc0000');
  sheet.getRange(1, 1, 1, RECUSAS_HEADERS.length).setFontColor('white');
  
  // Mapeia dados para linha
  var dados = RECUSAS_TESTE.map(function(r) {
    return [
      r.id, r.dataRecusa, r.horaRecusa, r.unidadeEscolar, r.fornecedor, r.cnpjFornecedor,
      r.notaFiscal, r.termoRecebimento, r.produto, r.quantidade, r.unidadeMedida,
      r.lote, r.validade, r.categoriaMotivo, r.motivoDetalhado, r.observacoes,
      r.fotoAnexada, r.linkFoto, r.responsavelRecusa, r.matriculaResponsavel,
      r.cargoResponsavel, r.comunicadoUNIAE, r.dataComunicacao, r.comunicadoFornecedor,
      r.prazoSubstituicao, r.dataLimiteSubstituicao, r.statusSubstituicao, r.status,
      r.impactoAlimentacao, r.acaoImediata, r.registradoPor, r.dataRegistro
    ];
  });
  
  sheet.getRange(2, 1, dados.length, RECUSAS_HEADERS.length).setValues(dados);
  sheet.autoResizeColumns(1, RECUSAS_HEADERS.length);
  
  Logger.log('✅ ' + RECUSAS_TESTE.length + ' recusas criadas');
  Logger.log('');
  Logger.log('📋 RECUSAS DE TESTE:');
  RECUSAS_TESTE.forEach(function(r) {
    Logger.log('   ' + r.id + ' - ' + r.produto + ' (' + r.status + ')');
  });
  
  return {
    success: true,
    message: RECUSAS_TESTE.length + ' recusas criadas',
    recusas: RECUSAS_TESTE.length
  };
}

/**
 * Configura planilha de Glosas com dados de teste
 */
function setupGlosasTeste() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('SETUP: Configurando Glosas de Teste');
  Logger.log('═══════════════════════════════════════════════');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Glosas');
  
  if (!sheet) {
    sheet = ss.insertSheet('Glosas');
    Logger.log('Planilha Glosas criada');
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  sheet.getRange(1, 1, 1, GLOSAS_HEADERS.length).setValues([GLOSAS_HEADERS]);
  sheet.getRange(1, 1, 1, GLOSAS_HEADERS.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, GLOSAS_HEADERS.length).setBackground('#ff9900');
  sheet.getRange(1, 1, 1, GLOSAS_HEADERS.length).setFontColor('white');
  
  var dados = GLOSAS_TESTE.map(function(g) {
    return [
      g.id, g.nfId, g.numeroNF, g.fornecedor, g.cnpjFornecedor, g.valorNF,
      g.valorGlosa, g.percentualGlosa, g.motivo, g.descricaoDetalhada,
      g.produto, g.quantidadeFaturada, g.quantidadeEntregue, g.unidadeMedida, g.precoUnitario,
      g.valorDiferenca, g.dataGlosa, g.responsavel, g.matriculaResponsavel,
      g.statusGlosa, g.contestacao, g.dataContestacao, g.parecerContestacao,
      g.valorFinalNF, g.registradoPor, g.dataRegistro
    ];
  });
  
  sheet.getRange(2, 1, dados.length, GLOSAS_HEADERS.length).setValues(dados);
  sheet.autoResizeColumns(1, GLOSAS_HEADERS.length);
  
  Logger.log('✅ ' + GLOSAS_TESTE.length + ' glosas criadas');
  
  return {
    success: true,
    message: GLOSAS_TESTE.length + ' glosas criadas'
  };
}

/**
 * Configura planilha de Processos de Atesto com dados de teste
 */
function setupProcessosAtestoTeste() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('SETUP: Configurando Processos de Atesto');
  Logger.log('═══════════════════════════════════════════════');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Processos_Atesto');
  
  if (!sheet) {
    sheet = ss.insertSheet('Processos_Atesto');
    Logger.log('Planilha Processos_Atesto criada');
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  sheet.getRange(1, 1, 1, PROCESSOS_ATESTO_HEADERS.length).setValues([PROCESSOS_ATESTO_HEADERS]);
  sheet.getRange(1, 1, 1, PROCESSOS_ATESTO_HEADERS.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, PROCESSOS_ATESTO_HEADERS.length).setBackground('#9900ff');
  sheet.getRange(1, 1, 1, PROCESSOS_ATESTO_HEADERS.length).setFontColor('white');
  
  var dados = PROCESSOS_ATESTO_TESTE.map(function(p) {
    return [
      p.id, p.numeroSEI, p.nfId, p.numeroNF, p.fornecedor, p.valorNF, p.valorLiquido,
      p.status, p.etapaAtual, p.dataAbertura, p.dataFechamento, p.responsavel,
      p.statusRecebimento, p.dataRecebimento, p.responsavelRecebimento,
      p.statusConferencia, p.dataInicioConferencia, p.responsavelConferencia,
      p.itensConferidos, p.itensTotal,
      p.statusAnalise, p.dataAnalise, p.responsavelAnalise,
      p.statusAtesto, p.dataAtesto, p.responsavelAtesto, p.numeroDespacho,
      p.observacoes, p.registradoPor, p.dataRegistro
    ];
  });
  
  sheet.getRange(2, 1, dados.length, PROCESSOS_ATESTO_HEADERS.length).setValues(dados);
  sheet.autoResizeColumns(1, PROCESSOS_ATESTO_HEADERS.length);
  
  Logger.log('✅ ' + PROCESSOS_ATESTO_TESTE.length + ' processos de atesto criados');
  
  return {
    popular: {
      sucesso: true,
      registrosInseridos: PROCESSOS_ATESTO_TESTE.length,
      message: PROCESSOS_ATESTO_TESTE.length + ' processos criados'
    }
  };
}

/**
 * Configura planilha de Entregas expandida
 */
function setupEntregasCompletoTeste() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('SETUP: Configurando Entregas Completas');
  Logger.log('═══════════════════════════════════════════════');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Entregas');
  
  if (!sheet) {
    sheet = ss.insertSheet('Entregas');
    Logger.log('Planilha Entregas criada');
  }
  
  var headers = [
    'id', 'nota_fiscal_id', 'numero_nf', 'fornecedor', 'unidade_escolar',
    'data_entrega', 'hora_entrega', 'responsavel_recebimento', 'matricula_responsavel',
    'quantidade_volumes', 'temperatura_adequada', 'embalagem_integra', 'documentacao_ok',
    'status', 'usuario_registro', 'data_registro', 'observacoes', 'recusa_vinculada'
  ];
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#e69138');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
  
  var dados = ENTREGAS_TESTE_COMPLETO.map(function(e) {
    return [
      e.id, e.notaFiscalId, e.numeroNF, e.fornecedor, e.unidadeEscolar,
      e.dataEntrega, e.horaEntrega, e.responsavelRecebimento, e.matriculaResponsavel,
      e.quantidadeVolumes, e.temperaturaAdequada, e.embalagemIntegra, e.documentacaoOk,
      e.status, e.usuarioRegistro, e.dataRegistro, e.observacoes || '', e.recusaVinculada || ''
    ];
  });
  
  sheet.getRange(2, 1, dados.length, headers.length).setValues(dados);
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log('✅ ' + ENTREGAS_TESTE_COMPLETO.length + ' entregas criadas');
  
  return {
    success: true,
    message: ENTREGAS_TESTE_COMPLETO.length + ' entregas criadas'
  };
}


// ============================================================================
// SETUP COMPLETO - TODOS OS DADOS SINTÉTICOS
// ============================================================================

/**
 * Executa setup completo de todos os dados sintéticos para teste
 * Inclui: Recusas, Glosas, Processos de Atesto, Entregas
 */
function setupDadosSinteticosCompleto() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     SETUP COMPLETO DE DADOS SINTÉTICOS                           ║');
  Logger.log('║     Sistema UNIAE CRE - Dados para Teste de Fluxos               ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var resultados = {
    recusas: null,
    glosas: null,
    processosAtesto: null,
    entregas: null
  };
  
  try {
    // 1. Setup Recusas
    resultados.recusas = setupRecusasTeste();
    
    // 2. Setup Glosas
    resultados.glosas = setupGlosasTeste();
    
    // 3. Setup Processos de Atesto
    resultados.processosAtesto = setupProcessosAtestoTeste();
    
    // 4. Setup Entregas Completas
    resultados.entregas = setupEntregasCompletoTeste();
    
    Logger.log('');
    Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
    Logger.log('║     SETUP CONCLUÍDO COM SUCESSO                                  ║');
    Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
    Logger.log('║ ✅ Recusas: ' + RECUSAS_TESTE.length + ' registros');
    Logger.log('║    - 2 substituídas (1 no prazo, 1 fora)');
    Logger.log('║    - 3 aguardando substituição');
    Logger.log('║    - Motivos: Transporte, Qualidade, Embalagem, Validade');
    Logger.log('║');
    Logger.log('║ ✅ Glosas: ' + GLOSAS_TESTE.length + ' registros');
    Logger.log('║    - 2 aplicadas');
    Logger.log('║    - 1 pendente substituição');
    Logger.log('║    - 1 com contestação indeferida');
    Logger.log('║');
    Logger.log('║ ✅ Processos de Atesto: ' + PROCESSOS_ATESTO_TESTE.length + ' registros');
    Logger.log('║    - 1 em conferência');
    Logger.log('║    - 1 concluído');
    Logger.log('║    - 1 com pendência de recusa');
    Logger.log('║');
    Logger.log('║ ✅ Entregas: ' + ENTREGAS_TESTE_COMPLETO.length + ' registros');
    Logger.log('║    - 2 entregues OK');
    Logger.log('║    - 1 com ressalva');
    Logger.log('║    - 1 parcialmente recusada');
    Logger.log('║    - 1 totalmente recusada');
    Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
    Logger.log('');
    Logger.log('🔗 VÍNCULOS ENTRE DADOS:');
    Logger.log('   REC-20251219-001 → ENT_004 → NF_003 → PAT-20251219-003 → GLO-20251219-003');
    Logger.log('   REC-20251219-002 → ENT_005 → NF_001 → PAT-20251219-001 → GLO-20251219-001');
    Logger.log('');
    Logger.log('📊 CENÁRIOS DE TESTE DISPONÍVEIS:');
    Logger.log('   1. Fluxo completo de recusa com substituição no prazo');
    Logger.log('   2. Fluxo de recusa com substituição fora do prazo');
    Logger.log('   3. Recusa aguardando substituição');
    Logger.log('   4. Glosa por quantidade divergente');
    Logger.log('   5. Glosa por atraso com contestação');
    Logger.log('   6. Processo de atesto em andamento');
    Logger.log('   7. Processo de atesto concluído');
    Logger.log('   8. Processo bloqueado por recusa pendente');
    Logger.log('');
    
    return {
      success: true,
      message: 'Setup completo realizado',
      totais: {
        recusas: RECUSAS_TESTE.length,
        glosas: GLOSAS_TESTE.length,
        processosAtesto: PROCESSOS_ATESTO_TESTE.length,
        entregas: ENTREGAS_TESTE_COMPLETO.length
      }
    };
    
  } catch (e) {
    Logger.log('❌ ERRO no setup: ' + e.message);
    return {
      success: false,
      error: e.message,
      resultados: resultados
    };
  }
}

/**
 * Limpa todos os dados sintéticos (mantém estrutura)
 */
function limparDadosSinteticos() {
  Logger.log('Limpando dados sintéticos...');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var planilhas = ['Recusas', 'Glosas', 'Processos_Atesto', 'Entregas'];
  
  planilhas.forEach(function(nome) {
    var sheet = ss.getSheetByName(nome);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
      Logger.log('✅ ' + nome + ' limpa');
    }
  });
  
  Logger.log('Dados sintéticos removidos.');
  return { success: true };
}

/**
 * Verifica integridade dos dados sintéticos
 */
function verificarDadosSinteticos() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════');
  Logger.log('VERIFICAÇÃO DE DADOS SINTÉTICOS');
  Logger.log('═══════════════════════════════════════════════');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resultado = {
    recusas: 0,
    glosas: 0,
    processosAtesto: 0,
    entregas: 0,
    problemas: []
  };
  
  // Verifica Recusas
  var recusasSheet = ss.getSheetByName('Recusas');
  if (recusasSheet) {
    resultado.recusas = Math.max(0, recusasSheet.getLastRow() - 1);
  } else {
    resultado.problemas.push('Planilha Recusas não encontrada');
  }
  
  // Verifica Glosas
  var glosasSheet = ss.getSheetByName('Glosas');
  if (glosasSheet) {
    resultado.glosas = Math.max(0, glosasSheet.getLastRow() - 1);
  } else {
    resultado.problemas.push('Planilha Glosas não encontrada');
  }
  
  // Verifica Processos de Atesto
  var atestosSheet = ss.getSheetByName('Processos_Atesto');
  if (atestosSheet) {
    resultado.processosAtesto = Math.max(0, atestosSheet.getLastRow() - 1);
  } else {
    resultado.problemas.push('Planilha Processos_Atesto não encontrada');
  }
  
  // Verifica Entregas
  var entregasSheet = ss.getSheetByName('Entregas');
  if (entregasSheet) {
    resultado.entregas = Math.max(0, entregasSheet.getLastRow() - 1);
  } else {
    resultado.problemas.push('Planilha Entregas não encontrada');
  }
  
  Logger.log('');
  Logger.log('📊 CONTAGEM DE REGISTROS:');
  Logger.log('   Recusas: ' + resultado.recusas);
  Logger.log('   Glosas: ' + resultado.glosas);
  Logger.log('   Processos de Atesto: ' + resultado.processosAtesto);
  Logger.log('   Entregas: ' + resultado.entregas);
  Logger.log('');
  
  if (resultado.problemas.length > 0) {
    Logger.log('⚠️ PROBLEMAS ENCONTRADOS:');
    resultado.problemas.forEach(function(p) {
      Logger.log('   - ' + p);
    });
  } else {
    Logger.log('✅ Todas as planilhas OK');
  }
  
  return resultado;
}

// Log de carregamento
Logger.log('✅ Setup_Dados_Sinteticos_Completo.gs carregado');
