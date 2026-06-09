/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Truck {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
  capacidade_kg: number;
  consumo_medio_km_l: number; // Consumo padrão cadastrado para o modelo
  status_operacional: 'ativo' | 'em_coleta' | 'parado' | 'manutencao' | 'inativo';
}

export interface Route {
  id: number;
  nome_rota: string;
  descricao: string;
  distancia_estimada_km: number;
  combustivel_estimado_l: number;
  trajeto_geo_json?: string;
  status_ativo: boolean;
}

export interface Driver {
  id: number;
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  status_ativo: boolean;
}

export interface LogGPS {
  id: number;
  id_caminhao: number;
  latitude: number;
  longitude: number;
  velocidade_kmh: number;
  ignicao_ligada: boolean;
  data_hora_dispositivo: string;
}

export interface OmissionCollection {
  id: number;
  id_rota: number;
  nome_rua: string;
  latitude: number;
  longitude: number;
  ciclos_consecutivos_falhos: number; // Regra de Negócio: >= 2 ciclos consecutivos é crítico
  motivo: string;
  tipo_resíduo_comum: string;
}

export interface StopHeatmapPoint {
  id: number;
  id_rota: number;
  latitude: number;
  longitude: number;
  tempo_parado_segundos: number; // Filtro: velocidade = 0 com ignição ligada
  volume_estimado_kg: number; // Calculado com base no tempo de parada
  logradouro: string;
}

export interface CollectionSummary {
  id: number;
  id_rota: number;
  nome_rota: string;
  data_coleta: string;
  km_percorridos: number;
  combustivel_gasto_l: number;
  id_motorista: number;
  nome_motorista: string;
  id_caminhao: number;
  placa_caminhao: string;
  peso_coletado_kg: number;
  status: 'concluida' | 'parcial' | 'omissa' | 'em_coleta';
}

export interface EfficiencyAlert {
  id: number;
  id_caminhao: number;
  placa: string;
  modelo: string;
  km_percorridos: number;
  combustivel_gasto_l: number;
  consumo_estimado_km_l: number; // Padrão
  consumo_real_km_l: number;     // Real calculado: km / combustível
  desvio_percentual: number;     // % acima da média padrão
  grau_alerta: 'Média' | 'Alta' | 'Crítica';
}
