/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Truck, Route, Driver, OmissionCollection, StopHeatmapPoint, CollectionSummary, EfficiencyAlert } from './types';

// ----------------------------------------------------
// 1. DADOS SIMULADOS (MOCK TELEMETRIA & OPERAÇÃO)
// ----------------------------------------------------

export const MOCK_TRUCKS: Truck[] = [
  { id: 1, placa: "BRA-2D98", modelo: "Volkswagen Constellation 17.260 Compactor", ano: 2021, capacidade_kg: 8000, consumo_medio_km_l: 2.2, status_operacional: "em_coleta" },
  { id: 2, placa: "RTV-0V12", modelo: "Mercedes-Benz Atego 1729 Kolector", ano: 2022, capacidade_kg: 9000, consumo_medio_km_l: 2.4, status_operacional: "em_coleta" },
  { id: 3, placa: "COB-1B44", modelo: "Volvo VM 270 6x2 Clássico", ano: 2020, capacidade_kg: 12000, consumo_medio_km_l: 1.8, status_operacional: "parado" },
  { id: 4, placa: "MAN-9U87", modelo: "Scania P280 Coletor Compactador", ano: 2023, capacidade_kg: 10000, consumo_medio_km_l: 2.1, status_operacional: "manutencao" },
  { id: 5, placa: "ECO-4F12", modelo: "Ford Cargo 1723 Compactdor", ano: 2018, capacidade_kg: 7500, consumo_medio_km_l: 2.5, status_operacional: "ativo" },
  { id: 6, placa: "RES-8K56", modelo: "Mercedes-Benz Accelo 1016 (Mini)", ano: 2019, capacidade_kg: 4000, consumo_medio_km_l: 3.2, status_operacional: "ativo" }
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 1, id_usuario: 101, nome: "Carlos Eduardo Silva", email: "carlos.du@rotaverde.gov.br", telefone: "(11) 98765-4321", cnh: "12345678901D", status_ativo: true },
  { id: 2, id_usuario: 102, nome: "Marcos Antônio Prado", email: "marcos.prado@rotaverde.gov.br", telefone: "(11) 97654-3210", cnh: "98765432104D", status_ativo: true },
  { id: 3, id_usuario: 103, nome: "Ana Paula Bezerra", email: "ana.paula@rotaverde.gov.br", telefone: "(11) 96543-2101", cnh: "45678901234E", status_ativo: true },
  { id: 4, id_usuario: 104, nome: "Roberto de Souza", email: "roberto.souza@rotaverde.gov.br", telefone: "(11) 95432-1098", cnh: "65432109874D", status_ativo: true },
  { id: 5, id_usuario: 105, nome: "Juliana Mendes Reis", email: "juliana.mendes@rotaverde.gov.br", telefone: "(11) 94321-0987", cnh: "32109876541D", status_ativo: false }
];

export const MOCK_ROUTES: Route[] = [
  { id: 1, nome_rota: "Centro & Uraim", descricao: "Abrange bairros residenciais centrais do município de Paragominas e imediações do Rio Uraim.", distancia_estimada_km: 42.5, combustivel_estimado_l: 20.0, status_ativo: true },
  { id: 2, nome_rota: "Cidade Nova & PA-125", descricao: "Percurso comercial estrito cruzando a Rodovia PA-125 e vias movimentadas do bairro Cidade Nova.", distancia_estimada_km: 26.8, combustivel_estimado_l: 15.0, status_ativo: true },
  { id: 3, nome_rota: "Polo Moveleiro & Industrial", descricao: "Zonas industriais e madeireiras do polo moveleiro florestal de Paragominas. Resíduos volumosos.", distancia_estimada_km: 74.0, combustivel_estimado_l: 35.0, status_ativo: true },
  { id: 4, nome_rota: "Planalto & Promissão", descricao: "Rotas urbanas declivosas do bairro Promissão e Planalto, exigindo esforço mecânico constante.", distancia_estimada_km: 35.5, combustivel_estimado_l: 18.0, status_ativo: true },
  { id: 5, nome_rota: "Juparanã, JK & Morada Verde", descricao: "Avenidas adjacentes, condomínio de chácaras e loteamentos em expansão periférica do município.", distancia_estimada_km: 51.2, combustivel_estimado_l: 22.0, status_ativo: true }
];

