/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BiDashboard from './components/BiDashboard';
import GisMap from './components/GisMap';
import ResourceManagement from './components/ResourceManagement';
import AppIntegrationHub from './components/AppIntegrationHub';
import { 
  BarChart3, 
  Map, 
  Database, 
  Network, 
  Cpu, 
  Clock, 
  Activity, 
  ChevronRight, 
  Layers,
  Settings,
  HelpCircle,
  Users,
  Smartphone
} from 'lucide-react';

type TabType = 'dashboard' | 'gis' | 'management' | 'integration';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Sincronizar relógio em tempo real com formatação elegante
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('pt-BR', { timeZone: 'UTC', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="rotaverde-app-root">
      
      {/* HEADER PRINCIPAL SUPERIOR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl shadow-sm flex items-center justify-center text-white">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                RotaVerde
              </h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black font-mono px-2 py-0.5 rounded-full tracking-wide">
                BI &amp; TELEMETRIA V2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Sistema Integrante de Gestão Ambiental &amp; Geoprocessamento de Telemetria</p>
          </div>
        </div>

        {/* RELÓGIO DA CENTRAL DE TELEMETRIA */}
        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-mono text-[11px]">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>UTC Clock:</span>
            <span className="font-bold text-slate-800">{currentTime || 'Sincronizando...'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-mono font-bold uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span>CONEXÃO ONLINE AMBIENTAL</span>
          </div>
        </div>

      </header>

      {/* DISPOSIÇÃO EM ABAS INTERATIVAS */}
      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        
        {/* LEVE BARRA LATERAL DE NAVEGAÇÃO */}
        <nav className="md:w-64 shrink-0 flex flex-col justify-between gap-6 bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-lg" id="sidebar-nav">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Navegador do Sistema</h3>
            
            <div className="space-y-1.5">
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-xs font-semibold select-none border ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm shadow-black/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Dashboard &amp; BI (Estatísticas)</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${activeTab === 'dashboard' ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('gis')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-xs font-semibold select-none border ${
                  activeTab === 'gis'
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm shadow-black/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Map className="w-4 h-4 shrink-0" />
                  <span>Mapa Telemetria GIS</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${activeTab === 'gis' ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('management')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-xs font-semibold select-none border ${
                  activeTab === 'management'
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm shadow-black/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Gestão de Frota &amp; Escalas</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${activeTab === 'management' ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('integration')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-xs font-semibold select-none border ${
                  activeTab === 'integration'
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm shadow-black/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Conexão Mobile (APIs)</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${activeTab === 'integration' ? 'rotate-90' : ''}`} />
              </button>



            </div>
          </div>

          {/* RODAPÉ DO REQUISITO MUNICIPAL */}
          <div className="bg-slate-850/45 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Especificações Sprint</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              Entrega desenvolvida em conformidade com as exigências arquiteturais e integridade fiscalizadora de despesas urbanas de combustível.
            </p>
          </div>
        </nav>

        {/* CONTAINER DO CONTEÚDO ATIVO COM TRANSIÇÕES */}
        <section className="flex-1 min-w-0" id="main-content-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && <BiDashboard />}
              {activeTab === 'gis' && <GisMap />}
              {activeTab === 'management' && <ResourceManagement />}
              {activeTab === 'integration' && <AppIntegrationHub />}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-2 shadow-xs">
        <p>© 2026 RotaVerde Urban Solid Waste Corp. • Central de Telemetria Ambiental.</p>
        <p className="font-mono text-slate-400">Ambiente Sandboxed • PostgreSQL + PostGIS Engine • TimescaleDB Ready</p>
      </footer>

    </div>
  );
}

