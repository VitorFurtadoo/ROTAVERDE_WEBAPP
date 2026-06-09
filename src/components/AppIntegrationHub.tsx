/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getRVState, useSyncState, LiveTelemetry, CitizenAlert } from '../lib/syncState';
import { MOCK_ROUTES } from '../data';
import { 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Key, 
  RefreshCw, 
  Wifi, 
  Send, 
  HelpCircle,
  Smartphone,
  Cpu,
  BookOpen,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AppIntegrationHub() {
  const [drivers, setDrivers] = useState(getRVState.getDrivers());
  const [trucks, setTrucks] = useState(getRVState.getTrucks());
  const [alerts, setAlerts] = useState(getRVState.getAlerts());
  const [telemetry, setTelemetry] = useState(getRVState.getTelemetry());

  // Subscription hook to dynamic state alteration
  useSyncState(() => {
    setDrivers(getRVState.getDrivers());
    setTrucks(getRVState.getTrucks());
    setAlerts(getRVState.getAlerts());
    setTelemetry(getRVState.getTelemetry());
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('rv_live_key_97339377107_dev_paragominas_secure99a8b');
  const [selectedLanguage, setSelectedLanguage] = useState<'flutter' | 'reactNative' | 'swift' | 'kotlin'>('flutter');
  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'playground' | 'logs'>('docs');

  // Logs list for simulating live connections
  const [liveLogs, setLiveLogs] = useState<Array<{
    id: string;
    timestamp: string;
    method: 'POST' | 'GET';
    endpoint: string;
    status: number;
    payloadName: string;
    body: string;
  }>>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      method: 'GET',
      endpoint: '/api/v1/routes/1/path',
      status: 200,
      payloadName: 'Baixar Trajeto GPS',
      body: JSON.stringify({ ok: true, routeId: 1, pointsCount: 8 }, null, 2)
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2000).toISOString(),
      method: 'POST',
      endpoint: '/api/v1/telemetry/report',
      status: 202,
      payloadName: 'Coordenadas do Coletor',
      body: JSON.stringify({ status: "processed", deviceId: "TRK-01", lat: -2.9985, lng: -47.3522 }, null, 2)
    }
  ]);

  // Playground request states
  const [playDriverId, setPlayDriverId] = useState(1);
  const [playTruckId, setPlayTruckId] = useState(1);
  const [playRouteId, setPlayRouteId] = useState(1);
  const [playLat, setPlayLat] = useState(-2.9985);
  const [playLng, setPlayLng] = useState(-47.3522);
  const [playSpeed, setPlaySpeed] = useState(30);
  const [playIgnition, setPlayIgnition] = useState(true);
  const [playBattery, setPlayBattery] = useState(94);

  // Playground custom citizen alerts
  const [playAlertType, setPlayAlertType] = useState<'omissao' | 'lixeira_lotada' | 'descarte_irregular'>('omissao');
  const [playAlertStreet, setPlayAlertStreet] = useState('Alameda Pará, Quadra 12 (Planalto)');
  const [playAlertDesc, setPlayAlertDesc] = useState('Omissão de coleta reportada hoje cedo.');

  const [sandboxFeedback, setSandboxFeedback] = useState<string | null>(null);

  // Helper copy function
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Generate new dynamic API Key
  const handleRotateKey = () => {
    const chars = 'abcdef0123456789';
    let rand = '';
    for (let i = 0; i < 16; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    setApiKey(`rv_live_key_97339377107_${rand}`);
    addConsoleLog('SYSTEM', 'Chave JWT Rotacionada com sucesso. Altere em suas variáveis mob do Flutter/React Native.', '🔄');
  };

  // Appends a diagnostic log
  const addConsoleLog = (method: 'POST' | 'GET' | 'SYSTEM', endpoint: string, icon: string, bodyObj?: any) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      method: method === 'SYSTEM' ? 'GET' as any : method,
      endpoint,
      status: method === 'SYSTEM' ? 200 : 202,
      payloadName: method === 'SYSTEM' ? icon : `Payload Recebido (${icon})`,
      body: JSON.stringify(bodyObj || { info: "Logs processados via Gateway Mobile RotaVerde" }, null, 2)
    };
    setLiveLogs(prev => [newLog, ...prev.slice(0, 15)]);
  };

  // Submits a simulated Mobile telemetria event (updates GIS telemetry & local storage!)
  const submitPlaygroundTelemetry = () => {
    const updatedTelemetry: LiveTelemetry = {
      driverId: playDriverId,
      truckId: playTruckId,
      routeId: playRouteId,
      latitude: playLat,
      longitude: playLng,
      speed: playSpeed,
      ignition: playIgnition,
      battery: playBattery,
      isActive: true,
      currStepIndex: 0,
      lastUpdated: new Date().toISOString()
    };

    getRVState.setTelemetry(updatedTelemetry);
    addConsoleLog('POST', '/api/v1/telemetry/report', 'Dispositivo Móvel', updatedTelemetry);
    
    setSandboxFeedback('Telemetria GPS enviada! O Mapa GIS e o Painel foram atualizados em tempo real.');
    setTimeout(() => setSandboxFeedback(null), 4000);
  };

  // Submits a simulated citizen alert
  const submitPlaygroundAlert = () => {
    // Generate slight random offsets to plot properly in Paragominas
    let lat = -2.9985 + (Math.random() - 0.5) * 0.01;
    let lng = -47.3522 + (Math.random() - 0.5) * 0.01;

    if (playAlertStreet.includes('Planalto')) {
      lat = -2.9785 + (Math.random() - 0.5) * 0.003;
      lng = -47.3485 + (Math.random() - 0.5) * 0.003;
    }

    const newAlert: CitizenAlert = {
      id: Date.now(),
      tipo: playAlertType,
      nome_rua: playAlertStreet,
      latitude: Math.round(lat * 10000) / 10000,
      longitude: Math.round(lng * 10000) / 10000,
      descricao: playAlertDesc || 'Enviado via aplicativo do cidadão.',
      recorrencia_ciclos: 1,
      data_hora: new Date().toISOString(),
      status: 'pendente'
    };

    getRVState.setAlerts([newAlert, ...alerts]);
    addConsoleLog('POST', '/api/v1/citizen/alerts', 'Alerta Cidadão', newAlert);

    setSandboxFeedback('Ocorrência registrada! Veja o novo ícone do alerta cidadão brilhando no mapa GIS.');
    setTimeout(() => setSandboxFeedback(null), 4000);
  };

  // Pre-load coordinates based on some routes for helper
  const handlePreloadCoordsForRoute = (routeId: number) => {
    setPlayRouteId(routeId);
    if (routeId === 1) {
      setPlayLat(-2.9760);
      setPlayLng(-47.3100);
    } else if (routeId === 2) {
      setPlayLat(-2.9980);
      setPlayLng(-47.3525);
    } else {
      setPlayLat(-3.0100);
      setPlayLng(-47.3250);
    }
  };

  // Source codes content
  const codeSnippets = {
    flutter: `// Flutter (http package) - Transmissão de GPS do Motorista
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> enviarTelemetriaGps({
  required double latitude,
  required double longitude,
  required double velocidade,
  required bool ignicao,
  required int bateria,
}) async {
  final url = Uri.parse('https://api.rotaverde.gov.br/api/v1/telemetry/report');
  
  final Map<String, dynamic> payload = {
    "driverId": 1, // ID do motorista autenticado
    "truckId": 2,  // ID do caminhão coletor
    "routeId": 3,  // Rota ativa vinculada
    "latitude": latitude,
    "longitude": longitude,
    "speed": velocidade, 
    "ignition": ignicao,
    "battery": bateria,
    "timestamp": DateTime.now().toUtc().toIso8601String()
  };

  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${apiKey}',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode == 202) {
      print('Transmissão aceita pelo gateway de Paragominas');
    } else {
      print('Erro ao enviar coordenadas: \${response.statusCode}');
    }
  } catch (e) {
    print('Falha de conexão com o satélite/API: \$e');
  }
}`,
    reactNative: `// React Native (fetch) - Envio de Alerta pelo App do Cidadão
const registrarAlertaCidadao = async (tipo, rua, descricao) => {
  const url = 'https://api.rotaverde.gov.br/api/v1/citizen/alerts';
  
  const payload = {
    tipo: tipo, // 'omissao' | 'lixeira_lotada' | 'descarte_irregular'
    nome_rua: rua,
    descricao: descricao,
    latitude: -2.9785, // Coordenada capturada pelo GPS do smartphone
    longitude: -47.3485,
    data_hora: new Date().toISOString()
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${apiKey}'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.status === 201 || response.status === 202) {
      console.log('Ocorrência inserida na fila da Secretaria de Obras:', data.id);
      return data;
    }
  } catch (error) {
    console.error('Falha ao reportar no aplicativo público:', error);
  }
};`,
    swift: `// Swift (URLSession) - Get Ativa Rota Trajeto
import Foundation

struct RoutePointResponse: Codable {
    let routeId: Int
    let points: [[Double]]
}

func fetchRotaAtiva(routeId: Int) {
    let urlString = "https://api.rotaverde.gov.br/api/v1/routes/\\(routeId)/path"
    guard let url = URL(string: urlString) else { return }
    
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.setValue("Bearer ${apiKey}", forHTTPHeaderField: "Authorization")
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Erro de rede: \\(error)")
            return
        }
        
        if let data = data, let decodedObj = try? JSONDecoder().decode(RoutePointResponse.self, from: data) {
            print("Trajeto carregado. Total de pontos da rota: \\(decodedObj.points.count)")
        }
    }
    task.resume()
}`,
    kotlin: `// Kotlin (OkHttp) - Transmissão GPS em segundo plano
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

fun transmitirCoordenadasBackground(lat: Double, lng: Double, speed: Int) {
    val client = OkHttpClient()
    val mediaType = "application/json; charset=utf-8".toMediaType()
    
    val jsonPayload = JSONObject().apply {
        put("driverId", 3)
        put("truckId", 1)
        put("routeId", 2)
        put("latitude", lat)
        put("longitude", lng)
        put("speed", speed)
        put("ignition", true)
        put("battery", 88)
    }

    val body = jsonPayload.toString().toRequestBody(mediaType)
    val request = Request.Builder()
        .url("https://api.rotaverde.gov.br/api/v1/telemetry/report")
        .post(body)
        .addHeader("Authorization", "Bearer ${apiKey}")
        .build()

    client.newCall(request).execute().use { response ->
        if (response.isSuccessful) {
            println("GPS Gravado no banco unificado: \${response.code}")
        }
    }
}`
  };

  return (
    <div className="space-y-6" id="app-integration-hub-root">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
              Portal de Integração dos Aplicativos Móveis (Mobile Hub)
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Este painel fornece os canais, chaves de autenticação JWT e rotas de APIs que conectam o seu <strong>Aplicativo Móvel Real</strong> (dos motoristas e dos cidadãos) ao sistema de gestão unificada de Paragominas.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Wifi className="w-4 h-4 text-emerald-400 animate-ping" />
            <span>Gateway Operacional Online</span>
          </div>
        </div>

        {/* COPYABLE KEY MANAGER */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Bearer Token de Autorização Mobile (JWT)</span>
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <code className="text-xs text-slate-350 select-all font-mono truncate">{apiKey}</code>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pl-2 shrink-0">
              <button 
                onClick={() => handleCopy(apiKey, 'apiKey')}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                title="Copiar Token"
              >
                {copiedText === 'apiKey' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleRotateKey}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                title="Rotacionar Chave de Segurança"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-slate-400 text-xs flex items-center justify-start gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight text-[11px]">
              Insira este Bearer Token no cabeçalho de autenticação HTTP <code>Authorization: Bearer &lt;key&gt;</code> para que o aplicativo mobile consiga passar pelo firewall do servidor.
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLES MINI NAVEGAÇÃO DE PÁGINA */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTabTab('docs')}
          className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'docs' 
              ? 'border-emerald-500 text-slate-900 bg-emerald-50/20' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Documentação das APIs (Endpoints)
        </button>
        <button 
          onClick={() => setActiveTabTab('playground')}
          className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'playground' 
              ? 'border-emerald-500 text-slate-900 bg-emerald-50/20' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Send className="w-4 h-4" />
          Simulador de Requisições / Playground
        </button>
        <button 
          onClick={() => setActiveTabTab('logs')}
          className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'logs' 
              ? 'border-emerald-500 text-slate-900 bg-emerald-50/20' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Terminal de Eventos em Tempo Real
        </button>
      </div>

      {/* FEEDBACK DO PLAYGROUND */}
      {sandboxFeedback && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{sandboxFeedback}</span>
        </div>
      )}

      {/* CONTEÚDO 1: DOCUMENTAÇÃO DE ENDPOINTS */}
      {activeSubTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="documentation-section">
          
          {/* LADO ESQUERDO: OS ENDPOINTS DETALHADOS */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest block">Endpoints de Recursos Móveis</h3>
            
            {/* API 1 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] font-mono">POST</span>
                  <code className="text-xs font-bold text-slate-800">/api/v1/telemetry/report</code>
                </div>
                <span className="text-[10px] text-slate-550 text-slate-500 font-medium">Sinal do Caminhão</span>
              </div>
              
              <div className="p-4 space-y-3 font-sans text-xs text-slate-600">
                <p>
                  Esse endpoint é utilizado pela linha de código do <strong>App do Motorista</strong>. Transmite o status da ignição veicular cadastrada, nível de bateria e coordenadas GPS para desenhar o caminhão coletor no Mapa ao vivo.
                </p>

                <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-1.5 font-mono text-[10px]">
                  <p className="font-bold border-b border-slate-200 pb-1 text-[11px] text-slate-700">Headers:</p>
                  <p><span className="text-slate-500">Content-Type:</span> application/json</p>
                  <p><span className="text-slate-500">Authorization:</span> Bearer {apiKey}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded font-mono text-[10px] text-emerald-400 overflow-x-auto">
                  <p className="text-slate-500 border-b border-slate-900 pb-1 mb-1 font-sans">JSON BODY PAYLOAD:</p>
{`{
  "driverId": 2,       // ID do motorista autenticado
  "truckId": 1,        // ID do caminhão (escala ativa)
  "routeId": 3,        // ID do trajeto que está sendo percorrido
  "latitude": -2.9985, // Coordenada latitude do coletor
  "longitude": -47.3522, // Coordenada longitude
  "speed": 34,         // Velocidade instantânea do caminhão
  "ignition": true,    // Sensor de ignição acionado
  "battery": 97        // Percentual de bateria do celular
}`}
                </div>
              </div>
            </div>

            {/* API 2 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] font-mono">POST</span>
                  <code className="text-xs font-bold text-slate-800">/api/v1/citizen/alerts</code>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Alerta do Cidadão</span>
              </div>
              
              <div className="p-4 space-y-3 font-sans text-xs text-slate-600">
                <p>
                  Esse endpoint é consumido pelo <strong>App do Usuário / Cidadão</strong>. Serve para relatar de forma automatizada problemas geográficos nas ruas de Paragominas, como acúmulo de entulho irregular, lixeiras quebrando ou omissões no trajeto.
                </p>

                <div className="bg-slate-950 p-2.5 rounded font-mono text-[10px] text-emerald-400 overflow-x-auto">
                  <p className="text-slate-500 border-b border-slate-900 pb-1 mb-1 font-sans">JSON BODY PAYLOAD:</p>
{`{
  "tipo": "omissao", // "omissao" | "lixeira_lotada" | "descarte_irregular"
  "nome_rua": "Alameda Pará, Quadra 12 (Planalto)",
  "descricao": "Rua do comércio cheia de descartes sem caminhão recolher.",
  "latitude": -2.9785,
  "longitude": -47.3485
}`}
                </div>
              </div>
            </div>

          </div>

          {/* LADO DIREITO: CÓDIGO FONTE MULTI-LANGUAGE */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest block">Código Integrado</h3>
              
              <div className="flex bg-slate-150 bg-slate-100 rounded-lg p-0.5 shrink-0 text-[10px] font-bold">
                <button 
                  onClick={() => setSelectedLanguage('flutter')}
                  className={`px-2 py-1 rounded transition ${selectedLanguage === 'flutter' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  Flutter
                </button>
                <button 
                  onClick={() => setSelectedLanguage('reactNative')}
                  className={`px-2 py-1 rounded transition ${selectedLanguage === 'reactNative' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  RN
                </button>
                <button 
                  onClick={() => setSelectedLanguage('kotlin')}
                  className={`px-2 py-1 rounded transition ${selectedLanguage === 'kotlin' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  Kotlin
                </button>
                <button 
                  onClick={() => setSelectedLanguage('swift')}
                  className={`px-2 py-1 rounded transition ${selectedLanguage === 'swift' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  Swift
                </button>
              </div>
            </div>

            {/* CAIXA DE CÓDIGO */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/60 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  classe_servico_mobile.{selectedLanguage === 'swift' ? 'swift' : selectedLanguage === 'flutter' ? 'dart' : selectedLanguage === 'kotlin' ? 'kt' : 'js'}
                </span>
                <button 
                  onClick={() => handleCopy(codeSnippets[selectedLanguage], 'snippetCopy')}
                  className="flex items-center gap-1 text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 py-1 px-2 rounded border border-slate-800 transition"
                >
                  {copiedText === 'snippetCopy' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 overflow-auto text-[10.5px] text-slate-300 font-mono leading-relaxed max-h-[440px] whitespace-pre">
                <code>{codeSnippets[selectedLanguage]}</code>
              </pre>

              <div className="p-3 bg-slate-900/60 border-t border-slate-850/50 text-[10px] text-slate-450 text-slate-400 font-sans leading-snug">
                ⚠️ Certifique-se de configurar a permissão de <strong>Internet</strong> e <strong>Acesso à Geolocalização em Background (FINE_LOCATION)</strong> nas configurações do AndroidManifest e Info.plist das suas respectivas apps móveis.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* CONTEÚDO 2: API PLAYGROUND SANDBOX */}
      {activeSubTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="sandbox-section">
          
          {/* PAINEL MOTORISTA SANDBOX TRANSMISSION */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase block w-fit mb-1">
                API Test Bench
              </span>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                Simular Transmissão GPS do Motorista
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Simule a chamada POST do celular do caminhão diretamente no Leaflet Gis Map.</p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              
              {/* Seletor de Rota assistida para carregar coordenadas de Paragominas */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 block">Autopreencher por Trajeto</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handlePreloadCoordsForRoute(1)}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition ${
                      playRouteId === 1 ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Setor Centro (R1)
                  </button>
                  <button 
                    onClick={() => handlePreloadCoordsForRoute(2)}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition ${
                      playRouteId === 2 ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Cidade Nova (R2)
                  </button>
                  <button 
                    onClick={() => handlePreloadCoordsForRoute(3)}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition ${
                      playRouteId === 3 ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Polo Moveleiro (R3)
                  </button>
                </div>
              </div>

              {/* Equipe Vinculo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Motorista ID</label>
                  <select 
                    value={playDriverId} 
                    onChange={(e) => setPlayDriverId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Caminhão ID</label>
                  <select 
                    value={playTruckId} 
                    onChange={(e) => setPlayTruckId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                  >
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.placa} • {t.modelo}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordenadas Lat/lng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Latitude (Simulada)</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={playLat}
                    onChange={(e) => setPlayLat(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Longitude (Simulada)</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={playLng}
                    onChange={(e) => setPlayLng(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Velocidade e ignição */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Velocidade (KM/H)</label>
                  <input 
                    type="number" 
                    value={playSpeed}
                    onChange={(e) => setPlaySpeed(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-500 block">Ignição Física</label>
                  <div className="flex bg-slate-100 rounded p-1">
                    <button 
                      type="button" 
                      onClick={() => setPlayIgnition(true)}
                      className={`flex-1 py-0.5 text-[10.5px] font-bold rounded ${playIgnition ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-650 text-slate-500'}`}
                    >
                      LIGADA
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPlayIgnition(false)}
                      className={`flex-1 py-0.5 text-[10.5px] font-bold rounded ${!playIgnition ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-650 text-slate-500'}`}
                    >
                      RECEPTOR
                    </button>
                  </div>
                </div>
              </div>

              {/* Bateria do Celular */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-mono text-slate-500">
                  <label>Dispositivo Bateria Celular</label>
                  <span>{playBattery}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={playBattery}
                  onChange={(e) => setPlayBattery(Number(e.target.value))}
                  className="w-full h-1.5 accent-emerald-500 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Botão de Envio */}
              <button 
                onClick={submitPlaygroundTelemetry}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                POST /api/v1/telemetry/report
              </button>

            </div>
          </div>

          {/* PAINEL CIDADÃO SANDBOX ALERTS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase block w-fit mb-1">
                API Test Bench
              </span>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Simular Alerta do App de Usuários
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Crie alertas remotos em nome de um munícipe para testar na central.</p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              
              {/* Ocorrência Tipo */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 block">Tipo do Problema</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPlayAlertType('omissao')}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold text-center transition ${
                      playAlertType === 'omissao' ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Omissão Coleta
                  </button>
                  <button 
                    onClick={() => setPlayAlertType('lixeira_lotada')}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold text-center transition ${
                      playAlertType === 'lixeira_lotada' ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Lixeira Lotada
                  </button>
                  <button 
                    onClick={() => setPlayAlertType('descarte_irregular')}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold text-center transition ${
                      playAlertType === 'descarte_irregular' ? 'bg-slate-100 border-slate-350 text-slate-800 font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Entulho Rua
                  </button>
                </div>
              </div>

              {/* Logradouro fixo de Paragominas */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 block">Identificação de Rua / Bairro</label>
                <select 
                  value={playAlertStreet} 
                  onChange={(e) => setPlayAlertStreet(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-medium"
                >
                  <option value="Alameda Pará, Quadra 12 (Planalto)">Alameda Pará, Quadra 12 (Planalto)</option>
                  <option value="Avenida Presidente Vargas, 452 (Centro)">Avenida Presidente Vargas, 452 (Centro)</option>
                  <option value="Via Industrial, próximo à Serraria Ecológica">Via Industrial, Serraria Ecológica</option>
                  <option value="Anel Viário, Km 1.8 (Cidade Nova)">Anel Viário, Km 1.8 (Cidade Nova)</option>
                </select>
              </div>

              {/* Descrição em comentário */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 block">Comentários / Mensagem (Descrição do Alerta)</label>
                <textarea 
                  placeholder="Ex: Acumulou muito lixo orgânico debaixo do ponto de ônibus principal..."
                  rows={3}
                  value={playAlertDesc}
                  onChange={(e) => setPlayAlertDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                ></textarea>
              </div>

              {/* Botão de Envio */}
              <button 
                onClick={submitPlaygroundAlert}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 mt-5"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                POST /api/v1/citizen/alerts
              </button>

            </div>
          </div>

        </div>
      )}

      {/* CONTEÚDO 3: TERMINAL LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden" id="live-terminal-panel">
          
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-slate-350">LIVE REQUEST TUNNEL CONSOLE</span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
              <span>Filtro: Todos os Endpoints</span>
              <button 
                onClick={() => setLiveLogs([])}
                className="text-slate-400 hover:text-white transition"
              >
                Limpar Logs
              </button>
            </div>
          </div>

          <div className="p-4 font-mono text-xs max-h-[480px] overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 max-h-[350px]">
            {liveLogs.length === 0 ? (
              <p className="text-slate-500 italic py-8 text-center bg-slate-950">Aguardando a primeira conexão de rede móvel...</p>
            ) : (
              liveLogs.map((log) => (
                <div key={log.id} className="border-b border-slate-900 pb-3 last:border-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="text-slate-600 font-sans">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9.5px] ${
                        log.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-900' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-white font-bold">{log.endpoint}</span>
                      <span className="text-slate-550 text-slate-500">({log.payloadName})</span>
                    </div>

                    <span className={`text-[10px] font-bold px-1.5 py-0.1 rounded ${
                      log.status === 200 || log.status === 202 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      STATUS: {log.status}
                    </span>
                  </div>

                  <pre className="mt-1 bg-slate-900/40 p-2.5 rounded border border-slate-900 text-[10px] text-slate-400 overflow-x-auto whitespace-pre">
                    {log.body}
                  </pre>
                </div>
              ))
            )}
          </div>

          <div className="p-3.5 bg-slate-900/60 border-t border-slate-800/65 flex justify-between items-center text-[10px] text-slate-500 font-sans">
            <span>🚀 Escutando na porta unificada <strong>:3000</strong> de ingress de Paragominas</span>
            <span>Versão API: v1.1.2</span>
          </div>

        </div>
      )}

    </div>
  );

  // Dynamic state navigation handler
  function setActiveTabTab(tab: 'docs' | 'playground' | 'logs') {
    setActiveSubTab(tab);
  }
}