// Omissões de Coleta (Pontos Críticos baseados na regra: falha de coleta em 2 ou mais ciclos consecutivos)
export const MOCK_OMISSIONS: OmissionCollection[] = [
  { id: 1, id_rota: 1, nome_rua: "Avenida Presidente Vargas, 452 (Centro)", latitude: -2.9985, longitude: -47.3522, ciclos_consecutivos_falhos: 3, motivo: "Veículos de moradores estacionados de forma irregular na calçada de comércio, bloqueando passagem física do caminhão compactador.", tipo_resíduo_comum: "Resíduo Seco Reciclável / Orgânico Comum" },
  { id: 2, id_rota: 1, nome_rua: "Marginal do Rio Uraim, Km 1.5 (Uraim)", latitude: -3.0045, longitude: -47.3482, ciclos_consecutivos_falhos: 2, motivo: "Construções históricas irregulares avançadas sobre o leito carroçável e fiação elétrica de baixa altura suspeita.", tipo_resíduo_comum: "Entulho Leve / Orgânico" },
  { id: 3, id_rota: 4, nome_rua: "Alameda Pará, Quadra 12 (Planalto)", latitude: -2.9785, longitude: -47.3485, ciclos_consecutivos_falhos: 4, motivo: "Forte aclive associado a erosões de chuva não pavimentadas, gerando risco severo de derrapagem e atolamento.", tipo_resíduo_comum: "Resíduos Verdes Orgânicos" },
  { id: 4, id_rota: 2, nome_rua: "Rua do Comércio, Próximo ao Mercado (Centro)", latitude: -2.9912, longitude: -47.3615, ciclos_consecutivos_falhos: 2, motivo: "Feira livre municipal que obstrui o acesso ao containidor ecológico nos períodos matutinos operacionais.", tipo_resíduo_comum: "Frutas e Vegetais em Estágio de Decomposição" }
];

// Indicadores Volumétricos por Tempo de Permanência Operacional (velocidade = 0 com ignição ligada)
export const MOCK_HEATMAP_POINTS: StopHeatmapPoint[] = [
  { id: 1, id_rota: 1, latitude: -2.9990, longitude: -47.3530, tempo_parado_segundos: 620, volume_estimado_kg: 840, logradouro: "Av. Pres. Vargas, Loja Comercial Centro" },
  { id: 2, id_rota: 1, latitude: -3.0210, longitude: -47.3420, tempo_parado_segundos: 450, volume_estimado_kg: 560, logradouro: "Rodovia PA-125, Posto de Combustível Sete Estrelas" },
  { id: 3, id_rota: 2, latitude: -2.9840, longitude: -47.3570, tempo_parado_segundos: 1210, volume_estimado_kg: 1650, logradouro: "Avenida Marechal Rondon - Supermercado Cidade" },
  { id: 4, id_rota: 2, latitude: -3.0030, longitude: -47.3620, tempo_parado_segundos: 850, volume_estimado_kg: 1100, logradouro: "Rua do Bosque - Parque Ambiental de Paragominas" },
  { id: 5, id_rota: 3, latitude: -3.0180, longitude: -47.3680, tempo_parado_segundos: 1800, volume_estimado_kg: 3200, logradouro: "Eixo Industrial, CD Madeira Paragominas" },
  { id: 6, id_rota: 4, latitude: -3.0120, longitude: -47.3390, tempo_parado_segundos: 520, volume_estimado_kg: 710, logradouro: "Avenida Tamandaré, Escola Estadual de Promissão" },
  { id: 7, id_rota: 5, latitude: -3.0285, longitude: -47.3325, tempo_parado_segundos: 390, volume_estimado_kg: 480, logradouro: "Via Industrial, Serraria Ecológica Pará" }
];

