/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getRVState, useSyncState, ActiveTeam } from '../lib/syncState';
import { Driver, Truck } from '../types';
import { MOCK_ROUTES } from '../data';
import { 
  Users, 
  Truck as TruckIcon, 
  Layers, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle, 
  Briefcase, 
  UserPlus, 
  ShieldAlert, 
  Wrench,
  Fuel
} from 'lucide-react';

export default function ResourceManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(getRVState.getDrivers());
  const [trucks, setTrucks] = useState<Truck[]>(getRVState.getTrucks());
  const [teams, setTeams] = useState<ActiveTeam[]>(getRVState.getTeams());

  // Subscription hook to dynamic state alteration
  useSyncState(() => {
    setDrivers(getRVState.getDrivers());
    setTrucks(getRVState.getTrucks());
    setTeams(getRVState.getTeams());
  });

  // Local navigation tab inside Management
  const [mgmtTab, setMgmtTab] = useState<'drivers' | 'trucks' | 'teams'>('drivers');

  // --- Driver form states ---
  const [drvName, setDrvName] = useState('');
  const [drvCnh, setDrvCnh] = useState('');
  const [drvEmail, setDrvEmail] = useState('');
  const [drvPhone, setDrvPhone] = useState('');
  const [drvError, setDrvError] = useState('');

  // --- Truck form states ---
  const [trPlaca, setTrPlaca] = useState('');
  const [trModelo, setTrModelo] = useState('');
  const [trAno, setTrAno] = useState('');
  const [trCap, setTrCap] = useState('');
  const [trConsumo, setTrConsumo] = useState('');
  const [trError, setTrError] = useState('');

  // --- Team form states ---
  const [tmName, setTmName] = useState('');
  const [tmDriverId, setTmDriverId] = useState(1);
  const [tmTruckId, setTmTruckId] = useState(1);
  const [tmRouteId, setTmRouteId] = useState(1);
  const [tmShift, setTmShift] = useState<'diurno' | 'noturno' | 'vespertino'>('diurno');
  const [tmError, setTmError] = useState('');

  // --- DRIVER HANDLERS ---
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setDrvError('');
    if (!drvName || !drvCnh || !drvEmail) {
      setDrvError('Por favor, preencha os campos obrigatórios (Nome, CNH e E-mail).');
      return;
    }

    const newDrv: Driver = {
      id: Date.now(),
      id_usuario: Math.floor(Math.random() * 1000) + 200,
      nome: drvName,
      cnh: drvCnh,
      email: drvEmail,
      telefone: drvPhone || '(91) 99999-9999',
      status_ativo: true
    };

    const updated = [...drivers, newDrv];
    getRVState.setDrivers(updated);
    
    // reset
    setDrvName('');
    setDrvCnh('');
    setDrvEmail('');
    setDrvPhone('');
  };

  const handleToggleDriver = (id: number) => {
    const updated = drivers.map(d => d.id === id ? { ...d, status_ativo: !d.status_ativo } : d);
    getRVState.setDrivers(updated);
  };

  const handleDeleteDriver = (id: number) => {
    const updated = drivers.filter(d => d.id !== id);
    getRVState.setDrivers(updated);
  };

  // --- TRUCK HANDLERS ---
  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault();
    setTrError('');
    if (!trPlaca || !trModelo || !trCap) {
      setTrError('Preencha os campos obrigatórios de placa, modelo e capacidade.');
      return;
    }

    const newTr: Truck = {
      id: Date.now(),
      placa: trPlaca.toUpperCase(),
      modelo: trModelo,
      ano: Number(trAno) || 2022,
      capacidade_kg: Number(trCap) || 8000,
      consumo_medio_km_l: Number(trConsumo) || 2.2,
      status_operacional: 'ativo'
    };

    getRVState.setTrucks([...trucks, newTr]);
    setTrPlaca('');
    setTrModelo('');
    setTrAno('');
    setTrCap('');
    setTrConsumo('');
  };

  const handleToggleTruckStatus = (id: number, newStatus: 'ativo' | 'manutencao' | 'parado') => {
    const updated = trucks.map(t => t.id === id ? { ...t, status_operacional: newStatus } : t);
    getRVState.setTrucks(updated);
  };

  const handleDeleteTruck = (id: number) => {
    const updated = trucks.filter(t => t.id !== id);
    getRVState.setTrucks(updated);
  };

  // --- TEAM HANDLERS ---
  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setTmError('');
    if (!tmName) {
      setTmError('O nome da equipe/escala é obrigatório.');
      return;
    }

    const newTeam: ActiveTeam = {
      id: Date.now(),
      nome_equipe: tmName,
      id_motorista: tmDriverId,
      id_caminhao: tmTruckId,
      id_rota: tmRouteId,
      turno: tmShift,
      status: 'em_servico'
    };

    getRVState.setTeams([...teams, newTeam]);
    setTmName('');
  };

  const handleToggleTeamStatus = (id: number, status: 'em_servico' | 'pausa' | 'finalizado') => {
    const updated = teams.map(t => t.id === id ? { ...t, status } : t);
    getRVState.setTeams(updated);
  };

  const handleDeleteTeam = (id: number) => {
    const updated = teams.filter(t => t.id !== id);
    getRVState.setTeams(updated);
  };

  return (
    <div className="space-y-6" id="resource-management-root">
      
      {/* HEADER DE CONTROLES */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Central de Gestão e Escalas Operacionais
          </h2>
          <p className="text-xs text-slate-500">Cadastre e relacione motoristas, frotas de caminhões coletores e equipes logísticas</p>
        </div>

        {/* NAVEGAÇÃO DE SUB-ABAS */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-center">
          <button 
            onClick={() => setMgmtTab('drivers')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              mgmtTab === 'drivers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-650 text-slate-600 hover:text-slate-800'
            }`}
          >
            Motoristas
          </button>
          <button 
            onClick={() => setMgmtTab('trucks')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              mgmtTab === 'trucks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-650 text-slate-600 hover:text-slate-800'
            }`}
          >
            Caminhões
          </button>
          <button 
            onClick={() => setMgmtTab('teams')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              mgmtTab === 'teams' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-650 text-slate-600 hover:text-slate-800'
            }`}
          >
            Equipes &amp; Escala
          </button>
        </div>
      </div>

      {/* PAINEL DINÂMICO CONFORME SUB-ABA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* TABELA E REGISTROS (col-span-2) */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          
          {/* 1. MOTORISTAS LIST */}
          {mgmtTab === 'drivers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Motoristas Cadastrados</h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Total: {drivers.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-slate-50/50">
                      <th className="py-2.5 px-3">Nome</th>
                      <th className="py-2.5 px-3">Documento CNH</th>
                      <th className="py-2.5 px-3">E-mail</th>
                      <th className="py-2.5 px-3">Telefone</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map(drv => (
                      <tr key={drv.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                            {drv.nome[0]}
                          </div>
                          {drv.nome}
                        </td>
                        <td className="py-3 px-3 font-mono">{drv.cnh}</td>
                        <td className="py-3 px-3 text-slate-500">{drv.email}</td>
                        <td className="py-3 px-3 text-slate-500">{drv.telefone}</td>
                        <td className="py-3 px-3 text-center">
                          <button onClick={() => handleToggleDriver(drv.id)} className="transition">
                            {drv.status_ativo ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-1 rounded-full font-bold">Ativo</span>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 border border-slate-250 border-slate-200 text-[10px] px-2 py-1 rounded-full">Inativo</span>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button 
                            onClick={() => handleDeleteDriver(drv.id)} 
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition"
                            title="Remover Registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. CAMINHÕES LIST */}
          {mgmtTab === 'trucks' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Frota de Caminhões Compactadores</h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Frota: {trucks.length} veículos</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-slate-50/50">
                      <th className="py-2.5 px-3">Placa</th>
                      <th className="py-2.5 px-3">Modelo / Especificação</th>
                      <th className="py-2.5 px-3">Ano</th>
                      <th className="py-2.5 px-3">Capacidade Nominal</th>
                      <th className="py-2.5 px-3">Diesel Padrão</th>
                      <th className="py-2.5 px-3 text-center">Situação Operacional</th>
                      <th className="py-2.5 px-3 text-right">Controles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trucks.map(tr => (
                      <tr key={tr.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-300 font-bold block text-center max-w-[90px]">
                            {tr.placa}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-800 font-medium">{tr.modelo}</td>
                        <td className="py-3 px-3 font-mono">{tr.ano}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{tr.capacidade_kg.toLocaleString('pt-BR')} Kg</td>
                        <td className="py-3 px-3 font-mono text-slate-500 flex items-center gap-1 mt-1.5">
                          <Fuel className="w-3.5 h-3.5 text-slate-400" />
                          {tr.consumo_medio_km_l} Km/L
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            tr.status_operacional === 'em_coleta' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : tr.status_operacional === 'ativo' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : tr.status_operacional === 'manutencao' 
                              ? 'bg-rose-50 text-rose-700 border-rose-250 border-rose-200 animate-pulse' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {tr.status_operacional.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <button 
                            onClick={() => handleToggleTruckStatus(tr.id, 'manutencao')} 
                            className="text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-250 border-rose-200 p-1.5 rounded text-[9px] font-bold transition inline-block uppercase"
                            title="Desviar para Oficina"
                          >
                            Oficina
                          </button>
                          <button 
                            onClick={() => handleToggleTruckStatus(tr.id, 'ativo')} 
                            className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 p-1.5 rounded text-[9px] font-bold transition inline-block uppercase"
                          >
                            Ativar
                          </button>
                          <button 
                            onClick={() => handleDeleteTruck(tr.id)}
                            className="text-slate-400 hover:text-red-650 p-1.5 rounded transition inline-block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. EQUIPES & ESCALAS LIST */}
          {mgmtTab === 'teams' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Escala Ativa de Trabalho Logístico</h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Associações Ativas: {teams.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-slate-50/50">
                      <th className="py-2.5 px-3">Identificação</th>
                      <th className="py-2.5 px-3">Motorista Escalado</th>
                      <th className="py-2.5 px-3">Caminhão Utilizado</th>
                      <th className="py-2.5 px-3">Rota Planejada</th>
                      <th className="py-2.5 px-3">Turno</th>
                      <th className="py-2.5 px-3 text-center">Status Turno</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(tm => {
                      const drvObj = drivers.find(d => d.id === tm.id_motorista);
                      const trkObj = trucks.find(t => t.id === tm.id_caminhao);
                      const routeObj = MOCK_ROUTES.find(r => r.id === tm.id_rota);

                      return (
                        <tr key={tm.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {tm.nome_equipe}
                          </td>
                          <td className="py-3 px-3">{drvObj ? drvObj.nome : 'N/A'}</td>
                          <td className="py-3 px-3 font-mono font-medium">{trkObj ? trkObj.placa : 'N/A'}</td>
                          <td className="py-3 px-3 text-slate-600">{routeObj ? routeObj.nome_rota : 'N/A'}</td>
                          <td className="py-3 px-3 capitalize font-sans">{tm.turno}</td>
                          <td className="py-3 px-3 text-center">
                            <select
                              value={tm.status}
                              onChange={(e) => handleToggleTeamStatus(tm.id, e.target.value as any)}
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-800"
                            >
                              <option value="em_servico">Em Serviço</option>
                              <option value="pausa">Em Pausa</option>
                              <option value="finalizado">Finalizado</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button 
                              onClick={() => handleDeleteTeam(tm.id)}
                              className="text-red-500 hover:text-red-750 p-1 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* CADASTRO FORM SIDE PANEL (xl:col-span-1) */}
        <div className="xl:col-span-1 bg-slate-900 text-slate-300 rounded-xl p-5 shadow-lg border border-slate-800 h-fit">
          
          {/* Form 1. MOTORISTA CADASTRAR */}
          {mgmtTab === 'drivers' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Cadastrar Motorista
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Insira os dados cadastrais obrigatórios conforme regulamentação de trânsito.</p>
              </div>

              {drvError && (
                <div className="bg-red-950/40 border border-red-800 text-red-300 rounded p-2.5 text-[10px] flex items-center gap-1.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{drvError}</span>
                </div>
              )}

              <form onSubmit={handleAddDriver} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block pb-0.5">Nome Completo (Obrigatório)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={drvName}
                    onChange={(e) => setDrvName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block pb-0.5">Documento CNH (D ou E)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 12345678901D"
                    value={drvCnh}
                    onChange={(e) => setDrvCnh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block pb-0.5">E-mail de Trabalho</label>
                  <input 
                    type="email" 
                    placeholder="Ex: dudu@rotaverde.gov.br"
                    value={drvEmail}
                    onChange={(e) => setDrvEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block pb-0.5">Telefone de Contato</label>
                  <input 
                    type="text" 
                    placeholder="Ex: (91) 98765-4321"
                    value={drvPhone}
                    onChange={(e) => setDrvPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition uppercase tracking-wider"
                >
                  Confirmar Cadastro
                </button>
              </form>
            </div>
          )}

          {/* Form 2. CAMINHÃO CADASTRAR */}
          {mgmtTab === 'trucks' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <TruckIcon className="w-4 h-4 text-emerald-400" />
                  Cadastrar Caminhão
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Expanda a frota veiculadora municipal inserindo as especificações térmicas e operacionais.</p>
              </div>

              {trError && (
                <div className="bg-red-950/40 border border-red-850 text-red-350 rounded p-2 text-[10px]">
                  {trError}
                </div>
              )}

              <form onSubmit={handleAddTruck} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Número da Placa</label>
                  <input 
                    type="text" 
                    placeholder="Ex: BRA-2D98"
                    value={trPlaca}
                    onChange={(e) => setTrPlaca(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Modelo do Caminhão</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Mercedes-Benz Atego 1729"
                    value={trModelo}
                    onChange={(e) => setTrModelo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block">Ano Fabricação</label>
                    <input 
                      type="number" 
                      placeholder="2022"
                      value={trAno}
                      onChange={(e) => setTrAno(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block">Capacidade (Kg)</label>
                    <input 
                      type="number" 
                      placeholder="8000"
                      value={trCap}
                      onChange={(e) => setTrCap(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Consumo Médio de Catálogo (Km/L)</label>
                  <input 
                    type="number" 
                    unselectable="on"
                    step="0.1"
                    placeholder="2.2"
                    value={trConsumo}
                    onChange={(e) => setTrConsumo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition uppercase tracking-wider"
                >
                  Cadastrar Coletor
                </button>
              </form>
            </div>
          )}

          {/* Form 3. EQUIPE / ESCALA CADASTRAR */}
          {mgmtTab === 'teams' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  Criar Equipe &amp; Escala
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Conecte um motorista ativo a um caminhão compatível e atribua o trajeto geográfico.</p>
              </div>

              {tmError && (
                <div className="bg-red-950/40 border border-red-850 text-red-300 rounded p-2 text-[10px]">
                  {tmError}
                </div>
              )}

              <form onSubmit={handleAddTeam} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Identificação / Nome da Escala</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Equipe Alfa - Setor Centro"
                    value={tmName}
                    onChange={(e) => setTmName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Motorista Responsável</label>
                  <select 
                    value={tmDriverId}
                    onChange={(e) => setTmDriverId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.nome} {!d.status_ativo ? '(Inativo)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Caminhão Reservado</label>
                  <select 
                    value={tmTruckId}
                    onChange={(e) => setTmTruckId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.placa} • {t.modelo}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Rota Logística Focada</label>
                  <select 
                    value={tmRouteId}
                    onChange={(e) => setTmRouteId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {MOCK_ROUTES.map(r => (
                      <option key={r.id} value={r.id}>{r.nome_rota}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block">Turno de Trabalho</label>
                  <select 
                    value={tmShift}
                    onChange={(e) => setTmShift(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="diurno">Diurno (07:00 - 15:00)</option>
                    <option value="vespertino">Vespertino (15:00 - 23:00)</option>
                    <option value="noturno">Noturno (23:00 - 07:00)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition uppercase tracking-wider"
                >
                  Lançar Escala de Rota
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
