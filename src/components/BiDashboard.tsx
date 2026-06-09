/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MOCK_COLLECTIONS, MOCK_TRUCKS, MOCK_DRIVERS, getEfficiencyAlerts } from '../data';
import { CollectionSummary } from '../types';
import { BarChart3, TrendingUp, Calendar, Truck, Users, Activity, Fuel, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function BiDashboard() {
  const [filterPeriod, setFilterPeriod] = useState<'semanal' | 'mensal' | 'customizado'>('mensal');
  const [startDate, setStartDate] = useState('2026-05-18');
  const [endDate, setEndDate] = useState('2026-06-09');

  // Filtrar histórico com base no período selecionado
  const filteredCollections = useMemo(() => {
    return MOCK_COLLECTIONS.filter(item => {
      if (filterPeriod === 'semanal') {
        // Obter apenas registros após 01/06/2026
        return new Date(item.data_coleta) >= new Date('2026-06-01');
      } else if (filterPeriod === 'mensal') {
        // Obter registros do último mês (após 15/05/2026)
        return new Date(item.data_coleta) >= new Date('2026-05-15');
      } else {
        // Período customizado
        const d = new Date(item.data_coleta);
        return d >= new Date(startDate) && d <= new Date(endDate);
      }
    });
  }, [filterPeriod, startDate, endDate]);

  // Cálculos Estatísticos Consolidados [RF03]
  const stats = useMemo(() => {
    let totalKm = 0;
    let totalCombustivel = 0;
    let totalPeso = 0;
    const diasAtivos = new Set<string>();
    const frotasAtivas = new Set<number>();
    const motoristasAtivos = new Set<number>();

    filteredCollections.forEach(c => {
      totalKm += c.km_percorridos;
      totalCombustivel += c.combustivel_gasto_l;
      totalPeso += c.peso_coletado_kg;
      diasAtivos.add(c.data_coleta);
      frotasAtivas.add(c.id_caminhao);
      motoristasAtivos.add(c.id_motorista);
    });

    const totalCaminhoesCadastrados = MOCK_TRUCKS.length;
    const motoristasTotais = MOCK_DRIVERS.length;

    return {
      diasColetaEfetiva: diasAtivos.size,
      quilometragemTotal: Math.round(totalKm * 100) / 100,
      consumoEstimadoL: Math.round(totalCombustivel * 100) / 100,
      pesoTotalToneladas: Math.round((totalPeso / 1000) * 10) / 10,
      mediaConsumoReal: totalCombustivel > 0 ? Math.round((totalKm / totalCombustivel) * 100) / 100 : 0,
      frotaTamanho: totalCaminhoesCadastrados,
      frotasEmAtividade: frotasAtivas.size,
      motoristasTotal: motoristasTotais,
      motoristasEmAtividade: motoristasAtivos.size
    };
  }, [filteredCollections]);

  // Alertas de ineficiência gerados automaticamente [RF07]
  const efficiencyAlerts = useMemo(() => {
    return getEfficiencyAlerts(filteredCollections);
  }, [filteredCollections]);

  // Evolução Diária da Coleta para Gráfico Temporal [RF01]
  const dailyEvolution = useMemo(() => {
    const dailyMap = new Map<string, { peso: number; km: number; combustivel: number; count: number }>();
    
    // Inicializar os últimos dias para garantir exibição visual bonita
    const days = Array.from(new Set(filteredCollections.map(c => c.data_coleta))).sort() as string[];
    
    filteredCollections.forEach(c => {
      const dayData = dailyMap.get(c.data_coleta) || { peso: 0, km: 0, combustivel: 0, count: 0 };
      dayData.peso += c.peso_coletado_kg;
      dayData.km += c.km_percorridos;
      dayData.combustivel += c.combustivel_gasto_l;
      dayData.count += 1;
      dailyMap.set(c.data_coleta, dayData);
    });

    return days.map(day => {
      const data = dailyMap.get(day)!;
      // Formatar dia para exibição simples (Ex: 08/Jun)
      const dateParts = day.split('-');
      const label = `${dateParts[2]}/${dateParts[1]}`;
      return {
        rawDate: day,
        label,
        pesoKg: data.peso,
        pesoTon: Math.round((data.peso / 1000) * 10) / 10,
        km: Math.round(data.km),
        combustivelL: Math.round(data.combustivel),
      };
    });
  }, [filteredCollections]);

  // Encontrar o maior peso para escalonar o gráfico de forma inline
  const maxPesoGraph = useMemo(() => {
    const maxVal = Math.max(...dailyEvolution.map(d => d.pesoKg), 2000);
    return maxVal;
  }, [dailyEvolution]);

  return (
    <div className="space-y-6" id="bi-dashboard-root">
      
      {/* 1. SELETOR DE PERÍODOS / FILTROS (MÁXIMA PRIORIDADE - RF01) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Filtros do Painel de Desempenho temporal
          </h2>
          <p className="text-xs text-slate-500">Selecione o lapso temporal para recálculo de telemetria da frota</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterPeriod('semanal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filterPeriod === 'semanal' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semanal (Junho/26)
            </button>
            <button
              onClick={() => setFilterPeriod('mensal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filterPeriod === 'mensal' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensal (Histórico)
            </button>
            <button
              onClick={() => setFilterPeriod('customizado')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filterPeriod === 'customizado' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personalizado
            </button>
          </div>

          {filterPeriod === 'customizado' && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs text-slate-700">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-slate-800 outline-none focus:text-emerald-500"
              />
              <span className="text-slate-400">até</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-slate-800 outline-none focus:text-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. CARD INDICADORES OPERACIONAIS (RF03, RF04) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition shadow-sm group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coleta Efetiva</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-900">{stats.diasColetaEfetiva} Dias</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Atividade Realizada</span>
              no período selecionado
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition shadow-sm group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Métrica de Frota</span>
            <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600 group-hover:bg-cyan-100 transition">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-900">{stats.frotasEmAtividade} / {stats.frotaTamanho}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Caminhões em operação ativa por turno
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition shadow-sm group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Motoristas Ativos</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-900">{stats.motoristasEmAtividade} / {stats.motoristasTotal}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Motoristas engajados nas rotas do ciclo
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition shadow-sm group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telemetria Total</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-900">{stats.quilometragemTotal} km</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              Gasto Est. <span className="text-amber-600 font-bold">{stats.consumoEstimadoL} L</span> de diesel
            </p>
          </div>
        </div>

      </div>

      {/* 3. GRÁFICO HISTÓRICO TEMPORAL & TABELA OPERACIONAL CONSOLIDADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DIÁRIO DE VOLUME COLETADO [RF01] */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Evolução do Volume de Resíduos Coletados</h3>
              <p className="text-xs text-slate-500">Total do período: <span className="text-emerald-600 font-bold">{stats.weightTotalTons ?? stats.pesoTotalToneladas} toneladas</span> de carga</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded text-[10px] text-slate-600 border border-slate-200">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Volume Real (Kg)</span>
            </div>
          </div>

          {/* Canvas de Barras Vetorizado com SVG/Tailwind */}
          <div className="h-64 flex flex-col justify-end">
            {dailyEvolution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Nenhuma coleta registrada no período customizado selecionado.
              </div>
            ) : (
              <div className="h-full flex items-end gap-2 sm:gap-3 pt-6 px-2 overflow-x-auto">
                {dailyEvolution.map((day, idx) => {
                  const pctHeight = (day.pesoKg / maxPesoGraph) * 100;
                  return (
                    <div key={idx} className="flex-1 min-w-[32px] flex flex-col items-center h-full justify-end group/bar relative">
                      
                      {/* Tooltip Hover decorada */}
                      <div className="absolute mb-24 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-center pointer-events-none z-10 w-28 text-white">
                        <p className="text-[10px] text-slate-400 font-mono">{day.rawDate}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{day.pesoTon} Ton</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{day.km} km | {day.combustivelL} L</p>
                      </div>

                      {/* Barra de volume */}
                      <div className="w-full bg-slate-100 rounded-t-sm group-hover/bar:bg-slate-200 transition-all flex flex-col justify-end" style={{ height: `100%` }}>
                        <div 
                          className="w-full bg-emerald-550 bg-emerald-500 rounded-t-sm group-hover/bar:bg-emerald-600 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          style={{ height: `${pctHeight}%` }}
                        ></div>
                      </div>

                      {/* Label do dia */}
                      <span className="text-[10px] text-slate-500 mt-2 font-mono">{day.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Legenda: Altura da barra indica o peso recuperado em Kg na data.</span>
            <span>Média Período: {(stats.pesoTotalToneladas / (stats.diasColetaEfetiva || 1)).toFixed(1)} T/dia</span>
          </div>
        </div>

        {/* ALERTA DE CONSUMO INEFICIENTE [RF04] [RF05] [RF07] - ALTA PRIORIDADE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                Alertas de Consumo Ineficiente
              </h3>
              <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-200 font-semibold">RF07</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Regra de Negócio:</strong> Mapeia a eficiência dividindo km percorridos por combustível gasto, listando os caminhões cujo desvio ultrapassa o previsto modelo.
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[230px] pr-1">
              {efficiencyAlerts.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nenhum caminhão apresentou consumo excessivo de combustível neste período!</span>
                </div>
              ) : (
                efficiencyAlerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-200">{alert.placa}</span>
                        <span className="text-[11px] font-medium text-slate-700 truncate max-w-[130px]">{alert.modelo}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        alert.grau_alerta === 'Crítica' ? 'bg-red-50 text-red-600 border border-red-200' :
                        alert.grau_alerta === 'Alta' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {alert.grau_alerta}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/80 text-center font-mono">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Padrão</p>
                        <p className="text-[11px] font-medium text-slate-700 mt-0.5">{alert.consumo_estimado_km_l} <span className="text-[9px] text-slate-400">km/L</span></p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Real</p>
                        <p className="text-[11px] font-bold text-rose-600 mt-0.5">{alert.consumo_real_km_l} <span className="text-[9px] text-rose-450">km/L</span></p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Desvio</p>
                        <p className="text-[11px] font-black text-rose-600 mt-0.5">+{alert.desvio_percentual}%</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 mt-4 leading-normal flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>Fórmula: <code className="text-slate-600">[(Padrão - Real) / Padrão] * 100</code>. Alertas gerados sinalizam possível necessidade de descarbonização do motor ou desvio no fluxo manual de abastecimento.</span>
          </div>
        </div>

      </div>

      {/* 4. TABELA OPERACIONAL DE FROTAS & CONTROLE DE TURNOS [RF03] [RF04] [RF05] */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Listagem e Telemetria de Coleta por Rota Operacional</h3>
            <p className="text-xs text-slate-500 justify-normal">Dados consolidados do período para quilometragem e consumo cumulativo [RF03, RF04, RF05]</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="p-3">Data</th>
                <th className="p-3">Rota</th>
                <th className="p-3">Veículo</th>
                <th className="p-3">Motorista Ativo</th>
                <th className="p-3 text-right">Massa (Kg)</th>
                <th className="p-3 text-right">KM Percorridos</th>
                <th className="p-3 text-right">Combustível</th>
                <th className="p-3 text-right">Consumo Real (km/L)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filteredCollections.map((col, idx) => {
                const consumoReal = col.combustivel_gasto_l > 0 
                  ? (col.km_percorridos / col.combustivel_gasto_l).toFixed(2) 
                  : "-";
                
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-slate-500">{col.data_coleta}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">{col.nome_rota}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">{col.placa_caminhao}</span>
                    </td>
                    <td className="p-3 font-sans text-slate-600">{col.nome_motorista}</td>
                    <td className="p-3 text-right text-emerald-650 text-emerald-600 font-bold">{col.peso_coletado_kg.toLocaleString('pt-BR')} kg</td>
                    <td className="p-3 text-right text-slate-600">{col.km_percorridos} km</td>
                    <td className="p-3 text-right text-amber-600">{col.combustivel_gasto_l} L</td>
                    <td className="p-3 text-right font-bold text-slate-800">{consumoReal}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-sans border ${
                        col.status === 'concluida' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        col.status === 'parcial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {col.status === 'concluida' ? 'Concluída' : col.status === 'parcial' ? 'Parcial' : 'Omissa'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