// Sumário Histórico de Coletas Realizadas por período (Últimos 30 Dias)
export const MOCK_COLLECTIONS: CollectionSummary[] = [
  // Semana Atual (08/06 em diante)
  { id: 1, id_rota: 1, nome_rota: "Centro & Uraim", data_coleta: "2026-06-08", km_percorridos: 41.8, combustivel_gasto_l: 18.5, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 1, placa_caminhao: "BRA-2D98", peso_coletado_kg: 7420, status: "concluida" },
  { id: 2, id_rota: 2, nome_rota: "Cidade Nova & PA-125", data_coleta: "2026-06-08", km_percorridos: 27.2, combustivel_gasto_l: 14.8, id_motorista: 2, nome_motorista: "Marcos Antônio Prado", id_caminhao: 2, placa_caminhao: "RTV-0V12", peso_coletado_kg: 8900, status: "concluida" },
  { id: 3, id_rota: 3, nome_rota: "Polo Moveleiro & Industrial", data_coleta: "2026-06-07", km_percorridos: 73.1, combustivel_gasto_l: 43.1, id_motorista: 3, nome_motorista: "Ana Paula Bezerra", id_caminhao: 3, placa_caminhao: "COB-1B44", peso_coletado_kg: 11400, status: "concluida" }, // ALERTA: Gasto excessivo de combustível!
  { id: 4, id_rota: 4, nome_rota: "Planalto & Promissão", data_coleta: "2026-06-07", km_percorridos: 34.9, combustivel_gasto_l: 16.2, id_motorista: 4, nome_motorista: "Roberto de Souza", id_caminhao: 5, placa_caminhao: "ECO-4F12", peso_coletado_kg: 5310, status: "parcial" },
  
  // Semana Passada (01/06 a 07/06)
  { id: 5, id_rota: 1, nome_rota: "Centro & Uraim", data_coleta: "2026-06-05", km_percorridos: 42.0, combustivel_gasto_l: 18.1, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 1, placa_caminhao: "BRA-2D98", peso_coletado_kg: 7600, status: "concluida" },
  { id: 6, id_rota: 2, nome_rota: "Cidade Nova & PA-125", data_coleta: "2026-06-05", km_percorridos: 26.5, combustivel_gasto_l: 13.5, id_motorista: 2, nome_motorista: "Marcos Antônio Prado", id_caminhao: 2, placa_caminhao: "RTV-0V12", peso_coletado_kg: 8750, status: "concluida" },
  { id: 7, id_rota: 4, nome_rota: "Planalto & Promissão", data_coleta: "2026-06-04", km_percorridos: 35.8, combustivel_gasto_l: 23.5, id_motorista: 4, nome_motorista: "Roberto de Souza", id_caminhao: 3, placa_caminhao: "COB-1B44", peso_coletado_kg: 5900, status: "concluida" }, // ALERTA: Gasto excessivo caminhão 3!
  { id: 8, id_rota: 5, nome_rota: "Juparanã, JK & Morada Verde", data_coleta: "2026-06-03", km_percorridos: 51.5, combustivel_gasto_l: 21.0, id_motorista: 3, nome_motorista: "Ana Paula Bezerra", id_caminhao: 5, placa_caminhao: "ECO-4F12", peso_coletado_kg: 7120, status: "concluida" },
  { id: 9, id_rota: 1, nome_rota: "Centro & Uraim", data_coleta: "2026-06-01", km_percorridos: 39.5, combustivel_gasto_l: 17.5, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 1, placa_caminhao: "BRA-2D98", peso_coletado_kg: 6100, status: "parcial" },
  
  // Duas Semanas Atrás (25/05 a 31/05)
  { id: 10, id_rota: 1, nome_rota: "Centro & Uraim", data_coleta: "2026-05-29", km_percorridos: 43.1, combustivel_gasto_l: 19.3, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 1, placa_caminhao: "BRA-2D98", peso_coletado_kg: 7900, status: "concluida" },
  { id: 11, id_rota: 2, nome_rota: "Cidade Nova & PA-125", data_coleta: "2026-05-29", km_percorridos: 26.9, combustivel_gasto_l: 14.1, id_motorista: 2, nome_motorista: "Marcos Antônio Prado", id_caminhao: 2, placa_caminhao: "RTV-0V12", peso_coletado_kg: 9100, status: "concluida" },
  { id: 12, id_rota: 3, nome_rota: "Polo Moveleiro & Industrial", data_coleta: "2026-05-27", km_percorridos: 74.2, combustivel_gasto_l: 34.0, id_motorista: 3, nome_motorista: "Ana Paula Bezerra", id_caminhao: 3, placa_caminhao: "COB-1B44", peso_coletado_kg: 11800, status: "concluida" },
  { id: 13, id_rota: 4, nome_rota: "Planalto & Promissão", data_coleta: "2026-05-26", km_percorridos: 35.1, combustivel_gasto_l: 15.1, id_motorista: 4, nome_motorista: "Roberto de Souza", id_caminhao: 5, placa_caminhao: "ECO-4F12", peso_coletado_kg: 5120, status: "concluida" },
  { id: 14, id_rota: 5, nome_rota: "Juparanã, JK & Morada Verde", data_coleta: "2026-05-25", km_percorridos: 50.8, combustivel_gasto_l: 20.8, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 6, placa_caminhao: "RES-8K56", peso_coletado_kg: 3820, status: "concluida" },

  // Três Semanas Atrás (18/05 a 24/05)
  { id: 15, id_rota: 1, nome_rota: "Centro & Uraim", data_coleta: "2026-05-22", km_percorridos: 42.5, combustivel_gasto_l: 18.0, id_motorista: 1, nome_motorista: "Carlos Eduardo Silva", id_caminhao: 1, placa_caminhao: "BRA-2D98", peso_coletado_kg: 7490, status: "concluida" },
  { id: 16, id_rota: 2, nome_rota: "Cidade Nova & PA-125", data_coleta: "2026-05-22", km_percorridos: 26.8, combustivel_gasto_l: 13.9, id_motorista: 2, nome_motorista: "Marcos Antônio Prado", id_caminhao: 2, placa_caminhao: "RTV-0V12", peso_coletado_kg: 8600, status: "concluida" },
  { id: 17, id_rota: 3, nome_rota: "Polo Moveleiro & Industrial", data_coleta: "2026-05-20", km_percorridos: 72.9, combustivel_gasto_l: 45.3, id_motorista: 3, nome_motorista: "Ana Paula Bezerra", id_caminhao: 3, placa_caminhao: "COB-1B44", peso_coletado_kg: 10900, status: "concluida" }, // ALERTA: Gasto excessivo!
  { id: 18, id_rota: 4, nome_rota: "Planalto & Promissão", data_coleta: "2026-05-19", km_percorridos: 35.3, combustivel_gasto_l: 15.0, id_motorista: 4, nome_motorista: "Roberto de Souza", id_caminhao: 5, placa_caminhao: "ECO-4F12", peso_coletado_kg: 5090, status: "concluida" },
];

