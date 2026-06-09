/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MOCK_OMISSIONS, MOCK_HEATMAP_POINTS, MOCK_ROUTES } from '../data';
import { MapPin, Info, AlertOctagon, Flame, ToggleLeft, ToggleRight, Layers, Eye, Route as RouteIcon, Map } from 'lucide-react';
import { getRVState, useSyncState } from '../lib/syncState';

export default function GisMap() {
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showOmissions, setShowOmissions] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // States synchronized from dynamic state
  const [citizenAlerts, setCitizenAlerts] = useState(getRVState.getAlerts());
  const [tele, setTele] = useState(getRVState.getTelemetry());

  useSyncState(() => {
    setCitizenAlerts(getRVState.getAlerts());
    setTele(getRVState.getTelemetry());
  });

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const omissionLayerRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);

  // Ponto selecionado para inspeção no painel lateral
  const [inspectedEntity, setInspectedEntity] = useState<{
    id: number;
    tipo: 'omissao' | 'heatmap';
    nome: string;
    coord: string;
    detalhes: string;
    métrica: string;
    objeto: any;
  } | null>({
    id: 1,
    tipo: 'omissao',
    nome: "Avenida Presidente Vargas, 452 (Centro)",
    coord: "Latitude -2.9985, Longitude -47.3522",
    detalhes: "Veículos de moradores estacionados de forma irregular na calçada de comércio, bloqueando passagem física do caminhão compactador.",
    métrica: "3 CICLOS CONSECUTIVOS DE FALHA",
    objeto: MOCK_OMISSIONS[0]
  });

  // Dynamic Loading of Leaflet CSS and JS via CDN
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.id = 'leaflet-js';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Map Initialization
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Check if map is already initialized on this container
    if (mapInstanceRef.current) return;

    // Center of Paragominas, Pará (~-2.9985, -47.3522)
    const map = L.map(mapContainerRef.current, {
      center: [-2.9985, -47.3522],
      zoom: 13,
      zoomControl: true,
      attributionControl: true
    });

    // Add beautiful OpenStreetMap standard tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Initialize overlay layers
    routeLayerRef.current = L.layerGroup().addTo(map);
    omissionLayerRef.current = L.layerGroup().addTo(map);
    heatmapLayerRef.current = L.layerGroup().addTo(map);
    
    // Live telematics tracking layer
    (window as any).liveTruckLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Sync state layers to Leaflet items
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // 1. Clear and Draw Route Layer
    routeLayerRef.current.clearLayers();
    if (showRoutes) {
      let pathCoords: [number, number][] = [];
      if (selectedRouteId === 1) {
        pathCoords = [
          [-2.972, -47.3025],
          [-2.9795, -47.315],
          [-2.99, -47.33],
          [-3.008, -47.335],
          [-3.022, -47.3375],
          [-3.013, -47.34],
          [-3.001, -47.34875],
          [-3.021, -47.36375]
        ];
      } else if (selectedRouteId === 2) {
        pathCoords = [
          [-3.002, -47.34375],
          [-2.998, -47.3525],
          [-2.981, -47.3475],
          [-2.975, -47.35625],
          [-2.982, -47.36875],
          [-3.002, -47.3525]
        ];
      } else if (selectedRouteId === 3) {
        pathCoords = [
          [-3.01, -47.29375],
          [-3.01, -47.325],
          [-3.01, -47.35],
          [-3.01, -47.375],
          [-3.01, -47.40625]
        ];
      } else if (selectedRouteId === 4) {
        pathCoords = [
          [-2.965, -47.35],
          [-2.978, -47.3475],
          [-2.982, -47.3275],
          [-2.978, -47.31875],
          [-2.986, -47.30625],
          [-2.99, -47.33]
        ];
      } else if (selectedRouteId === 5) {
        pathCoords = [
          [-2.97, -47.3875],
          [-2.985, -47.37625],
          [-2.992, -47.3675],
          [-3.008, -47.36125],
          [-3.02, -47.3775],
          [-3.03, -47.4]
        ];
      }

      if (pathCoords.length > 0) {
        const routeColor = selectedRouteId === 1 ? '#06b6d4' : 
                           selectedRouteId === 2 ? '#3b82f6' : 
                           selectedRouteId === 3 ? '#10b981' : 
                           selectedRouteId === 4 ? '#f43f5e' : '#eab308';
        L.polyline(pathCoords, {
          color: routeColor,
          weight: 5,
          opacity: 0.85
        }).addTo(routeLayerRef.current);
      }
    }

    // 2. Clear and Draw Omissions
    omissionLayerRef.current.clearLayers();
    if (showOmissions) {
      MOCK_OMISSIONS.forEach(om => {
        // Red Marker using DivIcon for beautiful CSS styling & avoids asset issues
        const markerHtml = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-rose-500 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border border-white shadow-lg"></span>
          </div>
        `;
        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-omission',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([om.latitude, om.longitude], { icon })
          .addTo(omissionLayerRef.current);

        marker.on('click', () => {
          setInspectedEntity({
            id: om.id,
            tipo: 'omissao',
            nome: om.nome_rua,
            coord: `Lat ${om.latitude}, Lng ${om.longitude}`,
            detalhes: om.motivo,
            métrica: `SINAL - ${om.ciclos_consecutivos_falhos} CICLOS FALHOS CONSECUTIVOS`,
            objeto: om
          });
        });

        marker.bindTooltip(`<b>${om.nome_rua}</b><br/>Omissões: ${om.ciclos_consecutivos_falhos} ciclos`, {
          direction: 'top',
          offset: [0, -6]
        });
      });

      // Draw real-time Citizen Alerts from App Simulator
      citizenAlerts.forEach(al => {
        const pinColor = al.tipo === 'omissao' ? 'bg-rose-600' : al.tipo === 'lixeira_lotada' ? 'bg-amber-500' : 'bg-slate-700';
        const pingColor = al.tipo === 'omissao' ? 'bg-rose-500' : al.tipo === 'lixeira_lotada' ? 'bg-amber-400' : 'bg-slate-500';
        const alertLabel = al.tipo === 'omissao' ? 'OMISSÃO COLETOR' : al.tipo === 'lixeira_lotada' ? 'LIXEIRA LOTADA' : 'DESCARTE OUTRO';

        const markerHtml = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${pingColor} opacity-60"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 ${pinColor} border border-white shadow-lg"></span>
          </div>
        `;
        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-citizen-alert',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([al.latitude, al.longitude], { icon })
          .addTo(omissionLayerRef.current);

        marker.on('click', () => {
          setInspectedEntity({
            id: al.id,
            tipo: 'omissao',
            nome: al.nome_rua,
            coord: `Lat ${al.latitude}, Lng ${al.longitude}`,
            detalhes: `Alerta Popular: "${al.descricao}" (Status: ${al.status.toUpperCase()})`,
            métrica: `RECLAMAÇÃO CIDADÃ - ${alertLabel}`,
            objeto: { tipo_resíduo_comum: al.descricao }
          });
        });

        marker.bindTooltip(`<b>Alerta Cidadão: ${al.tipo.toUpperCase()}</b><br/>${al.nome_rua}`, {
          direction: 'top',
          offset: [0, -6]
        });
      });
    }

    // 3. Clear and Draw Heatmap Points
    heatmapLayerRef.current.clearLayers();
    if (showHeatmap) {
      MOCK_HEATMAP_POINTS.forEach(hp => {
        const radius = 100 + (hp.volume_estimado_kg / 3200) * 150; // Dynamic Radius in meters
        
        const circle = L.circle([hp.latitude, hp.longitude], {
          radius: radius,
          fillColor: '#f59e0b',
          fillOpacity: 0.4,
          color: '#d97706',
          weight: 1.5
        }).addTo(heatmapLayerRef.current);

        circle.on('click', () => {
          setInspectedEntity({
            id: hp.id,
            tipo: 'heatmap',
            nome: hp.logradouro,
            coord: `Lat ${hp.latitude}, Lng ${hp.longitude}`,
            detalhes: `Ignicão do motorista permaneceu ligada por ${hp.tempo_parado_segundos} segundos consecutivamente com velocidade em zero.`,
            métrica: `VOLUME ESTIMADO: ${hp.volume_estimado_kg} Kg de Resíduo`,
            objeto: hp
          });
        });

        circle.bindTooltip(`<b>${hp.logradouro}</b><br/>Volume: ${hp.volume_estimado_kg} Kg`, {
          sticky: true
        });
      });
    }

    // 4. Clear and Draw Live Moving Truck Tracker
    if ((window as any).liveTruckLayer) {
      (window as any).liveTruckLayer.clearLayers();
      
      if (tele.isActive) {
        const activeDriver = getRVState.getDrivers().find(d => d.id === tele.driverId);
        const activeTruck = getRVState.getTrucks().find(t => t.id === tele.truckId);
        const activeRoute = MOCK_ROUTES.find(r => r.id === tele.routeId);

        const truckHtml = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-500 opacity-45"></span>
            <div class="relative inline-flex rounded-full h-8 w-8 bg-slate-950 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5.14a1 1 0 0 0-.29-.71l-4.4-4.44A1 1 0 0 0 16.61 6H14"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>
        `;
        const icon = L.divIcon({
          html: truckHtml,
          className: 'live-tracked-truck',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const truckMarker = L.marker([tele.latitude, tele.longitude], { icon })
          .addTo((window as any).liveTruckLayer);

        truckMarker.bindTooltip(`<b>COLETOR EM TRANSMISSÃO ONLINE</b><br/>
          Placa: ${activeTruck?.placa || 'Aguardando'}<br/>
          Motorista: ${activeDriver?.nome || 'Aguardando'}<br/>
          Velocidade: ${tele.speed} Km/H<br/>
          Ignição: ${tele.ignition ? 'LIGADA' : 'DESLIGADA'}<br/>
          Bateria: ${tele.battery}%`, {
          direction: 'top',
          offset: [0, -12],
          permanent: false
        });

        if (mapInstanceRef.current && typeof mapInstanceRef.current.panTo === 'function') {
          mapInstanceRef.current.panTo([tele.latitude, tele.longitude]);
        }
      }
    }

  }, [leafletLoaded, showRoutes, showOmissions, showHeatmap, selectedRouteId, tele, citizenAlerts]);

  return (
    <div className="space-y-6" id="gis-map-root">
      
      {/* HEADER DE CONTROLES DO GIS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-500" />
            Módulo de Geoprocessamento Urbano (GIS)
          </h2>
          <p className="text-xs text-slate-500">Cruzamentos geográficos em tempo real de sensores de ignição, GPS e denúncias</p>
        </div>

        {/* Escolha de Rota para exibição */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <span className="text-xs text-slate-500 font-medium">Rota ativa em exibição:</span>
          <select 
            value={selectedRouteId} 
            onChange={(e) => setSelectedRouteId(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 font-semibold"
          >
            {MOCK_ROUTES.map(r => (
              <option key={r.id} value={r.id}>{r.nome_rota}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DISPOSIÇÃO DO MAPA + INSPEÇÃO */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* FILTROS DE CAMADA (OVERLAYS) */}
        <div className="xl:col-span-1 bg-white border border-slate-200 rounded-xl p-4 space-y-4 h-fit shadow-sm">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            Camadas Cartográficas
          </h3>

          <div className="space-y-3">
            
            {/* Trajetos */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition">
              <span className="text-xs flex items-center gap-2 text-slate-700 font-medium">
                <RouteIcon className="w-3.5 h-3.5 text-blue-500" />
                Trajeto Oficial (Linhas)
              </span>
              <button onClick={() => setShowRoutes(!showRoutes)} className="text-slate-400 hover:text-slate-600 transition">
                {showRoutes ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            {/* Pontos Críticos Omissão (RF02) */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-rose-100 transition">
              <div className="flex flex-col">
                <span className="text-xs flex items-center gap-2 text-slate-700 font-medium">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                  Pontos Críticos (RF02)
                </span>
                <span className="text-[9px] text-slate-500 ml-5">Acúmulo consecutivo &gt;= 2</span>
              </div>
              <button onClick={() => setShowOmissions(!showOmissions)} className="text-slate-400 hover:text-slate-600 transition">
                {showOmissions ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            {/* Heatmap de Volumes de Paradas (RF06) */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-100 transition">
              <div className="flex flex-col">
                <span className="text-xs flex items-center gap-2 text-slate-700 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Heatmap de Volume (RF06)
                </span>
                <span className="text-[9px] text-slate-500 ml-5">Ign.=on + Speed=0</span>
              </div>
              <button onClick={() => setShowHeatmap(!showHeatmap)} className="text-slate-400 hover:text-slate-600 transition">
                {showHeatmap ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500 mt-2 space-y-1">
            <p className="font-semibold text-slate-700">Parâmetros das Regras:</p>
            <p><span className="text-rose-600 font-semibold">Omissão [RF02]:</span> Plotados em vermelho apenas pontos com falhas consecutivas superiores a 2 ciclos de rotas sem intervenção digital de coleta.</p>
            <p className="pt-1"><span className="text-amber-600 font-semibold">Volume [RF06]:</span> Círculos amarelos calculam volume proporcional ao tempo parado de sensores em paradas da frota.</p>
          </div>
        </div>

        {/* MAPA INTERATIVO CENTRAL (SATÉLITE / POLÍGONOS) */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-3 flex flex-col h-[520px] justify-between relative overflow-hidden group shadow-sm">
          
          {/* Indicador de camada */}
          <div className="absolute top-5 left-5 bg-slate-900/95 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] text-white font-mono shadow-md z-10 flex flex-col gap-1 items-start">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span>Vetorizador GIS • Paragominas (PA)</span>
            </div>
            <span className="text-[8px] text-slate-400">Dados baseados no OpenStreetMap (OSM)</span>
          </div>

          {/* VETORIZADOR GIS REAL COM LEAFLET (OPENSTREETMAP) */}
          <div className="w-full h-full relative bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200 overflow-hidden z-0">
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '440px' }} />
            
            {!leafletLoaded && (
              <div className="absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center text-white z-50 gap-2">
                <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-mono">Carregando camadas do OpenStreetMap...</p>
              </div>
            )}

            {/* LEGENDA NO CANTO INFERIOR DO MAPA */}
            <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-slate-800 rounded-lg p-2.5 text-[9px] font-mono text-slate-300 shadow-md space-y-1 z-10 w-44 pointer-events-none">
              <p className="font-bold border-b border-slate-800 pb-1 text-slate-400">Convenções Cartográficas</p>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
                <span className="text-rose-400 font-bold">Ponto Crítico [RF02]</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-amber-400">Volumetria GPS [RF06]</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-1.5 rounded-sm bg-blue-500/80"></div>
                <span>Linha de Trajeto Coleta</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center pb-1">
            <span>Dica de Navegação: Use o mouse/toque para mover o mapa e clique em qualquer indicador para ver detalhes no painel lateral</span>
          </div>

        </div>

        {/* INSPETOR LATERAL (INSPEÇÃO DE TELEMETRIA) */}
        <div className="xl:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Inspetor de Coordenada
            </h3>

            {inspectedEntity ? (
              <div className="mt-4 space-y-4">
                
                {/* Header com selo de tipo */}
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inspectedEntity.tipo === 'omissao' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {inspectedEntity.tipo === 'omissao' ? 'OMISSÃO CRÍTICA' : 'INDICADOR VOLUMÉTRICO'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">DADO OPERACIONAL</span>
                </div>

                {/* Localização */}
                <div>
                  <label className="text-[9px] uppercase font-mono text-slate-500 block">Logradouro / Estação</label>
                  <p className="text-sm font-semibold text-white mt-0.5 flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {inspectedEntity.nome}
                  </p>
                </div>

                {/* Coordenada literal */}
                <div className="bg-slate-950 p-2 rounded border border-slate-900/85">
                  <code className="text-[10px] text-slate-400 font-mono block">{inspectedEntity.coord}</code>
                </div>

                {/* Métrica de Cálculo da Regra */}
                <div className="p-3 bg-slate-950 rounded border border-slate-900 flex items-center gap-2.5">
                  {inspectedEntity.tipo === 'omissao' ? (
                    <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <label className="text-[8px] uppercase font-mono text-slate-500">Mapeador do Algoritmo</label>
                    <p className={`text-xs font-bold leading-normal ${
                      inspectedEntity.tipo === 'omissao' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{inspectedEntity.métrica}</p>
                  </div>
                </div>

                {/* Descrição em detalhes / Causa */}
                <div>
                  <label className="text-[9px] uppercase font-mono text-slate-500 block">Investigação da Causa Raiz</label>
                  <p className="text-xs text-slate-350 leading-relaxed mt-1 flex gap-1.5 p-2 bg-slate-950/20 rounded">
                    <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {inspectedEntity.detalhes}
                  </p>
                </div>

                {/* Objeto específico */}
                {inspectedEntity.tipo === 'omissao' && (
                  <div className="pt-2">
                    <label className="text-[9px] uppercase font-mono text-slate-500 block mb-1">Impacto Ambiental de Descarte</label>
                    <span className="inline-block bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2 py-1 rounded">
                      {inspectedEntity.objeto.tipo_resíduo_comum}
                    </span>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-center p-4">
                <p className="text-xs text-slate-500">Nenhuma telemetria pontual selecionada para inspeção visual.</p>
              </div>
            )}
          </div>

          {inspectedEntity && inspectedEntity.tipo === 'omissao' && (
            <div className="mt-6 p-3 bg-slate-950 border border-rose-950/30 rounded-lg text-[10px] text-slate-400 leading-normal">
              <span className="text-rose-400 font-bold block mb-1">Ação Preventiva Recomendada:</span>
              <span>Notificar fiscalização urbana para coibir estacionamento irregular de moradores sob multa baseada em geocomparitivo de imagens.</span>
            </div>
          )}

          {inspectedEntity && inspectedEntity.tipo === 'heatmap' && (
            <div className="mt-6 p-3 bg-slate-950 border border-emerald-950/30 rounded-lg text-[10px] text-slate-400 leading-normal">
              <span className="text-emerald-400 font-bold block mb-1">Análise de IA de Roteamento:</span>
              <span>Constatado alta concentração de descarte volumoso. Sugerido instalação de contentor bota-fora fixo para reduzir o tempo parado do caminhão no trajeto.</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
