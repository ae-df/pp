/**
 * @fileoverview Montador de Planilhas - Sistema UNIAE CRE
 * @version 1.0.0
 * @description Cria e configura todas as planilhas do sistema
 * com dados sintéticos para teste. Senhas em TEXTO PLANO.
 * 
 * EXECUTE: montarSistemaCompleto()
 * 
 * @author UNIAE CRE Team
 * @created 2025-12-09
 */

'use strict';

// ============================================================================
// CONFIGURAÇÃO DAS PLANILHAS
// ============================================================================

var SHEETS_CONFIG = {
  
  // ─────────────────────────────────────────────────────────────────────────
  // USUARIOS
  // ─────────────────────────────────────────────────────────────────────────
  // Usa schema unificado de Core_Schema_Usuarios.gs
  // ─────────────────────────────────────────────────────────────────────────
  // USUARIOS - Usa schema unificado de Core_Schema_Usuarios.gs
  // Headers: email, nome, senha, tipo, instituicao, telefone, cpf, cnpj, ativo, dataCriacao, dataAtualizacao, ultimoAcesso, token
  // Total: 13 colunas
  // ─────────────────────────────────────────────────────────────────────────
  Usuarios: {
    headers: (typeof USUARIOS_SCHEMA !== 'undefined') 
      ? USUARIOS_SCHEMA.HEADERS 
      : ['email', 'nome', 'senha', 'tipo', 'instituicao', 'telefone', 'cpf', 'cnpj', 'ativo', 'dataCriacao', 'dataAtualizacao', 'ultimoAcesso', 'token'],
    headerColor: '#4a86e8',
    // Dados: [email, nome, senha, tipo, instituicao, telefone, cpf, cnpj, ativo, dataCriacao, dataAtualizacao, ultimoAcesso, token]
    dados: [
      ['admin@uniae.gov.br', 'Administrador Sistema', 'Admin@2025', 'ADMIN', 'UNIAE/CRE-PP', '(61) 3333-0001', '000.000.000-01', '', 'ATIVO', new Date(), '', '', ''],
      ['analista@uniae.gov.br', 'Ana Paula Silva', 'Analista@2025', 'ANALISTA', 'UNIAE/CRE-PP', '(61) 3333-0002', '000.000.000-02', '', 'ATIVO', new Date(), '', '', ''],
      ['fiscal@uniae.gov.br', 'Carlos Eduardo Santos', 'Fiscal@2025', 'FISCAL', 'UNIAE/CRE-PP', '(61) 3333-0003', '000.000.000-03', '', 'ATIVO', new Date(), '', '', ''],
      ['gestor@uniae.gov.br', 'Maria Fernanda Costa', 'Gestor@2025', 'GESTOR', 'UNIAE/CRE-PP', '(61) 3333-0004', '000.000.000-04', '', 'ATIVO', new Date(), '', '', ''],
      ['escola@seedf.gov.br', 'Roberto Lima', 'Escola@2025', 'REPRESENTANTE', 'EC 01 Plano Piloto', '(61) 3333-0005', '000.000.000-05', '', 'ATIVO', new Date(), '', '', ''],
      ['fornecedor@empresa.com.br', 'João Pedro Almeida', 'Fornecedor@2025', 'FORNECEDOR', 'Alimentos Brasil LTDA', '(61) 3333-0006', '', '12.345.678/0001-99', 'ATIVO', new Date(), '', '', ''],
      ['nutricionista@seedf.gov.br', 'Patrícia Mendes', 'Nutri@2025', 'NUTRICIONISTA', 'UNIAE/CRE-PP', '(61) 3333-0007', '000.000.000-07', '', 'ATIVO', new Date(), '', '', ''],
      ['teste@teste.com', 'Usuário de Teste', 'Teste@123', 'ANALISTA', 'Teste', '(61) 9999-9999', '000.000.000-00', '', 'ATIVO', new Date(), '', '', ''],
      ['escola2@seedf.gov.br', 'Fernanda Souza', 'Escola2@2025', 'REPRESENTANTE', 'EC 02 Asa Sul', '(61) 3333-0009', '000.000.000-09', '', 'ATIVO', new Date(), '', '', ''],
      ['granja@ovosfrescos.com.br', 'Marcos Pereira', 'Granja@2025', 'FORNECEDOR', 'Granja Ovos Frescos LTDA', '(61) 3333-0010', '', '33.444.555/0001-88', 'ATIVO', new Date(), '', '', '']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // NOTAS FISCAIS - Estrutura atualizada com campos de gênero/produto
  // ─────────────────────────────────────────────────────────────────────────
  Notas_Fiscais: {
    headers: ['ID', 'Numero_NF', 'Serie', 'Chave_Acesso', 'Data_Emissao', 'CNPJ', 'Fornecedor_Nome', 'Produto', 'Quantidade', 'Unidade', 'Valor_Unitario', 'Valor_Total', 'Nota_Empenho', 'Status_NF', 'Registrado_Por', 'Data_Registro', 'Observacoes'],
    headerColor: '#6aa84f',
    dados: [
      ['NF_001', '000001', '1', '53251212345678000199550010000000011234567890', new Date(2025, 11, 1), '12.345.678/0001-99', 'Alimentos Brasil LTDA', 'Arroz Tipo 1 - 5kg', 100, 'PCT', 25.00, 2500.00, '2025/000001', 'PENDENTE', 'analista@uniae.gov.br', new Date(), ''],
      ['NF_002', '000002', '1', '53251298765432000110550010000000021234567891', new Date(2025, 11, 2), '98.765.432/0001-10', 'Distribuidora XYZ', 'Feijão Carioca - 1kg', 200, 'KG', 8.50, 1700.00, '2025/000002', 'PENDENTE', 'analista@uniae.gov.br', new Date(), ''],
      ['NF_003', '000003', '1', '53251211222333000144550010000000031234567892', new Date(2025, 11, 3), '11.222.333/0001-44', 'Hortifruti Central', 'Maçã Gala - Caixa 10kg', 50, 'CX', 64.00, 3200.00, '2025/000003', 'RECEBIDA', 'analista@uniae.gov.br', new Date(), ''],
      ['NF_004', '000004', '1', '53251244555666000177550010000000041234567893', new Date(2025, 11, 4), '44.555.666/0001-77', 'Laticínios Bom Gosto', 'Leite Integral UHT 1L', 500, 'L', 5.80, 2900.00, '2025/000004', 'ATESTADA_COM_GLOSA', 'analista@uniae.gov.br', new Date(), 'Glosa por produto vencido'],
      ['NF_005', '000005', '1', '53251277888999000100550010000000051234567894', new Date(2025, 11, 5), '77.888.999/0001-00', 'Panificadora Pão Quente', 'Pão Francês - 50g', 1000, 'UN', 0.50, 500.00, '2025/000005', 'ATESTADA', 'analista@uniae.gov.br', new Date(), '']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // ENTREGAS
  // ─────────────────────────────────────────────────────────────────────────
  Entregas: {
    headers: ['id', 'nota_fiscal_id', 'numero_nf', 'fornecedor', 'unidade_escolar', 'data_entrega', 'hora_entrega', 'responsavel_recebimento', 'matricula_responsavel', 'quantidade_volumes', 'temperatura_adequada', 'embalagem_integra', 'documentacao_ok', 'status', 'observacoes', 'usuario_registro', 'data_registro'],
    headerColor: '#e69138',
    dados: [
      ['ENT_001', 'NF_003', '000003', 'Hortifruti Central', 'EC 01 Plano Piloto', new Date(2025, 11, 5), '09:30', 'Roberto Lima', '123456', 8, true, true, true, 'ENTREGUE', '', 'escola@seedf.gov.br', new Date()],
      ['ENT_002', 'NF_004', '000004', 'Laticínios Bom Gosto', 'EC 02 Asa Sul', new Date(2025, 11, 6), '10:15', 'Fernanda Souza', '234567', 5, true, false, true, 'ENTREGUE', 'Embalagem de 2 itens danificada', 'escola@seedf.gov.br', new Date()],
      ['ENT_003', 'NF_005', '000005', 'Panificadora Pão Quente', 'EC 01 Plano Piloto', new Date(2025, 11, 7), '08:00', 'Roberto Lima', '123456', 3, true, true, true, 'ENTREGUE', '', 'escola@seedf.gov.br', new Date()]
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONTROLE DE CONFERÊNCIA
  // ─────────────────────────────────────────────────────────────────────────
  Controle_Conferencia: {
    headers: ['id', 'nota_fiscal_id', 'numero_nf', 'fornecedor', 'valor_nf', 'data_inicio', 'usuario_conferencia', 'status', 'itens_conferidos', 'itens_total', 'valor_conferido', 'valor_glosa', 'observacoes', 'data_conclusao', 'usuario_atesto', 'parecer', 'valor_liquido_final'],
    headerColor: '#9900ff',
    dados: [
      ['CONF_001', 'NF_004', '000004', 'Laticínios Bom Gosto', 5800.00, new Date(2025, 11, 6), 'fiscal@uniae.gov.br', 'CONCLUIDA', 8, 8, 5500.00, 300.00, 'Produto vencido identificado', new Date(2025, 11, 7), 'fiscal@uniae.gov.br', 'Glosa aplicada conforme procedimento', 5500.00],
      ['CONF_002', 'NF_005', '000005', 'Panificadora Pão Quente', 2100.00, new Date(2025, 11, 7), 'fiscal@uniae.gov.br', 'CONCLUIDA', 5, 5, 2100.00, 0, '', new Date(2025, 11, 8), 'fiscal@uniae.gov.br', 'Todos os itens conferidos e aprovados', 2100.00]
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // FORNECEDORES
  // ─────────────────────────────────────────────────────────────────────────
  Fornecedores: {
    headers: ['id', 'razao_social', 'nome_fantasia', 'cnpj', 'inscricao_estadual', 'endereco', 'cidade', 'uf', 'cep', 'telefone', 'email', 'contato', 'status', 'data_cadastro', 'observacoes'],
    headerColor: '#cc0000',
    dados: [
      ['FOR_001', 'Alimentos Brasil LTDA', 'Alimentos Brasil', '12.345.678/0001-99', '123456789', 'Rua das Flores, 100', 'Brasília', 'DF', '70000-000', '(61) 3333-1001', 'contato@alimentosbrasil.com.br', 'José Silva', 'ATIVO', new Date(), ''],
      ['FOR_002', 'Distribuidora de Alimentos XYZ LTDA', 'Distribuidora XYZ', '98.765.432/0001-10', '987654321', 'Av. Central, 500', 'Brasília', 'DF', '70100-000', '(61) 3333-1002', 'vendas@xyz.com.br', 'Maria Santos', 'ATIVO', new Date(), ''],
      ['FOR_003', 'Hortifruti Central EIRELI', 'Hortifruti Central', '11.222.333/0001-44', '112223334', 'CEASA Lote 15', 'Brasília', 'DF', '70200-000', '(61) 3333-1003', 'hortifruti@central.com.br', 'Pedro Oliveira', 'ATIVO', new Date(), 'Fornecedor de frutas e verduras - Maçãs'],
      ['FOR_004', 'Laticínios Bom Gosto S/A', 'Laticínios Bom Gosto', '44.555.666/0001-77', '445556667', 'Rod. BR-020 Km 50', 'Planaltina', 'DF', '73300-000', '(61) 3333-1004', 'comercial@bomgosto.com.br', 'Ana Costa', 'ATIVO', new Date(), ''],
      ['FOR_005', 'Panificadora Pão Quente LTDA', 'Panificadora Pão Quente', '77.888.999/0001-00', '778889990', 'SIA Trecho 3', 'Brasília', 'DF', '71200-000', '(61) 3333-1005', 'pedidos@paoquente.com.br', 'Carlos Ferreira', 'ATIVO', new Date(), 'Fornecedor de pães - Pão Brioche'],
      ['FOR_006', 'Granja Ovos Frescos LTDA', 'Granja Ovos Frescos', '33.444.555/0001-88', '334445556', 'Núcleo Rural Sobradinho', 'Sobradinho', 'DF', '73100-000', '(61) 3333-1006', 'vendas@ovosfrescos.com.br', 'Marcos Pereira', 'ATIVO', new Date(), 'Fornecedor de ovos - Ovos Brancos Tipo Grande']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // UNIDADES ESCOLARES
  // ─────────────────────────────────────────────────────────────────────────
  Unidades_Escolares: {
    headers: ['id', 'nome', 'codigo_inep', 'tipo', 'endereco', 'bairro', 'cep', 'telefone', 'email', 'diretor', 'cre', 'num_alunos', 'status'],
    headerColor: '#0b5394',
    dados: [
      ['UE_001', 'EC 01 Plano Piloto', '53001001', 'Escola Classe', 'SQS 108 Área Especial', 'Asa Sul', '70000-000', '(61) 3333-2001', 'ec01pp@seedf.gov.br', 'Maria Helena', 'CRE-PP', 450, 'ATIVA'],
      ['UE_002', 'EC 02 Asa Sul', '53001002', 'Escola Classe', 'SQS 208 Área Especial', 'Asa Sul', '70000-001', '(61) 3333-2002', 'ec02as@seedf.gov.br', 'João Carlos', 'CRE-PP', 380, 'ATIVA'],
      ['UE_003', 'CEF 01 Plano Piloto', '53001003', 'Centro de Ensino Fundamental', 'SQN 108 Área Especial', 'Asa Norte', '70000-002', '(61) 3333-2003', 'cef01pp@seedf.gov.br', 'Ana Paula', 'CRE-PP', 820, 'ATIVA'],
      ['UE_004', 'CED 01 Plano Piloto', '53001004', 'Centro Educacional', 'SGAS 908', 'Asa Sul', '70000-003', '(61) 3333-2004', 'ced01pp@seedf.gov.br', 'Roberto Souza', 'CRE-PP', 1200, 'ATIVA'],
      ['UE_005', 'JI 01 Plano Piloto', '53001005', 'Jardim de Infância', 'SQS 308 Área Especial', 'Asa Sul', '70000-004', '(61) 3333-2005', 'ji01pp@seedf.gov.br', 'Fernanda Lima', 'CRE-PP', 180, 'ATIVA'],
      ['UE_006', 'EC 02 Plano Piloto', '53001006', 'Escola Classe', 'SQS 308 Área Especial', 'Asa Sul', '70000-005', '(61) 3333-2006', 'ec02pp@seedf.gov.br', 'Carla Mendes', 'CRE-PP', 420, 'ATIVA'],
      ['UE_007', 'EC 03 Cruzeiro', '53001007', 'Escola Classe', 'SHCES Quadra 1', 'Cruzeiro', '70000-006', '(61) 3333-2007', 'ec03cr@seedf.gov.br', 'Paulo Santos', 'CRE-PP', 350, 'ATIVA']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // EMPENHOS
  // ─────────────────────────────────────────────────────────────────────────
  Empenhos: {
    headers: ['id', 'numero_empenho', 'ano', 'fornecedor_id', 'fornecedor_nome', 'valor_total', 'valor_utilizado', 'saldo', 'data_emissao', 'data_vigencia', 'natureza_despesa', 'fonte_recurso', 'status', 'observacoes'],
    headerColor: '#38761d',
    dados: [
      ['EMP_001', '2025/000001', 2025, 'FOR_001', 'Alimentos Brasil LTDA', 50000.00, 15000.00, 35000.00, new Date(2025, 0, 15), new Date(2025, 11, 31), '339030', 'PNAE', 'VIGENTE', ''],
      ['EMP_002', '2025/000002', 2025, 'FOR_002', 'Distribuidora XYZ', 30000.00, 8500.50, 21499.50, new Date(2025, 0, 20), new Date(2025, 11, 31), '339030', 'PNAE', 'VIGENTE', ''],
      ['EMP_003', '2025/000003', 2025, 'FOR_003', 'Hortifruti Central', 25000.00, 3200.00, 21800.00, new Date(2025, 1, 1), new Date(2025, 11, 31), '339030', 'PDDE', 'VIGENTE', ''],
      ['EMP_004', '2025/000004', 2025, 'FOR_004', 'Laticínios Bom Gosto', 40000.00, 5500.00, 34500.00, new Date(2025, 1, 10), new Date(2025, 11, 31), '339030', 'PNAE', 'VIGENTE', ''],
      ['EMP_005', '2025/000005', 2025, 'FOR_005', 'Panificadora Pão Quente', 15000.00, 2100.00, 12900.00, new Date(2025, 2, 1), new Date(2025, 11, 31), '339030', 'PNAE', 'VIGENTE', '']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // GLOSAS
  // ─────────────────────────────────────────────────────────────────────────
  Glosas: {
    headers: ['id', 'nota_fiscal_id', 'numero_nf', 'item', 'motivo', 'quantidade_glosada', 'valor_unitario', 'valor_glosa', 'evidencia_url', 'justificativa', 'usuario_registro', 'data_registro'],
    headerColor: '#990000',
    dados: [
      ['GLO_001', 'NF_004', '000004', 'Leite Integral 1L', 'VALIDADE_VENCIDA', 10, 5.00, 50.00, '', 'Lote com validade vencida em 2 dias', 'fiscal@uniae.gov.br', new Date()],
      ['GLO_002', 'NF_004', '000004', 'Queijo Mussarela 500g', 'EMBALAGEM_VIOLADA', 5, 25.00, 125.00, '', 'Embalagens abertas', 'fiscal@uniae.gov.br', new Date()],
      ['GLO_003', 'NF_004', '000004', 'Iogurte Natural 170g', 'TEMPERATURA_INADEQUADA', 10, 12.50, 125.00, '', 'Temperatura acima do permitido', 'fiscal@uniae.gov.br', new Date()]
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // RECUSAS
  // ─────────────────────────────────────────────────────────────────────────
  Recusas: {
    headers: ['id', 'nota_fiscal_id', 'numero_nf', 'fornecedor', 'motivo', 'descricao', 'data_recusa', 'usuario_recusa', 'status'],
    headerColor: '#666666',
    dados: []
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // AUDITORIA
  // ─────────────────────────────────────────────────────────────────────────
  Auditoria_Log: {
    headers: ['id', 'data_hora', 'usuario', 'acao', 'entidade', 'entidade_id', 'dados_anteriores', 'dados_novos', 'ip', 'sessao_id'],
    headerColor: '#434343',
    dados: [
      ['AUD_001', new Date(), 'admin@uniae.gov.br', 'SISTEMA_INICIALIZADO', 'SISTEMA', '', '', '', '', ''],
      ['AUD_002', new Date(), 'analista@uniae.gov.br', 'LOGIN', 'USUARIO', 'USR_002', '', '', '', '']
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFLOWS UNIAE - 3 FLUXOS INTEGRADOS
  // ═══════════════════════════════════════════════════════════════════════════
  // 
  // CENÁRIO DE TESTE: 3 Gêneros Alimentícios em 2 Escolas
  // ─────────────────────────────────────────────────────────────────────────
  // GÊNERO 1: Pão Brioche (UN) - Panificadora Pão Quente
  // GÊNERO 2: Ovos (DZ) - Granja Ovos Frescos
  // GÊNERO 3: Maçãs (KG) - Hortifruti Central
  // ─────────────────────────────────────────────────────────────────────────
  // ESCOLA 1: EC 01 Plano Piloto - Recebe tudo conforme (ATESTO COMPLETO)
  // ESCOLA 2: EC 02 Asa Sul - Recebe parcial (GLOSA)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // ─────────────────────────────────────────────────────────────────────────
  // WORKFLOW 1: NOTAS FISCAIS (Fornecedor)
  // Cada NF contém apenas 1 gênero alimentício
  // ─────────────────────────────────────────────────────────────────────────
  Workflow_NotasFiscais: {
    headers: ['ID', 'Data_Criacao', 'Numero', 'Serie', 'Chave_Acesso', 'Data_Emissao', 'CNPJ', 'Fornecedor', 'Produto', 'Quantidade', 'Unidade', 'Valor_Unitario', 'Valor_Total', 'Nota_Empenho', 'Status', 'Usuario'],
    headerColor: '#1a73e8',
    dados: [
      // ═══════════════════════════════════════════════════════════════════════
      // NF 1: PÃO BRIOCHE - 500 unidades - R$ 2,50/un = R$ 1.250,00
      // Distribuição: EC01 (300 un) + EC02 (200 un)
      // RESULTADO: APROVADO_TOTAL (todas as unidades recebidas)
      // ═══════════════════════════════════════════════════════════════════════
      ['NF_PAO_001', new Date(2025, 11, 10, 7, 30), '001001', '1', '53251277888999000100550010000010011234567001', new Date(2025, 11, 10), '77.888.999/0001-00', 'Panificadora Pão Quente', 'Pão Brioche Artesanal 50g', 500, 'UN', 2.50, 1250.00, '2025NE00010', 'APROVADO', 'fornecedor@empresa.com.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // NF 2: OVOS - 100 dúzias - R$ 18,00/dz = R$ 1.800,00
      // Distribuição: EC01 (60 dz) + EC02 (40 dz esperado, 30 dz recebido)
      // RESULTADO: GLOSADO - EC02 recebeu 30 dz (10 dz quebradas)
      // Glosa: 10 dz × R$ 18,00 = R$ 180,00
      // ═══════════════════════════════════════════════════════════════════════
      ['NF_OVOS_001', new Date(2025, 11, 11, 8, 0), '002001', '1', '53251233444555000188550010000020011234567002', new Date(2025, 11, 11), '33.444.555/0001-88', 'Granja Ovos Frescos LTDA', 'Ovos Brancos Tipo Grande', 100, 'DZ', 18.00, 1800.00, '2025NE00011', 'GLOSADO', 'fornecedor@empresa.com.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // NF 3: MAÇÃS - 200 kg - R$ 8,50/kg = R$ 1.700,00
      // Distribuição: EC01 (120 kg) + EC02 (80 kg esperado, 60 kg recebido)
      // RESULTADO: GLOSADO - EC02 recebeu 60 kg (20 kg estragadas)
      // Glosa: 20 kg × R$ 8,50 = R$ 170,00
      // ═══════════════════════════════════════════════════════════════════════
      ['NF_MACA_001', new Date(2025, 11, 12, 9, 0), '003001', '1', '53251211222333000144550010000030011234567003', new Date(2025, 11, 12), '11.222.333/0001-44', 'Hortifruti Central', 'Maçã Fuji Nacional - Categoria Extra', 200, 'KG', 8.50, 1700.00, '2025NE00012', 'GLOSADO', 'fornecedor@empresa.com.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // NFs ADICIONAIS - OUTROS STATUS DO FLUXO
      // ═══════════════════════════════════════════════════════════════════════
      
      // NF 4: PÃO BRIOCHE - Nova entrega - ENVIADA (aguardando recebimento)
      ['NF_PAO_002', new Date(2025, 11, 15, 7, 0), '001002', '1', '53251277888999000100550010000010021234567004', new Date(2025, 11, 15), '77.888.999/0001-00', 'Panificadora Pão Quente', 'Pão Brioche Artesanal 50g', 400, 'UN', 2.50, 1000.00, '2025NE00010', 'ENVIADA', 'fornecedor@empresa.com.br'],
      
      // NF 5: OVOS - Nova entrega - EM_RECEBIMENTO (EC01 já recebeu)
      ['NF_OVOS_002', new Date(2025, 11, 16, 8, 30), '002002', '1', '53251233444555000188550010000020021234567005', new Date(2025, 11, 16), '33.444.555/0001-88', 'Granja Ovos Frescos LTDA', 'Ovos Brancos Tipo Grande', 80, 'DZ', 18.00, 1440.00, '2025NE00011', 'EM_RECEBIMENTO', 'fornecedor@empresa.com.br'],
      
      // NF 6: MAÇÃS - Nova entrega - EM_RECEBIMENTO (EC01 já recebeu)
      ['NF_MACA_002', new Date(2025, 11, 17, 9, 30), '003002', '1', '53251211222333000144550010000030021234567006', new Date(2025, 11, 17), '11.222.333/0001-44', 'Hortifruti Central', 'Maçã Fuji Nacional - Categoria Extra', 150, 'KG', 8.50, 1275.00, '2025NE00012', 'EM_RECEBIMENTO', 'fornecedor@empresa.com.br'],
      
      // NF 7: OVOS - Exemplo de NF REJEITADA (toda a carga com problema)
      ['NF_OVOS_003', new Date(2025, 11, 5, 8, 0), '002003', '1', '53251233444555000188550010000020031234567007', new Date(2025, 11, 5), '33.444.555/0001-88', 'Granja Ovos Frescos LTDA', 'Ovos Brancos Tipo Grande', 50, 'DZ', 18.00, 900.00, '2025NE00011', 'REJEITADO', 'fornecedor@empresa.com.br']
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // WORKFLOW 2: RECEBIMENTOS (Representante Escolar)
  // Múltiplas escolas podem registrar recebimento da mesma NF
  // ─────────────────────────────────────────────────────────────────────────
  Workflow_Recebimentos: {
    headers: ['ID', 'NF_ID', 'NF_Numero', 'Escola', 'Produto', 'Qtd_Esperada', 'Qtd_Recebida', 'Unidade', 'Valor_Unitario', 'Valor_Parcial', 'Responsavel', 'Matricula', 'Data_Recebimento', 'Hora', 'Embalagem_OK', 'Validade_OK', 'Caracteristicas_OK', 'Temperatura', 'Observacoes', 'Status', 'Data_Registro'],
    headerColor: '#0d652d',
    dados: [
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_PAO_001 - PÃO BRIOCHE (500 UN)
      // EC01: 300 un CONFORME | EC02: 200 un CONFORME
      // TOTAL RECEBIDO: 500 un = 100% → APROVADO_TOTAL
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_PAO_001_EC01', 'NF_PAO_001', '001001', 'EC 01 Plano Piloto', 'Pão Brioche Artesanal 50g', 500, 300, 'UN', 2.50, 750.00, 'Roberto Lima', '123456', new Date(2025, 11, 10), '07:45', 'SIM', 'SIM', 'SIM', '', 'Pães frescos, entregues às 7h da manhã', 'CONFORME', new Date(2025, 11, 10, 8, 0)],
      ['REC_PAO_001_EC02', 'NF_PAO_001', '001001', 'EC 02 Asa Sul', 'Pão Brioche Artesanal 50g', 500, 200, 'UN', 2.50, 500.00, 'Fernanda Souza', '234567', new Date(2025, 11, 10), '08:30', 'SIM', 'SIM', 'SIM', '', 'Recebido conforme, boa qualidade', 'CONFORME', new Date(2025, 11, 10, 8, 45)],
      
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_OVOS_001 - OVOS (100 DZ)
      // EC01: 60 dz CONFORME | EC02: 30 dz PARCIAL (10 dz quebradas)
      // TOTAL RECEBIDO: 90 dz = 90% → GLOSADO (10 dz × R$ 18 = R$ 180)
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_OVOS_001_EC01', 'NF_OVOS_001', '002001', 'EC 01 Plano Piloto', 'Ovos Brancos Tipo Grande', 100, 60, 'DZ', 18.00, 1080.00, 'Roberto Lima', '123456', new Date(2025, 11, 11), '08:15', 'SIM', 'SIM', 'SIM', '8', 'Ovos em perfeito estado, refrigerados', 'CONFORME', new Date(2025, 11, 11, 8, 30)],
      ['REC_OVOS_001_EC02', 'NF_OVOS_001', '002001', 'EC 02 Asa Sul', 'Ovos Brancos Tipo Grande', 100, 30, 'DZ', 18.00, 540.00, 'Fernanda Souza', '234567', new Date(2025, 11, 11), '09:00', 'NAO', 'SIM', 'SIM', '10', '10 dúzias com ovos quebrados durante transporte. Embalagens danificadas.', 'PARCIAL', new Date(2025, 11, 11, 9, 15)],
      
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_MACA_001 - MAÇÃS (200 KG)
      // EC01: 120 kg CONFORME | EC02: 60 kg PARCIAL (20 kg estragadas)
      // TOTAL RECEBIDO: 180 kg = 90% → GLOSADO (20 kg × R$ 8,50 = R$ 170)
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_MACA_001_EC01', 'NF_MACA_001', '003001', 'EC 01 Plano Piloto', 'Maçã Fuji Nacional - Categoria Extra', 200, 120, 'KG', 8.50, 1020.00, 'Roberto Lima', '123456', new Date(2025, 11, 12), '09:15', 'SIM', 'SIM', 'SIM', '', 'Frutas em excelente estado, calibre uniforme', 'CONFORME', new Date(2025, 11, 12, 9, 30)],
      ['REC_MACA_001_EC02', 'NF_MACA_001', '003001', 'EC 02 Asa Sul', 'Maçã Fuji Nacional - Categoria Extra', 200, 60, 'KG', 8.50, 510.00, 'Fernanda Souza', '234567', new Date(2025, 11, 12), '10:00', 'SIM', 'NAO', 'NAO', '', '20 kg de maçãs com manchas escuras e sinais de apodrecimento. Recusadas por qualidade inadequada.', 'PARCIAL', new Date(2025, 11, 12, 10, 15)],
      
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_OVOS_002 - OVOS NOVA ENTREGA (80 DZ) - EM_RECEBIMENTO
      // Apenas EC01 recebeu até agora
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_OVOS_002_EC01', 'NF_OVOS_002', '002002', 'EC 01 Plano Piloto', 'Ovos Brancos Tipo Grande', 80, 50, 'DZ', 18.00, 900.00, 'Roberto Lima', '123456', new Date(2025, 11, 16), '08:45', 'SIM', 'SIM', 'SIM', '7', 'Recebido conforme programação', 'CONFORME', new Date(2025, 11, 16, 9, 0)],
      
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_MACA_002 - MAÇÃS NOVA ENTREGA (150 KG) - EM_RECEBIMENTO
      // Apenas EC01 recebeu até agora
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_MACA_002_EC01', 'NF_MACA_002', '003002', 'EC 01 Plano Piloto', 'Maçã Fuji Nacional - Categoria Extra', 150, 90, 'KG', 8.50, 765.00, 'Roberto Lima', '123456', new Date(2025, 11, 17), '09:45', 'SIM', 'SIM', 'SIM', '', 'Frutas frescas, boa aparência', 'CONFORME', new Date(2025, 11, 17, 10, 0)],
      
      // ═══════════════════════════════════════════════════════════════════════
      // RECEBIMENTOS NF_OVOS_003 - OVOS REJEITADOS (50 DZ) - REJEITADO
      // Ambas escolas recusaram por temperatura inadequada
      // ═══════════════════════════════════════════════════════════════════════
      ['REC_OVOS_003_EC01', 'NF_OVOS_003', '002003', 'EC 01 Plano Piloto', 'Ovos Brancos Tipo Grande', 50, 0, 'DZ', 18.00, 0.00, 'Roberto Lima', '123456', new Date(2025, 11, 5), '08:30', 'NAO', 'NAO', 'NAO', '22', 'RECUSADO: Temperatura de 22°C, muito acima do permitido (máx 10°C). Risco sanitário.', 'RECUSADO', new Date(2025, 11, 5, 8, 45)],
      ['REC_OVOS_003_EC02', 'NF_OVOS_003', '002003', 'EC 02 Asa Sul', 'Ovos Brancos Tipo Grande', 50, 0, 'DZ', 18.00, 0.00, 'Fernanda Souza', '234567', new Date(2025, 11, 5), '09:15', 'NAO', 'NAO', 'NAO', '24', 'RECUSADO: Caminhão sem refrigeração. Ovos em temperatura ambiente (24°C).', 'RECUSADO', new Date(2025, 11, 5, 9, 30)]
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // WORKFLOW 3: ANÁLISES (Analista UNIAE)
  // Consolida recebimentos e autoriza pagamento
  // REGRA: valorAprovado + valorGlosa = valorNF
  // ─────────────────────────────────────────────────────────────────────────
  Workflow_Analises: {
    headers: ['ID', 'Data_Analise', 'NF_ID', 'NF_Numero', 'Nota_Empenho', 'Fornecedor', 'Produto', 'Qtd_NF', 'Qtd_Recebida', 'Diferenca', 'Unidade', 'Valor_Unitario', 'Valor_NF', 'Valor_Glosa', 'Valor_Aprovado', 'Percentual_Glosa', 'Membros_Comissao', 'Qtd_Membros', 'Decisao', 'Justificativa', 'Validacao_Contabil', 'Status', 'Usuario'],
    headerColor: '#7c3aed',
    dados: [
      // ═══════════════════════════════════════════════════════════════════════
      // ANÁLISE 1: PÃO BRIOCHE - APROVADO_TOTAL
      // NF: 500 UN × R$ 2,50 = R$ 1.250,00
      // Recebido: EC01 (300) + EC02 (200) = 500 UN (100%)
      // Glosa: R$ 0,00 | Aprovado: R$ 1.250,00
      // INVARIANTE: R$ 1.250,00 + R$ 0,00 = R$ 1.250,00 ✓
      // ═══════════════════════════════════════════════════════════════════════
      ['ANA_PAO_001', new Date(2025, 11, 11, 14, 0), 'NF_PAO_001', '001001', '2025NE00010', 'Panificadora Pão Quente', 'Pão Brioche Artesanal 50g', 500, 500, 0, 'UN', 2.50, 1250.00, 0.00, 1250.00, '0%', 'Ana Paula Silva, Carlos Eduardo Santos, Maria Fernanda Costa', 3, 'APROVADO_TOTAL', 'Quantidade total recebida conforme NF. EC 01 Plano Piloto recebeu 300 unidades e EC 02 Asa Sul recebeu 200 unidades. Todos os pães em perfeito estado, frescos e dentro da validade. Pagamento integral autorizado.', 'OK', 'APROVADO', 'analista@uniae.gov.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // ANÁLISE 2: OVOS - GLOSADO (APROVADO_PARCIAL)
      // NF: 100 DZ × R$ 18,00 = R$ 1.800,00
      // Recebido: EC01 (60) + EC02 (30) = 90 DZ (90%)
      // Diferença: 10 DZ (EC02 teve 10 dz quebradas)
      // Glosa: 10 × R$ 18,00 = R$ 180,00 | Aprovado: R$ 1.620,00
      // INVARIANTE: R$ 1.620,00 + R$ 180,00 = R$ 1.800,00 ✓
      // ═══════════════════════════════════════════════════════════════════════
      ['ANA_OVOS_001', new Date(2025, 11, 12, 10, 30), 'NF_OVOS_001', '002001', '2025NE00011', 'Granja Ovos Frescos LTDA', 'Ovos Brancos Tipo Grande', 100, 90, 10, 'DZ', 18.00, 1800.00, 180.00, 1620.00, '10%', 'Ana Paula Silva, Carlos Eduardo Santos, Maria Fernanda Costa', 3, 'APROVADO_PARCIAL', 'EC 01 Plano Piloto recebeu 60 dúzias conforme. EC 02 Asa Sul recebeu apenas 30 dúzias das 40 esperadas - 10 dúzias apresentaram ovos quebrados durante o transporte devido a embalagens danificadas. Glosa de R$ 180,00 aplicada (10 dz × R$ 18,00). Recomenda-se ao fornecedor melhorar o acondicionamento para transporte.', 'OK', 'GLOSADO', 'analista@uniae.gov.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // ANÁLISE 3: MAÇÃS - GLOSADO (APROVADO_PARCIAL)
      // NF: 200 KG × R$ 8,50 = R$ 1.700,00
      // Recebido: EC01 (120) + EC02 (60) = 180 KG (90%)
      // Diferença: 20 KG (EC02 teve 20 kg estragadas)
      // Glosa: 20 × R$ 8,50 = R$ 170,00 | Aprovado: R$ 1.530,00
      // INVARIANTE: R$ 1.530,00 + R$ 170,00 = R$ 1.700,00 ✓
      // ═══════════════════════════════════════════════════════════════════════
      ['ANA_MACA_001', new Date(2025, 11, 13, 15, 0), 'NF_MACA_001', '003001', '2025NE00012', 'Hortifruti Central', 'Maçã Fuji Nacional - Categoria Extra', 200, 180, 20, 'KG', 8.50, 1700.00, 170.00, 1530.00, '10%', 'Ana Paula Silva, Carlos Eduardo Santos, Maria Fernanda Costa', 3, 'APROVADO_PARCIAL', 'EC 01 Plano Piloto recebeu 120 kg em perfeito estado. EC 02 Asa Sul recebeu apenas 60 kg dos 80 kg esperados - 20 kg apresentavam manchas escuras e sinais de apodrecimento, sendo recusadas por qualidade inadequada. Glosa de R$ 170,00 aplicada (20 kg × R$ 8,50). Fornecedor notificado sobre controle de qualidade.', 'OK', 'GLOSADO', 'analista@uniae.gov.br'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // ANÁLISE 4: OVOS REJEITADOS - REJEITADO (sem pagamento)
      // NF: 50 DZ × R$ 18,00 = R$ 900,00
      // Recebido: EC01 (0) + EC02 (0) = 0 DZ (0%)
      // Motivo: Temperatura inadequada (22-24°C, máximo permitido 10°C)
      // Glosa: R$ 900,00 (100%) | Aprovado: R$ 0,00
      // INVARIANTE: R$ 0,00 + R$ 900,00 = R$ 900,00 ✓
      // ═══════════════════════════════════════════════════════════════════════
      ['ANA_OVOS_003', new Date(2025, 11, 6, 11, 0), 'NF_OVOS_003', '002003', '2025NE00011', 'Granja Ovos Frescos LTDA', 'Ovos Brancos Tipo Grande', 50, 0, 50, 'DZ', 18.00, 900.00, 900.00, 0.00, '100%', 'Ana Paula Silva, Carlos Eduardo Santos, Maria Fernanda Costa', 3, 'REJEITADO', 'CARGA TOTALMENTE REJEITADA. Ambas as escolas recusaram o recebimento por temperatura inadequada. EC 01 registrou 22°C e EC 02 registrou 24°C, muito acima do máximo permitido de 10°C para ovos. Caminhão de entrega estava sem refrigeração funcionando. Risco sanitário identificado. Fornecedor notificado formalmente. Sem pagamento autorizado.', 'OK', 'REJEITADO', 'analista@uniae.gov.br']
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ALUNOS COM NECESSIDADES ALIMENTARES ESPECIAIS
  // Inclui: Patologias (APLV, Diabetes, Celíacos, etc.) e Dietas (Veganos, Vegetarianos)
  // ═══════════════════════════════════════════════════════════════════════════
  Alunos_Necessidades_Especiais: {
    headers: ['ID', 'Data_Cadastro', 'Nome_Completo', 'Data_Nascimento', 'Unidade_Escolar', 'CRE', 'Serie_Turma', 'Turno', 'Tipo_Necessidade', 'Patologia_Dieta', 'Patologia_Secundaria', 'Restricoes', 'Possui_Laudo', 'Data_Laudo', 'Validade_Laudo', 'Link_Laudo_SEI', 'CID10', 'Consistencia', 'Observacoes', 'Responsavel_Cadastro', 'Status'],
    headerColor: '#8b5cf6',
    dados: [
      // ═══════════════════════════════════════════════════════════════════════
      // PATOLOGIAS MÉDICAS
      // ═══════════════════════════════════════════════════════════════════════
      
      // 🩺 DIABETES - Cardápio sem açúcar
      ['ALU_001', new Date(2025, 2, 15), 'Pedro Henrique Silva', new Date(2015, 5, 20), 'EC 01 Plano Piloto', 'CRE-PP', '4º Ano A', 'Matutino', 'PATOLOGIA', 'DIABETES', '', 'Açúcar, Carboidratos simples, Doces, Refrigerantes', true, new Date(2025, 1, 10), new Date(2026, 1, 10), 'SEI-00001/2025', 'E11', 'NORMAL', 'Diabetes Tipo 1 - Insulinodependente. Monitorar glicemia antes das refeições.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_002', new Date(2025, 3, 5), 'Maria Clara Santos', new Date(2014, 8, 12), 'EC 02 Asa Sul', 'CRE-PP', '5º Ano B', 'Vespertino', 'PATOLOGIA', 'DIABETES', '', 'Açúcar, Doces, Sucos industrializados', true, new Date(2025, 2, 20), new Date(2026, 2, 20), 'SEI-00002/2025', 'E11', 'NORMAL', 'Diabetes Tipo 2 - Controlada com dieta. Preferência por frutas com baixo índice glicêmico.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🌾 DOENÇA CELÍACA - Cardápio sem glúten
      ['ALU_003', new Date(2025, 1, 20), 'Lucas Gabriel Oliveira', new Date(2016, 3, 8), 'EC 01 Plano Piloto', 'CRE-PP', '3º Ano C', 'Matutino', 'PATOLOGIA', 'DOENCA_CELIACA', '', 'Glúten, Trigo, Centeio, Cevada, Aveia contaminada, Malte', true, new Date(2025, 0, 15), new Date(2026, 0, 15), 'SEI-00003/2025', 'K90.0', 'NORMAL', 'Doença celíaca confirmada por biópsia. Atenção à contaminação cruzada na cozinha.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_004', new Date(2025, 4, 10), 'Ana Beatriz Costa', new Date(2017, 11, 25), 'CEF 01 Plano Piloto', 'CRE-PP', '2º Ano A', 'Matutino', 'PATOLOGIA', 'DOENCA_CELIACA', 'INTOLERANCIA_LACTOSE', 'Glúten, Trigo, Lactose, Leite', true, new Date(2025, 3, 5), new Date(2026, 3, 5), 'SEI-00004/2025', 'K90.0', 'NORMAL', 'Celíaca com intolerância à lactose associada. Usar leite sem lactose e produtos sem glúten.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🥛 INTOLERÂNCIA À LACTOSE - Cardápio sem lactose
      ['ALU_005', new Date(2025, 2, 1), 'João Pedro Almeida', new Date(2015, 7, 30), 'EC 02 Asa Sul', 'CRE-PP', '4º Ano C', 'Vespertino', 'PATOLOGIA', 'INTOLERANCIA_LACTOSE', '', 'Lactose, Leite, Queijos frescos, Creme de leite', true, new Date(2025, 1, 25), new Date(2026, 1, 25), 'SEI-00005/2025', 'E73', 'NORMAL', 'Intolerância à lactose moderada. Pode consumir queijos maturados e iogurtes sem lactose.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_006', new Date(2025, 5, 15), 'Isabela Fernandes', new Date(2018, 2, 14), 'JI 01 Plano Piloto', 'CRE-PP', 'Jardim II', 'Integral', 'PATOLOGIA', 'INTOLERANCIA_LACTOSE', '', 'Lactose, Leite, Derivados lácteos', true, new Date(2025, 4, 10), new Date(2026, 4, 10), 'SEI-00006/2025', 'E73', 'NORMAL', 'Intolerância severa. Substituir por leite de soja ou aveia.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🧀 APLV - Sem proteína do leite
      ['ALU_007', new Date(2025, 0, 10), 'Miguel Souza Lima', new Date(2019, 9, 5), 'JI 01 Plano Piloto', 'CRE-PP', 'Jardim I', 'Integral', 'PATOLOGIA', 'APLV', '', 'Leite, Derivados lácteos, Traços de leite, Caseína, Soro de leite', true, new Date(2024, 11, 20), new Date(2025, 11, 20), 'SEI-00007/2025', 'K52.2', 'NORMAL', 'APLV IgE mediada. Risco de anafilaxia. Manter adrenalina disponível na escola.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_008', new Date(2025, 3, 25), 'Sofia Rodrigues', new Date(2020, 1, 28), 'JI 01 Plano Piloto', 'CRE-PP', 'Maternal II', 'Integral', 'PATOLOGIA', 'APLV', '', 'Leite, Derivados, Traços de leite', true, new Date(2025, 2, 15), new Date(2026, 2, 15), 'SEI-00008/2025', 'K52.2', 'AMASSADO', 'APLV não IgE mediada. Usar fórmulas especiais. Consistência amassada por idade.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // DIETAS POR ESCOLHA/CONVICÇÃO
      // ═══════════════════════════════════════════════════════════════════════
      
      // 🌱 VEGANO - Sem produtos de origem animal
      ['ALU_009', new Date(2025, 4, 1), 'Helena Martins Vega', new Date(2014, 6, 18), 'EC 01 Plano Piloto', 'CRE-PP', '5º Ano A', 'Matutino', 'DIETA', 'VEGANO', '', 'Carne, Frango, Peixe, Ovos, Leite, Derivados animais, Mel, Gelatina', true, new Date(2025, 3, 20), new Date(2026, 3, 20), 'SEI-00009/2025', '', 'NORMAL', 'Família vegana por convicção ética. Declaração dos pais anexada. Suplementar B12 se necessário.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_010', new Date(2025, 5, 10), 'Theo Nascimento Verde', new Date(2016, 0, 7), 'EC 02 Asa Sul', 'CRE-PP', '3º Ano B', 'Vespertino', 'DIETA', 'VEGANO', '', 'Carne, Frango, Peixe, Ovos, Leite, Mel, Gelatina, Corantes de origem animal', true, new Date(2025, 4, 25), new Date(2026, 4, 25), 'SEI-00010/2025', '', 'NORMAL', 'Vegano desde o nascimento. Pais acompanham nutricionista particular. Boa aceitação de leguminosas.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_011', new Date(2025, 6, 5), 'Luna Silva Campos', new Date(2017, 4, 22), 'CEF 01 Plano Piloto', 'CRE-PP', '2º Ano C', 'Matutino', 'DIETA', 'VEGANO', '', 'Todos os produtos de origem animal', true, new Date(2025, 5, 15), new Date(2026, 5, 15), 'SEI-00011/2025', '', 'NORMAL', 'Transição para veganismo há 1 ano. Adaptação bem-sucedida. Gosta muito de tofu e grão-de-bico.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🥬 VEGETARIANO - Sem carnes, permite ovos e laticínios
      ['ALU_012', new Date(2025, 2, 20), 'Davi Pereira Santos', new Date(2015, 10, 3), 'EC 01 Plano Piloto', 'CRE-PP', '4º Ano B', 'Matutino', 'DIETA', 'VEGETARIANO', '', 'Carne, Frango, Peixe, Frutos do mar', true, new Date(2025, 1, 28), new Date(2026, 1, 28), 'SEI-00012/2025', '', 'NORMAL', 'Vegetariano ovolactovegetariano. Consome ovos e laticínios normalmente.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      ['ALU_013', new Date(2025, 4, 15), 'Valentina Costa Luz', new Date(2016, 8, 9), 'EC 02 Asa Sul', 'CRE-PP', '3º Ano A', 'Vespertino', 'DIETA', 'VEGETARIANO', '', 'Carne, Frango, Peixe', true, new Date(2025, 3, 10), new Date(2026, 3, 10), 'SEI-00013/2025', '', 'NORMAL', 'Vegetariana por escolha própria desde os 5 anos. Família apoia a decisão.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🥚 OVOLACTOVEGETARIANO
      ['ALU_014', new Date(2025, 3, 8), 'Arthur Mendes Rocha', new Date(2014, 12, 15), 'CEF 01 Plano Piloto', 'CRE-PP', '5º Ano C', 'Matutino', 'DIETA', 'OVOLACTOVEGETARIANO', '', 'Carne, Frango, Peixe', true, new Date(2025, 2, 5), new Date(2026, 2, 5), 'SEI-00014/2025', '', 'NORMAL', 'Ovolactovegetariano. Boa aceitação de proteínas vegetais e ovos.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // ═══════════════════════════════════════════════════════════════════════
      // OUTRAS ALERGIAS E NECESSIDADES
      // ═══════════════════════════════════════════════════════════════════════
      
      // 🥜 ALERGIA A AMENDOIM
      ['ALU_015', new Date(2025, 1, 5), 'Enzo Gabriel Dias', new Date(2017, 7, 11), 'EC 01 Plano Piloto', 'CRE-PP', '2º Ano B', 'Matutino', 'PATOLOGIA', 'ALERGIA_AMENDOIM', '', 'Amendoim, Pasta de amendoim, Traços de amendoim, Óleos de amendoim', true, new Date(2025, 0, 20), new Date(2026, 0, 20), 'SEI-00015/2025', 'T78.0', 'NORMAL', 'Alergia severa a amendoim. Risco de anafilaxia. Escola possui EpiPen.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🥚 ALERGIA A OVO
      ['ALU_016', new Date(2025, 5, 20), 'Lívia Carvalho Nunes', new Date(2018, 5, 30), 'JI 01 Plano Piloto', 'CRE-PP', 'Jardim II', 'Integral', 'PATOLOGIA', 'ALERGIA_OVO', '', 'Ovo, Clara de ovo, Gema, Albumina, Lecitina de ovo', true, new Date(2025, 4, 15), new Date(2026, 4, 15), 'SEI-00016/2025', 'T78.0', 'NORMAL', 'Alergia a ovo confirmada. Evitar bolos, massas com ovo, maionese.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🦐 ALERGIA A FRUTOS DO MAR
      ['ALU_017', new Date(2025, 2, 12), 'Bernardo Teixeira', new Date(2015, 3, 25), 'EC 02 Asa Sul', 'CRE-PP', '4º Ano A', 'Vespertino', 'PATOLOGIA', 'ALERGIA_FRUTOS_MAR', '', 'Camarão, Peixe, Frutos do mar, Molhos de peixe', true, new Date(2025, 1, 8), new Date(2026, 1, 8), 'SEI-00017/2025', 'T78.0', 'NORMAL', 'Alergia a frutos do mar. Reação moderada. Evitar contaminação cruzada.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🌰 ALERGIA A CASTANHAS
      ['ALU_018', new Date(2025, 4, 28), 'Manuela Ribeiro', new Date(2016, 11, 2), 'CEF 01 Plano Piloto', 'CRE-PP', '3º Ano B', 'Matutino', 'PATOLOGIA', 'ALERGIA_CASTANHAS', '', 'Castanha-do-pará, Castanha de caju, Nozes, Amêndoas, Avelãs', true, new Date(2025, 3, 22), new Date(2026, 3, 22), 'SEI-00018/2025', 'T78.0', 'NORMAL', 'Alergia a oleaginosas. Evitar granolas e barras de cereais com castanhas.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🍽️ DISFAGIA - Consistência especial
      ['ALU_019', new Date(2025, 0, 25), 'Heitor Moura Lopes', new Date(2019, 2, 17), 'EC 03 Cruzeiro', 'CRE-PP', '1º Ano A', 'Matutino', 'PATOLOGIA', 'DISFAGIA', '', '', true, new Date(2024, 11, 10), new Date(2025, 11, 10), 'SEI-00019/2025', 'R13', 'PURE', 'Disfagia orofaríngea. Todos os alimentos devem ser oferecidos em consistência de purê.', 'nutricionista@seedf.gov.br', 'ATIVO'],
      
      // 🧂 HIPERTENSÃO - Dieta hipossódica
      ['ALU_020', new Date(2025, 3, 18), 'Rafaela Gomes Pinto', new Date(2013, 9, 8), 'CED 01 Plano Piloto', 'CRE-PP', '6º Ano B', 'Matutino', 'PATOLOGIA', 'HIPERTENSAO', '', 'Sal em excesso, Embutidos, Enlatados, Temperos industrializados', true, new Date(2025, 2, 12), new Date(2026, 2, 12), 'SEI-00020/2025', 'I10', 'NORMAL', 'Hipertensão arterial juvenil. Dieta hipossódica. Evitar alimentos ultraprocessados.', 'nutricionista@seedf.gov.br', 'ATIVO']
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CARDÁPIOS ESPECIAIS - Elaborados pela GPAE/UE
  // ═══════════════════════════════════════════════════════════════════════════
  Cardapios_Especiais: {
    headers: ['ID', 'Data_Criacao', 'Tipo_Cardapio', 'Patologia_Dieta', 'Nome_Cardapio', 'Descricao', 'Elaborado_Por', 'Nutricionista_Responsavel', 'Periodo_Vigencia', 'Refeicoes', 'Substituicoes', 'Observacoes', 'Status', 'dataCriacao', 'dataAtualizacao'],
    headerColor: '#ec4899',
    dados: [
      // Cardápios por patologia
      ['CARD_001', new Date(2025, 0, 15), 'PATOLOGIA', 'DIABETES', 'Cardápio Diabéticos - Sem Açúcar', 'Cardápio adaptado para alunos com diabetes, sem adição de açúcar e com controle de carboidratos simples', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Açúcar → Adoçante natural; Suco industrializado → Suco natural sem açúcar; Doces → Frutas', 'Monitorar porções de carboidratos. Preferir alimentos integrais.', 'ATIVO', new Date(), new Date()],
      ['CARD_002', new Date(2025, 0, 15), 'PATOLOGIA', 'DOENCA_CELIACA', 'Cardápio Celíacos - Sem Glúten', 'Cardápio 100% livre de glúten para alunos celíacos', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Pão de trigo → Pão sem glúten; Macarrão → Macarrão de arroz; Farinha de trigo → Farinha de arroz/mandioca', 'Atenção à contaminação cruzada. Utensílios exclusivos.', 'ATIVO', new Date(), new Date()],
      ['CARD_003', new Date(2025, 0, 15), 'PATOLOGIA', 'INTOLERANCIA_LACTOSE', 'Cardápio Sem Lactose', 'Cardápio para alunos com intolerância à lactose', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Leite → Leite sem lactose ou vegetal; Queijo fresco → Queijo maturado; Iogurte → Iogurte sem lactose', 'Verificar rótulos de produtos industrializados.', 'ATIVO', new Date(), new Date()],
      ['CARD_004', new Date(2025, 0, 15), 'PATOLOGIA', 'APLV', 'Cardápio APLV - Sem Proteína do Leite', 'Cardápio para alunos com alergia à proteína do leite de vaca', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Leite → Fórmula especial/Leite vegetal; Manteiga → Óleo vegetal; Queijo → Excluir', 'RISCO DE ANAFILAXIA. Verificar todos os rótulos. Evitar traços de leite.', 'ATIVO', new Date(), new Date()],
      
      // Cardápios por dieta especial
      ['CARD_005', new Date(2025, 1, 1), 'DIETA', 'VEGANO', 'Cardápio Vegano - 100% Vegetal', 'Cardápio completo sem nenhum produto de origem animal', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Carne → Proteína de soja/Tofu/Leguminosas; Leite → Leite de soja/aveia/coco; Ovo → Substitutos vegetais; Mel → Melado de cana', 'Garantir aporte proteico adequado. Suplementar B12 se necessário. Variar fontes de proteína vegetal.', 'ATIVO', new Date(), new Date()],
      ['CARD_006', new Date(2025, 1, 1), 'DIETA', 'VEGETARIANO', 'Cardápio Vegetariano', 'Cardápio sem carnes, com ovos e laticínios', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Carne → Ovo/Queijo/Leguminosas; Frango → Tofu/Proteína de soja', 'Garantir variedade de proteínas vegetais e animais (ovos, laticínios).', 'ATIVO', new Date(), new Date()],
      
      // Cardápios por consistência
      ['CARD_007', new Date(2025, 0, 20), 'CONSISTENCIA', 'DISFAGIA', 'Cardápio Consistência Purê', 'Cardápio com todos os alimentos em consistência de purê para alunos com disfagia', 'GPAE', 'Patrícia Mendes', '2025', 'Café da manhã, Almoço, Lanche', 'Todos os alimentos processados em consistência de purê homogêneo', 'Evitar alimentos com dupla consistência. Espessar líquidos conforme orientação fonoaudiológica.', 'ATIVO', new Date(), new Date()]
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AVALIAÇÕES DO NUTRICIONISTA
  // ═══════════════════════════════════════════════════════════════════════════
  Avaliacoes_Nutricionista: {
    headers: ['ID', 'Data_Avaliacao', 'Cardapio_ID', 'Aluno', 'Escola', 'Tipo_Restricao', 'Nutricionista', 'CRN', 'Parecer', 'Recomendacoes', 'Decisao', 'Proxima_Reavaliacao', 'Observacoes', 'Status', 'dataCriacao', 'dataAtualizacao'],
    headerColor: '#10b981',
    dados: [
      ['AVAL_001', new Date(2025, 0, 20), 'CARD_001', 'Pedro Henrique Silva', 'EC 01 Plano Piloto', 'DIABETES', 'Patrícia Mendes', 'CRN-1 12345', 'Cardápio adequado para controle glicêmico. Substituições corretas de açúcar por adoçantes naturais.', 'Monitorar glicemia; Preferir carboidratos complexos; Evitar sucos industrializados', 'APROVADO', new Date(2025, 6, 20), 'Aluno com bom controle glicêmico', 'EMITIDO', new Date(), new Date()],
      ['AVAL_002', new Date(2025, 0, 22), 'CARD_002', 'Lucas Gabriel Oliveira', 'EC 01 Plano Piloto', 'DOENCA_CELIACA', 'Patrícia Mendes', 'CRN-1 12345', 'Cardápio sem glúten aprovado. Atenção especial à contaminação cruzada na cozinha.', 'Utensílios exclusivos; Verificar rótulos; Evitar aveia não certificada', 'APROVADO', new Date(2025, 6, 22), 'Orientar merendeiras sobre contaminação cruzada', 'EMITIDO', new Date(), new Date()],
      ['AVAL_003', new Date(2025, 1, 5), 'CARD_005', 'Helena Martins Vega', 'EC 01 Plano Piloto', 'VEGANO', 'Patrícia Mendes', 'CRN-1 12345', 'Cardápio vegano nutricionalmente adequado. Garantir variedade de proteínas vegetais.', 'Variar leguminosas; Incluir tofu e tempeh; Verificar suplementação B12', 'APROVADO', new Date(2025, 7, 5), 'Família acompanha com nutricionista particular', 'EMITIDO', new Date(), new Date()]
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSTITUIÇÕES DE ALIMENTOS
  // ═══════════════════════════════════════════════════════════════════════════
  Substituicoes_Alimentos: {
    headers: ['ID', 'Data_Solicitacao', 'Escola', 'Produto_Original', 'Produto_Substituto', 'Motivo', 'Solicitante', 'Nutricionista_Avaliador', 'Data_Avaliacao', 'Parecer_Nutricional', 'Equivalencia_Nutricional', 'Status', 'Observacoes', 'dataCriacao', 'dataAtualizacao'],
    headerColor: '#f59e0b',
    dados: [
      ['SUB_001', new Date(2025, 0, 10), 'EC 01 Plano Piloto', 'Leite Integral 1L', 'Leite Sem Lactose 1L', 'Aluno com intolerância à lactose', 'Roberto Lima', 'Patrícia Mendes', new Date(2025, 0, 11), 'Substituição adequada. Mesmo valor nutricional.', 'SIM', 'APROVADO', 'Manter para aluno João Pedro Almeida', new Date(), new Date()],
      ['SUB_002', new Date(2025, 0, 15), 'EC 02 Asa Sul', 'Pão Francês 50g', 'Pão Sem Glúten 50g', 'Aluna celíaca', 'Fernanda Souza', 'Patrícia Mendes', new Date(2025, 0, 16), 'Substituição aprovada. Verificar fornecedor certificado.', 'SIM', 'APROVADO', 'Para aluna Ana Beatriz Costa', new Date(), new Date()],
      ['SUB_003', new Date(2025, 1, 5), 'EC 01 Plano Piloto', 'Iogurte Natural 170g', 'Iogurte de Soja 170g', 'Aluno vegano', 'Roberto Lima', '', '', '', '', 'PENDENTE', 'Aguardando avaliação nutricional', new Date(), new Date()],
      ['SUB_004', new Date(2025, 1, 8), 'CEF 01 Plano Piloto', 'Ovo Cozido', 'Tofu Grelhado 50g', 'Aluna vegana', 'Ana Paula', '', '', '', '', 'PENDENTE', 'Verificar equivalência proteica', new Date(), new Date()]
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PARECERES TÉCNICOS
  // ═══════════════════════════════════════════════════════════════════════════
  Pareceres_Tecnicos: {
    headers: ['ID', 'Data_Emissao', 'Tipo', 'Assunto', 'Referencia', 'Parecer', 'Conclusao', 'Recomendacoes', 'Nutricionista', 'CRN', 'Status', 'dataCriacao', 'dataAtualizacao'],
    headerColor: '#8b5cf6',
    dados: [
      ['PAR_001', new Date(2025, 0, 18), 'PRODUTO', 'Avaliação de Leite UHT - Marca X', 'NF_001', 'Produto analisado atende aos requisitos nutricionais e de qualidade para alimentação escolar. Rotulagem adequada, informações nutricionais completas.', 'FAVORAVEL', 'Manter fornecedor; Verificar lotes periodicamente', 'Patrícia Mendes', 'CRN-1 12345', 'EMITIDO', new Date(), new Date()],
      ['PAR_002', new Date(2025, 0, 25), 'FORNECEDOR', 'Avaliação Granja Ovos Frescos', 'FOR_006', 'Fornecedor atende aos requisitos sanitários. Ovos de qualidade, embalagem adequada, transporte refrigerado.', 'FAVORAVEL', 'Manter cadastro ativo; Visita técnica semestral', 'Patrícia Mendes', 'CRN-1 12345', 'EMITIDO', new Date(), new Date()],
      ['PAR_003', new Date(2025, 1, 2), 'CARDAPIO', 'Parecer sobre Cardápio Vegano', 'CARD_005', 'Cardápio vegano elaborado atende às necessidades nutricionais. Proteínas vegetais variadas, suplementação de B12 recomendada.', 'FAVORAVEL_COM_RESSALVAS', 'Suplementar vitamina B12; Variar fontes proteicas; Acompanhamento nutricional', 'Patrícia Mendes', 'CRN-1 12345', 'EMITIDO', new Date(), new Date()]
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OCORRÊNCIAS DE DESCARTE
  // ═══════════════════════════════════════════════════════════════════════════
  Ocorrencias_Descarte: {
    headers: ['ID', 'Data_Ocorrencia', 'Escola', 'Produto', 'Quantidade', 'Unidade', 'Motivo_Descarte', 'Lote', 'Validade', 'Fornecedor', 'NF_Referencia', 'Responsavel_Registro', 'Nutricionista_Validacao', 'Data_Validacao', 'Parecer_Nutricional', 'Acao_Corretiva', 'Status', 'Observacoes', 'dataCriacao', 'dataAtualizacao'],
    headerColor: '#ef4444',
    dados: [
      ['DESC_001', new Date(2025, 0, 20), 'EC 01 Plano Piloto', 'Leite Integral 1L', 5, 'UN', 'VALIDADE_VENCIDA', 'LT2025001', new Date(2025, 0, 18), 'Laticínios Bom Gosto', 'NF_004', 'Roberto Lima', 'Patrícia Mendes', new Date(2025, 0, 21), 'Descarte correto. Produto vencido não deve ser consumido.', 'Notificar fornecedor; Revisar controle de estoque', 'VALIDADO', 'Lote com validade curta na entrega', new Date(), new Date()],
      ['DESC_002', new Date(2025, 1, 5), 'EC 02 Asa Sul', 'Maçã Fuji', 3, 'KG', 'CARACTERISTICAS_ALTERADAS', '', '', 'Hortifruti Central', 'NF_MACA_001', 'Fernanda Souza', 'Patrícia Mendes', new Date(2025, 1, 6), 'Frutas com sinais de apodrecimento. Descarte necessário.', 'Verificar condições de armazenamento; Orientar sobre FIFO', 'VALIDADO', 'Frutas armazenadas incorretamente', new Date(), new Date()],
      ['DESC_003', new Date(2025, 1, 10), 'CEF 01 Plano Piloto', 'Ovos Brancos', 2, 'DZ', 'EMBALAGEM_VIOLADA', 'LT2025015', new Date(2025, 2, 10), 'Granja Ovos Frescos', 'NF_OVOS_002', 'Ana Paula', '', '', '', '', 'PENDENTE', 'Ovos quebrados durante transporte', new Date(), new Date()]
    ]
  }
};


// ============================================================================
// FUNÇÕES DE MONTAGEM
// ============================================================================

/**
 * Monta uma planilha específica
 * @param {string} sheetName - Nome da planilha
 * @param {boolean} limparDados - Se deve limpar dados existentes
 * @returns {Object} Resultado
 */
function montarPlanilha(sheetName, limparDados) {
  var config = SHEETS_CONFIG[sheetName];
  if (!config) {
    return { success: false, error: 'Configuração não encontrada: ' + sheetName };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  // Cria planilha se não existir
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    Logger.log('📄 Planilha criada: ' + sheetName);
  }
  
  // Limpa dados se solicitado
  if (limparDados !== false) {
    sheet.clear();
  }
  
  var headers = config.headers;
  var dados = config.dados || [];
  var headerColor = config.headerColor || '#4a86e8';
  
  // Configura headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground(headerColor);
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
  sheet.getRange(1, 1, 1, headers.length).setHorizontalAlignment('center');
  
  // Insere dados
  if (dados.length > 0) {
    sheet.getRange(2, 1, dados.length, headers.length).setValues(dados);
  }
  
  // Formata
  sheet.autoResizeColumns(1, headers.length);
  sheet.setFrozenRows(1);
  
  // Adiciona filtro (remove existente primeiro)
  if (sheet.getLastRow() > 1) {
    try {
      var existingFilter = sheet.getFilter();
      if (existingFilter) {
        existingFilter.remove();
      }
      var range = sheet.getRange(1, 1, sheet.getLastRow(), headers.length);
      range.createFilter();
    } catch (e) {
      Logger.log('Aviso: Não foi possível criar filtro em ' + sheetName + ': ' + e.message);
    }
  }
  
  return {
    success: true,
    sheet: sheetName,
    registros: dados.length
  };
}

/**
 * Monta todas as planilhas do sistema
 */
function montarTodasPlanilhas() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     MONTANDO PLANILHAS DO SISTEMA                                ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var resultados = [];
  var sheetsNames = Object.keys(SHEETS_CONFIG);
  
  sheetsNames.forEach(function(name) {
    var resultado = montarPlanilha(name, true);
    resultados.push(resultado);
    
    if (resultado.success) {
      Logger.log('✅ ' + name + ': ' + resultado.registros + ' registros');
    } else {
      Logger.log('❌ ' + name + ': ' + resultado.error);
    }
  });
  
  return resultados;
}

// ============================================================================
// FUNÇÃO PRINCIPAL - MONTADOR COMPLETO
// ============================================================================

/**
 * FUNÇÃO PRINCIPAL - Monta todo o sistema com dados sintéticos
 * 
 * EXECUTE ESTA FUNÇÃO PARA CONFIGURAR O SISTEMA
 */
function montarSistemaCompleto() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     MONTADOR DO SISTEMA UNIAE CRE                                ║');
  Logger.log('║     Configuração Completa com Dados Sintéticos V2                ║');
  Logger.log('║     ⚠️ SENHAS EM TEXTO PLANO                                      ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var startTime = Date.now();
  
  // 1. Montar todas as planilhas (Estrutura + Dados Básicos)
  var resultados = montarTodasPlanilhas();
  
  // 2. Popular com Dados Sintéticos V2 (Cenários Avançados)
  if (typeof setupDadosSinteticosV2 === 'function') {
    setupDadosSinteticosV2();
  } else {
    Logger.log('⚠️ Aviso: setupDadosSinteticosV2 não encontrado. Pulando dados avançados.');
  }
  
  var duration = Date.now() - startTime;
  
  // Resumo
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     SISTEMA MONTADO COM SUCESSO                                  ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  
  var totalRegistros = 0;
  resultados.forEach(function(r) {
    if (r.success) totalRegistros += r.registros;
  });
  
  Logger.log('║ 📊 Planilhas criadas: ' + resultados.length);
  Logger.log('║ 📝 Total de registros: ' + totalRegistros);
  Logger.log('║ ⏱️ Tempo: ' + duration + 'ms');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  // Credenciais
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     🔑 CREDENCIAIS DE TESTE (TEXTO PLANO)                        ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  ADMIN:        admin@uniae.gov.br        / Admin@2025            ║');
  Logger.log('║  ANALISTA:     analista@uniae.gov.br     / Analista@2025         ║');
  Logger.log('║  FISCAL:       fiscal@uniae.gov.br       / Fiscal@2025           ║');
  Logger.log('║  GESTOR:       gestor@uniae.gov.br       / Gestor@2025           ║');
  Logger.log('║  ESCOLA:       escola@seedf.gov.br       / Escola@2025           ║');
  Logger.log('║  FORNECEDOR:   fornecedor@empresa.com.br / Fornecedor@2025       ║');
  Logger.log('║  NUTRICIONISTA: nutricionista@seedf.gov.br / Nutri@2025          ║');
  Logger.log('║  TESTE:        teste@teste.com           / Teste@123             ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('📌 Para testar os casos de uso, execute: runAllUseCaseTests()');
  
  return {
    success: true,
    planilhas: resultados.length,
    registros: totalRegistros,
    duration: duration
  };
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Lista todas as credenciais de teste
 */
function listarCredenciais() {
  var usuarios = SHEETS_CONFIG.Usuarios.dados;
  var headers = SHEETS_CONFIG.Usuarios.headers;
  
  // Índices conforme USUARIOS_SCHEMA
  var emailIdx = headers.indexOf('email');
  var senhaIdx = headers.indexOf('senha');
  var tipoIdx = headers.indexOf('tipo');
  var instituicaoIdx = headers.indexOf('instituicao');
  
  Logger.log('');
  Logger.log('🔑 CREDENCIAIS DE TESTE (TEXTO PLANO):');
  Logger.log('═══════════════════════════════════════════════');
  
  usuarios.forEach(function(u, i) {
    var tipo = u[tipoIdx] || 'N/A';
    var instituicao = u[instituicaoIdx] || '';
    Logger.log((i + 1) + '. ' + tipo + (instituicao ? ' (' + instituicao + ')' : ''));
    Logger.log('   📧 ' + u[emailIdx]);
    Logger.log('   🔑 ' + u[senhaIdx]);
    Logger.log('');
  });
  
  return usuarios.map(function(u) {
    return {
      email: u[emailIdx],
      senha: u[senhaIdx],
      tipo: u[tipoIdx],
      instituicao: u[instituicaoIdx]
    };
  });
}

/**
 * Reseta uma planilha específica (limpa dados, mantém estrutura)
 */
function resetarPlanilha(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { success: false, error: 'Planilha não encontrada' };
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  Logger.log('✅ Planilha ' + sheetName + ' resetada');
  return { success: true };
}

/**
 * Reseta todas as planilhas (limpa dados, mantém estrutura)
 */
function resetarTodasPlanilhas() {
  var sheetsNames = Object.keys(SHEETS_CONFIG);
  
  sheetsNames.forEach(function(name) {
    resetarPlanilha(name);
  });
  
  Logger.log('✅ Todas as planilhas foram resetadas');
  return { success: true };
}

/**
 * Recarrega dados sintéticos em uma planilha
 */
function recarregarDados(sheetName) {
  return montarPlanilha(sheetName, true);
}

/**
 * Adiciona menu de setup na planilha
 * Só funciona quando chamado do contexto da UI (onOpen, menu, etc.)
 */
function criarMenuSetup() {
  try {
    var ui = SpreadsheetApp.getUi();
    
    ui.createMenu('⚙️ Setup Sistema')
    .addItem('🔧 Montar Sistema Completo', 'montarSistemaCompleto')
    .addSeparator()
    .addItem('🔑 Listar Credenciais', 'listarCredenciais')
    .addSeparator()
    .addSubMenu(ui.createMenu('📄 Montar Planilha Individual')
      .addItem('Usuarios', 'montarUsuarios')
      .addItem('Notas_Fiscais', 'montarNotasFiscais')
      .addItem('Entregas', 'montarEntregas')
      .addItem('Fornecedores', 'montarFornecedores')
      .addItem('Unidades_Escolares', 'montarUnidadesEscolares')
      .addItem('Empenhos', 'montarEmpenhos'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📱 Workflows UNIAE')
      .addItem('🔧 Montar Workflows Completo', 'montarWorkflowsCompleto')
      .addSeparator()
      .addItem('📋 Workflow_NotasFiscais', 'montarWorkflowNotasFiscais')
      .addItem('📦 Workflow_Recebimentos', 'montarWorkflowRecebimentos')
      .addItem('⚖️ Workflow_Analises', 'montarWorkflowAnalises')
      .addSeparator()
      .addItem('🔍 Validar Dados de Teste', 'validarDadosTesteWorkflows')
      .addItem('🗑️ Resetar Workflows', 'resetarWorkflows'))
    .addSubMenu(ui.createMenu('🥗 Nutrição')
      .addItem('🔧 Montar Nutrição Completo', 'montarNutricaoCompleto')
      .addSeparator()
      .addItem('🍽️ Cardapios_Especiais', 'montarCardapiosEspeciais')
      .addItem('📋 Avaliacoes_Nutricionista', 'montarAvaliacoesNutricionista')
      .addItem('🔄 Substituicoes_Alimentos', 'montarSubstituicoesAlimentos')
      .addItem('📝 Pareceres_Tecnicos', 'montarPareceresTecnicos')
      .addItem('🗑️ Ocorrencias_Descarte', 'montarOcorrenciasDescarte')
      .addItem('👤 Alunos_Necessidades_Especiais', 'montarAlunosNecessidadesEspeciais'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔄 Migração')
      .addItem('📋 Migrar NotasFiscais para nova estrutura', 'migrarNotasFiscaisParaNovaEstrutura')
      .addItem('📝 Atualizar Headers NotasFiscais', 'atualizarHeadersNotasFiscais'))
    .addSeparator()
    .addItem('🗑️ Resetar Todas as Planilhas', 'resetarTodasPlanilhas')
    .addToUi();
  } catch (e) {
    // Contexto UI não disponível (chamado de script, trigger, etc.)
    Logger.log('⚠️ criarMenuSetup: Contexto UI não disponível - ' + e.message);
  }
}

// Funções de atalho para montar planilhas individuais
function montarUsuarios() { return montarPlanilha('Usuarios'); }
function montarNotasFiscais() { return montarPlanilha('Notas_Fiscais'); }
function montarEntregas() { return montarPlanilha('Entregas'); }
function montarFornecedores() { return montarPlanilha('Fornecedores'); }
function montarUnidadesEscolares() { return montarPlanilha('Unidades_Escolares'); }
function montarEmpenhos() { return montarPlanilha('Empenhos'); }
function montarGlosas() { return montarPlanilha('Glosas'); }
function montarConferencias() { return montarPlanilha('Controle_Conferencia'); }
function montarAuditoria() { return montarPlanilha('Auditoria_Log'); }

// Funções de atalho para Workflows
function montarWorkflowNotasFiscais() { return montarPlanilha('Workflow_NotasFiscais'); }
function montarWorkflowRecebimentos() { return montarPlanilha('Workflow_Recebimentos'); }
function montarWorkflowAnalises() { return montarPlanilha('Workflow_Analises'); }

// Funções de atalho para Nutrição
function montarCardapiosEspeciais() { return montarPlanilha('Cardapios_Especiais'); }
function montarAvaliacoesNutricionista() { return montarPlanilha('Avaliacoes_Nutricionista'); }
function montarSubstituicoesAlimentos() { return montarPlanilha('Substituicoes_Alimentos'); }
function montarPareceresTecnicos() { return montarPlanilha('Pareceres_Tecnicos'); }
function montarOcorrenciasDescarte() { return montarPlanilha('Ocorrencias_Descarte'); }
function montarAlunosNecessidadesEspeciais() { return montarPlanilha('Alunos_Necessidades_Especiais'); }

/**
 * Migra a aba NotasFiscais antiga para a nova estrutura com campos de produto
 * Execute esta função para atualizar a estrutura da planilha existente
 */
function migrarNotasFiscaisParaNovaEstrutura() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  // Verificar se existe a aba antiga
  var sheetAntiga = ss.getSheetByName('NotasFiscais') || ss.getSheetByName('Notas_Fiscais');
  
  if (!sheetAntiga) {
    ui.alert('Aba NotasFiscais não encontrada. Nada a migrar.');
    return;
  }
  
  var resposta = ui.alert(
    '⚠️ Migrar Estrutura de NotasFiscais',
    'Esta ação irá:\n\n' +
    '1. Renomear a aba atual para "NotasFiscais_Backup"\n' +
    '2. Criar nova aba "Workflow_NotasFiscais" com estrutura atualizada\n' +
    '3. Os dados antigos serão preservados no backup\n\n' +
    'Deseja continuar?',
    ui.ButtonSet.YES_NO
  );
  
  if (resposta !== ui.Button.YES) {
    return;
  }
  
  try {
    // Renomear aba antiga
    var nomeAntigo = sheetAntiga.getName();
    sheetAntiga.setName(nomeAntigo + '_Backup_' + new Date().getTime());
    
    // Criar nova aba com estrutura correta
    montarPlanilha('Workflow_NotasFiscais');
    
    ui.alert(
      '✅ Migração Concluída!',
      'A aba antiga foi renomeada para backup.\n' +
      'Uma nova aba "Workflow_NotasFiscais" foi criada com a estrutura atualizada.\n\n' +
      'Agora você pode cadastrar novas NFs com os campos de produto.',
      ui.ButtonSet.OK
    );
    
  } catch (e) {
    ui.alert('Erro na migração: ' + e.message);
  }
}

/**
 * Atualiza os headers da aba NotasFiscais existente para a nova estrutura
 * Mantém os dados existentes e adiciona as novas colunas
 */
function atualizarHeadersNotasFiscais() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  var sheet = ss.getSheetByName('NotasFiscais') || ss.getSheetByName('Notas_Fiscais');
  
  if (!sheet) {
    ui.alert('Aba NotasFiscais não encontrada.');
    return;
  }
  
  var resposta = ui.alert(
    '⚠️ Atualizar Headers',
    'Esta ação irá atualizar os headers da aba NotasFiscais para a nova estrutura.\n\n' +
    'Os dados existentes serão mantidos, mas podem ficar desalinhados se a estrutura for muito diferente.\n\n' +
    'Deseja continuar?',
    ui.ButtonSet.YES_NO
  );
  
  if (resposta !== ui.Button.YES) {
    return;
  }
  
  try {
    var novosHeaders = ['ID', 'Numero_NF', 'Serie', 'Chave_Acesso', 'Data_Emissao', 'CNPJ', 'Fornecedor_Nome', 'Produto', 'Quantidade', 'Unidade', 'Valor_Unitario', 'Valor_Total', 'Nota_Empenho', 'Status_NF', 'Registrado_Por', 'Data_Registro', 'Observacoes'];
    
    // Atualizar headers
    sheet.getRange(1, 1, 1, novosHeaders.length).setValues([novosHeaders]);
    sheet.getRange(1, 1, 1, novosHeaders.length).setFontWeight('bold').setBackground('#6aa84f').setFontColor('white');
    
    ui.alert('✅ Headers atualizados com sucesso!');
    
  } catch (e) {
    ui.alert('Erro: ' + e.message);
  }
}

/**
 * Monta todas as planilhas do módulo de Nutrição
 */
function montarNutricaoCompleto() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     MONTANDO MÓDULO DE NUTRIÇÃO                                  ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var resultados = [];
  var sheets = [
    'Cardapios_Especiais',
    'Avaliacoes_Nutricionista',
    'Substituicoes_Alimentos',
    'Pareceres_Tecnicos',
    'Ocorrencias_Descarte',
    'Alunos_Necessidades_Especiais'
  ];
  
  sheets.forEach(function(name) {
    var resultado = montarPlanilha(name, true);
    resultados.push(resultado);
    
    if (resultado.success) {
      Logger.log('✅ ' + name + ': ' + resultado.registros + ' registros');
    } else {
      Logger.log('❌ ' + name + ': ' + resultado.error);
    }
  });
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     MÓDULO DE NUTRIÇÃO MONTADO COM SUCESSO                       ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  🍽️ Cardapios_Especiais        - Cardápios por patologia/dieta   ║');
  Logger.log('║  📋 Avaliacoes_Nutricionista   - Avaliações de cardápios         ║');
  Logger.log('║  🔄 Substituicoes_Alimentos    - Substituições pendentes         ║');
  Logger.log('║  📝 Pareceres_Tecnicos         - Pareceres emitidos              ║');
  Logger.log('║  🗑️ Ocorrencias_Descarte       - Descartes para validação        ║');
  Logger.log('║  👤 Alunos_Necessidades_Especiais - Cadastro de alunos           ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  return resultados;
}

/**
 * Monta apenas as planilhas dos 3 workflows principais
 */
function montarWorkflowsCompleto() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     MONTANDO WORKFLOWS UNIAE                                     ║');
  Logger.log('║     Fornecedor → Representante → Analista                        ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var resultados = [];
  var workflows = ['Workflow_NotasFiscais', 'Workflow_Recebimentos', 'Workflow_Analises'];
  
  workflows.forEach(function(name) {
    var resultado = montarPlanilha(name, true);
    resultados.push(resultado);
    
    if (resultado.success) {
      Logger.log('✅ ' + name + ': ' + resultado.registros + ' registros');
    } else {
      Logger.log('❌ ' + name + ': ' + resultado.error);
    }
  });
  
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     WORKFLOWS MONTADOS COM SUCESSO                               ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  📋 Workflow_NotasFiscais    - NFs lançadas pelos fornecedores   ║');
  Logger.log('║  📦 Workflow_Recebimentos    - Recebimentos por escola           ║');
  Logger.log('║  ⚖️ Workflow_Analises        - Análises e autorizações           ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  FLUXO: Fornecedor → Representante Escolar → Analista UNIAE      ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  REGRA CONTÁBIL:                                                 ║');
  Logger.log('║  valorGlosa = (qtdNF - qtdRecebida) × valorUnitario              ║');
  Logger.log('║  valorAprovado = valorNF - valorGlosa                            ║');
  Logger.log('║  INVARIANTE: valorAprovado + valorGlosa = valorNF                ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  Logger.log('📌 Para abrir as interfaces, use o menu: 📱 Workflows');
  
  return resultados;
}

/**
 * Limpa apenas as planilhas dos workflows (mantém estrutura)
 */
function resetarWorkflows() {
  var workflows = ['Workflow_NotasFiscais', 'Workflow_Recebimentos', 'Workflow_Analises'];
  
  workflows.forEach(function(name) {
    resetarPlanilha(name);
  });
  
  Logger.log('✅ Workflows resetados (dados limpos, estrutura mantida)');
  return { success: true };
}

/**
 * Valida integridade contábil dos dados de teste
 */
function validarDadosTesteWorkflows() {
  Logger.log('');
  Logger.log('🔍 Validando dados de teste dos workflows...');
  Logger.log('');
  
  var analises = SHEETS_CONFIG.Workflow_Analises.dados;
  var headers = SHEETS_CONFIG.Workflow_Analises.headers;
  
  var valorNFIdx = headers.indexOf('Valor_NF');
  var valorGlosaIdx = headers.indexOf('Valor_Glosa');
  var valorAprovadoIdx = headers.indexOf('Valor_Aprovado');
  var idIdx = headers.indexOf('ID');
  
  var todosOK = true;
  
  analises.forEach(function(row) {
    var id = row[idIdx];
    var valorNF = row[valorNFIdx];
    var valorGlosa = row[valorGlosaIdx];
    var valorAprovado = row[valorAprovadoIdx];
    var soma = valorGlosa + valorAprovado;
    var ok = Math.abs(soma - valorNF) < 0.01;
    
    if (ok) {
      Logger.log('✅ ' + id + ': R$ ' + valorAprovado.toFixed(2) + ' + R$ ' + valorGlosa.toFixed(2) + ' = R$ ' + valorNF.toFixed(2));
    } else {
      Logger.log('❌ ' + id + ': R$ ' + valorAprovado.toFixed(2) + ' + R$ ' + valorGlosa.toFixed(2) + ' = R$ ' + soma.toFixed(2) + ' ≠ R$ ' + valorNF.toFixed(2));
      todosOK = false;
    }
  });
  
  Logger.log('');
  Logger.log(todosOK ? '✅ Todos os dados de teste estão contabilmente corretos!' : '❌ Há erros contábeis nos dados de teste');
  
  return { success: todosOK };
}

// ============================================================================
// FUNÇÕES DE AJUDA E INICIALIZAÇÃO GUIADA
// ============================================================================

/**
 * Mostra ajuda rápida do sistema
 */
function mostrarAjuda() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     🍎 SISTEMA UNIAE CRE - AJUDA RÁPIDA                          ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  📋 FUNÇÕES PRINCIPAIS:                                          ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  montarSistemaCompleto()    - Cria todas as planilhas            ║');
  Logger.log('║  montarWorkflowsCompleto()  - Cria apenas os 3 workflows         ║');
  Logger.log('║  listarCredenciais()        - Mostra usuários de teste           ║');
  Logger.log('║  validarDadosTesteWorkflows() - Valida integridade contábil      ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  📱 MENU WORKFLOWS (após montar):                                ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  📊 Dashboard         - Métricas e indicadores                   ║');
  Logger.log('║  📋 Fornecedor        - Lançar Notas Fiscais                     ║');
  Logger.log('║  📦 Escola            - Registrar Recebimentos                   ║');
  Logger.log('║  ⚖️ Analista          - Validar e Autorizar Pagamentos           ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  🧪 DADOS DE TESTE:                                              ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  3 Gêneros: Pão Brioche (UN), Ovos (DZ), Maçãs (KG)              ║');
  Logger.log('║  2 Escolas: EC 01 Plano Piloto, EC 02 Asa Sul                    ║');
  Logger.log('║  4 Fluxos: Aprovado Total, Glosado (2x), Rejeitado               ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
}

/**
 * Inicialização guiada do sistema
 */
function inicializarSistema() {
  Logger.log('');
  Logger.log('🚀 Iniciando configuração do sistema UNIAE CRE...');
  Logger.log('');
  
  // 1. Montar sistema
  Logger.log('📦 Passo 1/3: Criando planilhas e dados de teste...');
  var resultado = montarSistemaCompleto();
  
  if (!resultado.success) {
    Logger.log('❌ Erro ao montar sistema');
    return { success: false, error: 'Falha na montagem' };
  }
  
  // 2. Validar dados
  Logger.log('');
  Logger.log('✅ Passo 2/3: Validando integridade contábil...');
  var validacao = validarDadosTesteWorkflows();
  
  // 3. Criar menu
  Logger.log('');
  Logger.log('📱 Passo 3/3: Configurando menu...');
  try {
    adicionarMenuWorkflows();
    Logger.log('✅ Menu criado com sucesso');
  } catch (e) {
    Logger.log('⚠️ Menu será criado ao reabrir a planilha');
  }
  
  // Resumo final
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     ✅ SISTEMA INICIALIZADO COM SUCESSO!                         ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  📊 ' + resultado.planilhas + ' planilhas criadas                                      ║');
  Logger.log('║  📝 ' + resultado.registros + ' registros inseridos                                    ║');
  Logger.log('║  ✅ Validação contábil: ' + (validacao.success ? 'OK' : 'VERIFICAR') + '                              ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  🎯 PRÓXIMOS PASSOS:                                             ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  1. Acesse o menu 📱 Workflows na barra de menus                 ║');
  Logger.log('║  2. Clique em 📊 Dashboard para ver métricas                     ║');
  Logger.log('║  3. Teste os 3 workflows: Fornecedor → Escola → Analista         ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  return { success: true, resultado: resultado, validacao: validacao };
}

/**
 * Mostra resumo dos dados sintéticos de teste
 */
function mostrarDadosTeste() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     🧪 DADOS SINTÉTICOS DE TESTE                                 ║');
  Logger.log('╠═══════════════════════════════════════════════════════════════════╣');
  Logger.log('║                                                                   ║');
  Logger.log('║  📦 GÊNEROS ALIMENTÍCIOS:                                        ║');
  Logger.log('║  ┌─────────────────────────────────────────────────────────────┐ ║');
  Logger.log('║  │ Pão Brioche Artesanal 50g  │ UN │ R$ 2,50  │ Panificadora   │ ║');
  Logger.log('║  │ Ovos Brancos Tipo Grande   │ DZ │ R$ 18,00 │ Granja         │ ║');
  Logger.log('║  │ Maçã Fuji Nacional         │ KG │ R$ 8,50  │ Hortifruti     │ ║');
  Logger.log('║  └─────────────────────────────────────────────────────────────┘ ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  🏫 ESCOLAS:                                                     ║');
  Logger.log('║  ┌─────────────────────────────────────────────────────────────┐ ║');
  Logger.log('║  │ EC 01 Plano Piloto │ Recebe CONFORME    │ Roberto Lima     │ ║');
  Logger.log('║  │ EC 02 Asa Sul      │ Recebe PARCIAL     │ Fernanda Souza   │ ║');
  Logger.log('║  └─────────────────────────────────────────────────────────────┘ ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  📊 FLUXOS DEMONSTRADOS:                                         ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  ✅ APROVADO_TOTAL (Pão Brioche)                                 ║');
  Logger.log('║     500 UN × R$ 2,50 = R$ 1.250,00 → Pagamento integral          ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  ⚠️ GLOSADO (Ovos)                                               ║');
  Logger.log('║     100 DZ × R$ 18,00 = R$ 1.800,00                              ║');
  Logger.log('║     Recebido: 90 DZ → Glosa: R$ 180,00                           ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  ⚠️ GLOSADO (Maçãs)                                              ║');
  Logger.log('║     200 KG × R$ 8,50 = R$ 1.700,00                               ║');
  Logger.log('║     Recebido: 180 KG → Glosa: R$ 170,00                          ║');
  Logger.log('║                                                                   ║');
  Logger.log('║  ❌ REJEITADO (Ovos - temperatura)                               ║');
  Logger.log('║     50 DZ × R$ 18,00 = R$ 900,00 → Sem pagamento                 ║');
  Logger.log('║                                                                   ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
}

/**
 * Teste rápido dos 3 workflows principais
 * Verifica se as funções básicas estão funcionando
 */
function testeRapidoWorkflows() {
  Logger.log('');
  Logger.log('╔═══════════════════════════════════════════════════════════════════╗');
  Logger.log('║     🧪 TESTE RÁPIDO DOS WORKFLOWS                                ║');
  Logger.log('╚═══════════════════════════════════════════════════════════════════╝');
  Logger.log('');
  
  var resultados = { passou: 0, falhou: 0, erros: [] };
  
  // Teste 1: Listar NFs
  try {
    var nfs = listarNotasFiscais();
    Logger.log('✅ listarNotasFiscais(): ' + (nfs ? nfs.length : 0) + ' NFs');
    resultados.passou++;
  } catch (e) {
    Logger.log('❌ listarNotasFiscais(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('listarNotasFiscais: ' + e.message);
  }
  
  // Teste 2: Listar NFs pendentes para escola
  try {
    var nfsPendentes = listarNFsPendentesParaEscola('EC 01 Plano Piloto');
    Logger.log('✅ listarNFsPendentesParaEscola(): ' + (nfsPendentes ? nfsPendentes.length : 0) + ' NFs pendentes');
    resultados.passou++;
  } catch (e) {
    Logger.log('❌ listarNFsPendentesParaEscola(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('listarNFsPendentesParaEscola: ' + e.message);
  }
  
  // Teste 3: Listar NFs para análise
  try {
    var nfsAnalise = listarNFsParaAnalise();
    Logger.log('✅ listarNFsParaAnalise(): ' + (nfsAnalise ? nfsAnalise.length : 0) + ' NFs para análise');
    resultados.passou++;
  } catch (e) {
    Logger.log('❌ listarNFsParaAnalise(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('listarNFsParaAnalise: ' + e.message);
  }
  
  // Teste 4: Listar escolas
  try {
    var escolas = listarEscolasDisponiveis();
    Logger.log('✅ listarEscolasDisponiveis(): ' + (escolas ? escolas.length : 0) + ' escolas');
    resultados.passou++;
  } catch (e) {
    Logger.log('❌ listarEscolasDisponiveis(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('listarEscolasDisponiveis: ' + e.message);
  }
  
  // Teste 5: Obter métricas
  try {
    var metricas = obterMetricasWorkflows();
    Logger.log('✅ obterMetricasWorkflows(): ' + (metricas.success ? 'OK' : 'ERRO'));
    resultados.passou++;
  } catch (e) {
    Logger.log('❌ obterMetricasWorkflows(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('obterMetricasWorkflows: ' + e.message);
  }
  
  // Teste 6: Calcular valores contábeis
  try {
    var calc = calcularValoresContabeis(100, 90, 10.00);
    var ok = calc.valorNF === 1000 && calc.valorGlosa === 100 && calc.valorAprovado === 900;
    Logger.log('✅ calcularValoresContabeis(): ' + (ok ? 'Cálculo correto' : 'ERRO no cálculo'));
    if (ok) resultados.passou++;
    else {
      resultados.falhou++;
      resultados.erros.push('calcularValoresContabeis: Cálculo incorreto');
    }
  } catch (e) {
    Logger.log('❌ calcularValoresContabeis(): ' + e.message);
    resultados.falhou++;
    resultados.erros.push('calcularValoresContabeis: ' + e.message);
  }
  
  // Resumo
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════════════════════');
  Logger.log('RESULTADO: ' + resultados.passou + ' passou, ' + resultados.falhou + ' falhou');
  if (resultados.erros.length > 0) {
    Logger.log('ERROS:');
    resultados.erros.forEach(function(e) { Logger.log('  • ' + e); });
  }
  Logger.log('═══════════════════════════════════════════════════════════════════');
  
  return resultados;
}

// Log de carregamento
Logger.log('✅ Setup_Sheets_Builder.gs carregado');
Logger.log('   📌 Execute inicializarSistema() para configuração guiada');
Logger.log('   📌 Execute testeRapidoWorkflows() para verificar funcionamento');