// Cálculo automático de Alertas de Consumo Inexistente de Combustível (regra de cálculo de desvio RF07)
export function getEfficiencyAlerts(history: CollectionSummary[]): EfficiencyAlert[] {
  const alerts: EfficiencyAlert[] = [];
  
  // Agrupar execuções recentes por caminhão
  const truckStats = new Map<number, { km: number; combustivel: number; count: number }>();
  
  history.forEach(c => {
    const stat = truckStats.get(c.id_caminhao) || { km: 0, combustivel: 0, count: 0 };
    stat.km += c.km_percorridos;
    stat.combustivel += c.combustivel_gasto_l;
    stat.count += 1;
    truckStats.set(c.id_caminhao, stat);
  });
  
  truckStats.forEach((stat, idCaminhao) => {
    const caminhao = MOCK_TRUCKS.find(t => t.id === idCaminhao);
    if (!caminhao) return;
    
    const kmReal = stat.km;
    const lReal = stat.combustivel;
    const consumoReal = kmReal / lReal; // km/L real
    const consumoPadrao = caminhao.consumo_medio_km_l; // km/L padrão
    
    // Desvio de eficiência: se consumoReal é menor que o padrão, gasta mais combustível por km.
    // % Ineficiência = ((Consumo Padrão - Consumo Real) / Consumo Padrão) * 100
    if (consumoReal < consumoPadrao) {
      const desvioPercentual = ((consumoPadrao - consumoReal) / consumoPadrao) * 100;
      
      let grau_alerta: 'Média' | 'Alta' | 'Crítica' = 'Média';
      if (desvioPercentual > 20) grau_alerta = 'Crítica';
      else if (desvioPercentual > 10) grau_alerta = 'Alta';
      
      alerts.push({
        id: alerts.length + 1,
        id_caminhao: idCaminhao,
        placa: caminhao.placa,
        modelo: caminhao.modelo,
        km_percorridos: Math.round(kmReal * 100) / 100,
        combustivel_gasto_l: Math.round(lReal * 100) / 100,
        consumo_estimado_km_l: consumoPadrao,
        consumo_real_km_l: Math.round(consumoReal * 100) / 100,
        desvio_percentual: Math.round(desvioPercentual * 100) / 100,
        grau_alerta
      });
    }
  });
  
  return alerts.sort((a, b) => b.desvio_percentual - a.desvio_percentual);
}


// ----------------------------------------------------
// 2. MODELAGEM DO BANCO DE DADOS (PARSED WORKBENCH)
// ----------------------------------------------------

export interface DbTable {
  name: string;
  comment: string;
  columns: { name: string; type: string; key?: 'PK' | 'FK' | 'UK'; notNull: boolean; defaultValue?: string; comment?: string }[];
  indexes: { name: string; type: string; columns: string[] }[];
}

export const DATABASE_SCHEMA: DbTable[] = [
  {
    name: "usuarios",
    comment: "Tabela principal de credenciais de usuários e dados básicos de login (LGPD compliant).",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_tipo_usuario", type: "int", key: "FK", notNull: true, comment: "Chave estrangeira referenciando tipo_usuario." },
      { name: "nome", type: "varchar(150)", notNull: true },
      { name: "email", type: "varchar(150)", key: "UK", notNull: true },
      { name: "senha_hash", type: "varchar(255)", notNull: true, comment: "Hash seguro SHA-256/bcrypt." },
      { name: "telefone", type: "varchar(20)", notNull: false },
      { name: "aceite_termos_lgpd", type: "tinyint(1)", notNull: true, defaultValue: "0", comment: "Termo de Consentimento aceito no cadastro." },
      { name: "created_at", type: "datetime", notNull: true, defaultValue: "CURRENT_TIMESTAMP" },
      { name: "deleted_at", type: "datetime", notNull: false, comment: "Soft delete exigido pela LGPD." }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "uq_usuario_email", type: "UNIQUE", columns: ["email"] },
      { name: "fk_usuario_tipo_idx", type: "INDEX", columns: ["id_tipo_usuario"] }
    ]
  },
  {
    name: "tipo_usuario",
    comment: "Tabela de domínio que especifica os papéis (Admin, Motorista, Cidadão, Fiscal).",
    columns: [
      { name: "id", type: "int (Auto-Increment)", key: "PK", notNull: true },
      { name: "descricao", type: "varchar(50)", key: "UK", notNull: true, comment: "Ex: 'admin', 'motorista', 'cidadao'" }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "uq_tipo_usuario_desc", type: "UNIQUE", columns: ["descricao"] }
    ]
  },
  {
    name: "motoristas",
    comment: "Subclasse de usuários contendo dados específicos de CNH de motoristas operacionais.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_usuario", type: "bigint", key: "FK", notNull: true, comment: "1:1 FK estrita ligada a tabela usuarios." },
      { name: "id_caminhao_atual", type: "bigint", key: "FK", notNull: false, comment: "Caminhão temporariamente associado no turno." },
      { name: "cnh", type: "varchar(50)", key: "UK", notNull: true },
      { name: "status_ativo", type: "tinyint(1)", notNull: true, defaultValue: "1" },
      { name: "created_at", type: "datetime", notNull: true, defaultValue: "CURRENT_TIMESTAMP" }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "uq_motorista_cnh", type: "UNIQUE", columns: ["cnh"] },
      { name: "uq_motorista_usuario", type: "UNIQUE", columns: ["id_usuario"] },
      { name: "fk_motorista_caminhao_idx", type: "INDEX", columns: ["id_caminhao_atual"] }
    ]
  },
  {
    name: "caminhoes",
    comment: "Frota cadastrada no município de RotaVerde.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "placa", type: "varchar(15)", key: "UK", notNull: true },
      { name: "modelo", type: "varchar(100)", notNull: false },
      { name: "ano", type: "smallint", notNull: false },
      { name: "capacidade_kg", type: "decimal(10,2)", notNull: false, comment: "Carga total nominal autorizada." },
      { name: "consumo_medio_km_l", type: "decimal(7,3)", notNull: false, comment: "Consumo padrão de fábrica usado para detecção de anomalias." },
      { name: "status_operacional", type: "enum", notNull: true, defaultValue: "'ativo'", comment: "Values: ('ativo', 'em_coleta', 'parado', 'manutencao', 'inativo')" }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "uq_caminhao_placa", type: "UNIQUE", columns: ["placa"] }
    ]
  },
  {
    name: "rotas",
    comment: "Macro-rotas de coleta mapeadas contendo especificações estimadas de distância e volumetria.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_caminhao_padrao", type: "bigint", key: "FK", notNull: false, comment: "Caminhão ideal configurado para a rota urbana." },
      { name: "nome_rota", type: "varchar(150)", notNull: true },
      { name: "descricao", type: "text", notNull: false },
      { name: "distancia_estimada_km", type: "decimal(9,3)", notNull: false },
      { name: "combustivel_estimado_l", type: "decimal(9,3)", notNull: false },
      { name: "trajeto_geo_json", type: "json", notNull: false, comment: "LineString das coordenadas oficiais do trajeto georreferenciado." },
      { name: "status_ativo", type: "tinyint(1)", notNull: true, defaultValue: "1" }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "fk_rota_caminhao_idx", type: "INDEX", columns: ["id_caminhao_padrao"] }
    ]
  },
  {
    name: "pontos_coleta",
    comment: "Localizações exatas (coordenadas) onde os caminhões devem passar em ciclos urbanos de coleta.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_rota", type: "bigint", key: "FK", notNull: true },
      { name: "nome_local", type: "varchar(200)", notNull: false },
      { name: "endereco", type: "varchar(250)", notNull: false },
      { name: "latitude", type: "decimal(10,8)", notNull: true },
      { name: "longitude", type: "decimal(10,8)", notNull: true },
      { name: "volume_estimado_kg", type: "decimal(10,2)", notNull: false },
      { name: "recorrencia_critica", type: "int", notNull: true, defaultValue: "0", comment: "Contador de falhas consecutivas para indicação de pontos críticos (omissão)." }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "fk_ponto_rota_idx", type: "INDEX", columns: ["id_rota"] },
      { name: "idx_ponto_coords", type: "INDEX", columns: ["latitude", "longitude"] }
    ]
  },
  {
    name: "coletas_realizadas",
    comment: "Tabela agregada para armazenamento do resultado consolidado semanal/diário de cada viagem de coleta.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_motorista", type: "bigint", key: "FK", notNull: true },
      { name: "id_ponto", type: "bigint", key: "FK", notNull: true },
      { name: "id_rota", type: "bigint", key: "FK", notNull: true },
      { name: "data_hora_chegada", type: "datetime", notNull: false },
      { name: "data_hora_saida", type: "datetime", notNull: false },
      { name: "confirmacao_digital", type: "tinyint(1)", notNull: true, defaultValue: "0", comment: "Confirmado no App pelo motorista operando." },
      { name: "status", type: "enum", notNull: true, defaultValue: "'pendente'", comment: "Values: ('pendente', 'concluida', 'falha', 'ignorado')" },
      { name: "tempo_parada_min", type: "int", notNull: false, defaultValue: "0", comment: "Duração calculada: Saída - Chegada na coordenada." }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "fk_coleta_motorista_idx", type: "INDEX", columns: ["id_motorista"] },
      { name: "fk_coleta_ponto_idx", type: "INDEX", columns: ["id_ponto"] },
      { name: "fk_coleta_rota_idx", type: "INDEX", columns: ["id_rota"] }
    ]
  },
  {
    name: "localizacoes_rastreamento",
    comment: "Armazena o histórico do sinal GPS (telemetria contínua) enviado pelos caminhões a cada 10-30 segundos.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_caminhao", type: "bigint", key: "FK", notNull: true },
      { name: "latitude", type: "decimal(10,8)", notNull: true },
      { name: "longitude", type: "decimal(10,8)", notNull: true },
      { name: "velocidade_kmh", type: "decimal(6,2)", notNull: false, defaultValue: "0.00" },
      { name: "data_hora_dispositivo", type: "datetime", notNull: true, comment: "Timestamp offline no celular/GPS." },
      { name: "data_hora_servidor", type: "datetime", notNull: true, defaultValue: "CURRENT_TIMESTAMP", comment: "Timestamp de recebimento da fila do Kafka/API." },
      { name: "percentual_bateria_app", type: "tinyint", notNull: false }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "fk_rastreio_caminhao_idx", type: "INDEX", columns: ["id_caminhao"] },
      { name: "idx_rastreio_busca", type: "INDEX", columns: ["id_caminhao", "data_hora_dispositivo"] }
    ]
  },
  {
    name: "estatisticas_ia",
    comment: "Consolida as anomalias, consumo estimado e previsões inteligentes recomendadas pelo Gemini AI.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_rota", type: "bigint", key: "FK", notNull: true },
      { name: "id_caminhao", type: "bigint", key: "FK", notNull: true },
      { name: "data_referencia", type: "date", notNull: true },
      { name: "tipo_periodo", type: "enum", notNull: true, defaultValue: "'diario'", comment: "Values: ('diario', 'semanal', 'mensal')" },
      { name: "km_percorridos", type: "decimal(10,3)", notNull: true, defaultValue: "0.000" },
      { name: "combustivel_gasto_l", type: "decimal(10,3)", notNull: true, defaultValue: "0.000" },
      { name: "pontos_criticos_detectados", type: "int", notNull: true, defaultValue: "0" },
      { name: "sugestoes_ia_json", type: "json", notNull: false, comment: "Recomendações e explicações estruturadas geradas por IA." }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "uq_estatistica_ref", type: "UNIQUE", columns: ["id_rota", "id_caminhao", "data_referencia", "tipo_periodo"] },
      { name: "fk_estatistica_caminhao", type: "INDEX", columns: ["id_caminhao"] }
    ]
  },
  {
    name: "alertas_manutencao_ia",
    comment: "Eventos anomalos persistidos de manutenção preventiva e de consumo severamente excessivo mapeados.",
    columns: [
      { name: "id", type: "bigint (Auto-Increment)", key: "PK", notNull: true },
      { name: "id_caminhao", type: "bigint", key: "FK", notNull: true },
      { name: "tipo_alerta", type: "varchar(150)", notNull: true, comment: "Ex: 'Consumo Anômalo', 'Falha Geofence', 'Suspeita de Desvio de Combustível'" },
      { name: "descricao_ia", type: "text", notNull: true },
      { name: "resolvido", type: "tinyint(1)", notNull: true, defaultValue: "0" },
      { name: "data_resolucao", type: "datetime", notNull: false },
      { name: "created_at", type: "datetime", notNull: true, defaultValue: "CURRENT_TIMESTAMP" }
    ],
    indexes: [
      { name: "PRIMARY", type: "BTREE", columns: ["id"] },
      { name: "fk_alerta_caminhao_idx", type: "INDEX", columns: ["id_caminhao"] }
    ]
  }
];


// ----------------------------------------------------
// 3. DOCUMENTAÇÃO STACK RECOMENDADA
// ----------------------------------------------------

export interface StackDetails {
  categoria: string;
  tecnologia: string;
  justificativa: string;
  iconName: string;
}

export const STACK_RECOMMENDED: StackDetails[] = [
  {
    categoria: "Banco de Dados Relacional / GIS",
    tecnologia: "PostgreSQL 15+ + PostGIS Extension",
    justificativa: "Essencial para georreferenciamento e indexação espacial (GIST). Permite queries espaciais rápidas de Geofencing, proximidade e rota como ST_DWithin ou ST_Distance diretamente por SQL.",
    iconName: "Database"
  },
  {
    categoria: "Armazenamento Timeseries / Telemetria",
    tecnologia: "TimescaleDB (Engine de Sinais GPS)",
    justificativa: "Extensão instalada no PostgreSQL específica para ingestão massiva e compressão em tempo real de coordenadas de coordenadas de latitude/longitude enviadas pelos caminhões em trânsito.",
    iconName: "Activity"
  },
  {
    categoria: "Servidor Backend & APIs",
    tecnologia: "NestJS (Node.js) ou Elixir Phoenix",
    justificativa: "Estrutura corporativa e tipada TypeScript. Se requerer baixíssima latência e alta concorrência de sockets (200+ caminhões pingando simultâneo), a VM do Erlang (Phoenix) desponta em excelente contenção de memória.",
    iconName: "Server"
  },
  {
    categoria: "Fila de Mensageria",
    tecnologia: "Apache Kafka ou RabbitMQ",
    justificativa: "Necessário para amortecer a ingestão massiva paralela dos GPS que chegam do aplicativo móvel, evitando sobrecarga direta de banco ao enfileirar em lote as escritas (bulk insert).",
    iconName: "Shuffle"
  },
  {
    categoria: "Bibliotecas GIS no Frontend",
    tecnologia: "Leaflet.js + React-Leaflet ou Mapbox GL JS",
    justificativa: "Leaflet é extremamente leve e ideal para plotar pontos e heatmaps simples sem alto consumo de bateria. Mapbox GL usa WebGL para renderização de trajetos complexos e rota com animação em tempo real.",
    iconName: "MapPin"
  },
  {
    categoria: "Bibliotecas de Gráficos (BI)",
    tecnologia: "Chart.js ou ApexCharts com Tailwind CSS",
    justificativa: "Permitem suavidade em animação temporal, interatividade de hover de mouse de forma nativa e montagem rápida de relatórios dinâmicos responsivos.",
    iconName: "BarChart3"
  }
];


// ----------------------------------------------------
// 4. ESBOÇO DE ENDPOINTS REST (EXPLORADOR DE API)
// ----------------------------------------------------

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  requestBodyExample?: string;
  responseExample: string;
}

export const API_ENDPOINTS_SPEC: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/dashboard/desempenho-temporal",
    summary: "Evolução do Volume e Combustível (BI)",
    description: "Retorna a série histórica agregada por dia ou semana no período solicitado. Alimenta o Painel de Desempenho [RF01].",
    parameters: [
      { name: "data_inicio", type: "string (YYYY-MM-DD)", required: true, description: "Data de início do filtro de BI" },
      { name: "data_fim", type: "string (YYYY-MM-DD)", required: true, description: "Data de término do filtro" },
      { name: "id_rota", type: "bigint", required: false, description: "Filtro opcional por rota específica" }
    ],
    responseExample: JSON.stringify([
      { data: "2026-06-05", peso_total_kg: 16350, combustivel_total_l: 31.6, km_totais: 68.5, viagens_completas: 2 },
      { data: "2026-06-06", peso_total_kg: 0, combustivel_total_l: 0, km_totais: 0, viagens_completas: 0 },
      { data: "2026-06-07", peso_total_kg: 17310, combustivel_total_l: 59.3, km_totais: 108.0, viagens_completas: 2 },
      { data: "2026-06-08", peso_total_kg: 16320, combustivel_total_l: 33.3, km_totais: 69.0, viagens_completas: 2 }
    ], null, 2)
  },
  {
    method: "GET",
    path: "/api/v1/dashboard/visao-operacional",
    summary: "Consolidado Operacional (BI)",
    description: "Métricas globais unificadas de dias ativos, tamanho da frota, motoristas engajados e quilometragem percorrida [RF03] [RF04].",
    parameters: [
      { name: "data_inicio", type: "string (Format: Date)", required: true, description: "Data limiar inicial" },
      { name: "data_fim", type: "string (Format: Date)", required: true, description: "Data limiar final" }
    ],
    responseExample: JSON.stringify({
      resumo_periodo: {
        dias_coleta_efetiva: 24,
        frota_total_cadastrada: 6,
        motoristas_com_viagens: 4,
        quilometragem_total: 914.5,
        consumo_diesel_total_l: 432.8
      },
      status_caminhoes_tempo_real: {
        em_coleta: 2,
        ativos: 2,
        parados: 1,
        manutencao: 1
      }
    }, null, 2)
  },
  {
    method: "GET",
    path: "/api/v1/dashboard/caminhoes/manutencao-consumo",
    summary: "Cruzamento de Consumo Ineficiente",
    description: "Realiza a query que calcula a média real da distância dividida pelo litro consumido ([KM] / [L]) e destaca desvios sérios em relação ao consumo padrão de fábrica da frota [RF05] [RF07].",
    responseExample: JSON.stringify([
      {
        id_caminhao: 3,
        placa: "COB-1B44",
        modelo: "Volvo VM 270 6x2 Clássico",
        consumo_padrao_km_l: 1.80,
        consumo_real_km_l: 1.48,
        desvio_excesso_diesel: "21.6%",
        status: "excessivo",
        grau_urgencia: "Critica",
        detalhes: "Ponto excessivo de frenagem brusca detectado em telemetria."
      }
    ], null, 2)
  },
  {
    method: "POST",
    path: "/api/v1/telemetria/gps",
    summary: "Persistir Coordenadas de GPS",
    description: "Endpoint veloz para o aplicativo mobile ou rastreador embarcado enviar as coordenadas da viagem de coleta.",
    requestBodyExample: JSON.stringify({
      id_caminhao: 1,
      latitude: -23.585489,
      longitude: -46.662104,
      velocidade_kmh: 0.00,
      ignicao_ligada: true,
      data_hora_dispositivo: "2026-06-09T10:15:30Z",
      percentual_bateria: 92
    }, null, 2),
    responseExample: JSON.stringify({ status: "success", received: 1 }, null, 2)
  },
  {
    method: "GET",
    path: "/api/v1/gis/pontos-criticos",
    summary: "Mapa de Omissões por Perímetro (GIS)",
    description: "Filtra e retorna posições de descarte/coleta reincidentes sistemáticas com 2 ou mais falhas consecutivas para renderização das bolhas vermelhas no mapa [RF02].",
    responseExample: JSON.stringify([
      {
        id_ponto: 15,
        nome_rua: "Rua do Sossego, 452 (Setor Sul)",
        id_rota: 1,
        coordenadas: { lat: -23.585, lng: -46.662 },
        consecutivos_falhos: 3,
        motivo: "Curva fechada obstruída por veículos de passeio residenciais estacionados.",
        ultimo_registro: "2026-06-08T09:12:00Z"
      }
    ], null, 2)
  },
  {
    method: "GET",
    path: "/api/v1/gis/heatmap-volume",
    summary: "Heatmap de Volume de Parada (GIS)",
    description: "Computa as coordenadas em que a velocidade do GPS esteve em zero (0 km/h) mantendo a ignição veicular ligada (sinalizador de operação ativa de gari recolhendo) e calcula a estimativa de volume [RF06].",
    responseExample: JSON.stringify([
      {
        id_rota: 1,
        logradouro: "Av. Pres. Kennedy, Condomínio Portal das Flores",
        coordenadas: { lat: -23.582, lng: -46.671 },
        tempo_parada_segundos: 620,
        volume_estimado_kg: 840,
        peso_densidade: 0.75
      }
    ], null, 2)
  }
];
