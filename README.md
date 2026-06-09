# Rota Verde PGM - Portal de Gestão Unificada & Mobile Hub

O **Rota Verde PGM** é uma plataforma inteligente e integrada para o monitoramento, otimização e gestão dos serviços de coleta de resíduos e limpeza urbana do município de Paragominas. 

Este repositório contém a aplicação web principal (Painel de Controle BI, Mapa GIS em Tempo Real com Leaflet e o Hub de Integração de Aplicativos Móveis). 

---

## 📱 Conexão Funcional com os Apps Mobile (Como funciona?)

**Sim, é 100% possível conectar os seus aplicativos móveis reais (sejam eles feitos em Flutter, React Native, Kotlin ou Swift) de forma totalmente funcional com este sistema.**

### Arquitetura de Comunicação
A plataforma foi desenhada sob um modelo de **Gateway de Eventos Unificados** habilitado para receber conexões das suas pontas móveis:

1. **App dos Motoristas/Coleta (Transmissão de Telemetria GPS):**
   - O aplicativo rodando em segundo plano no smartphone ou tablet do motorista faz requisições HTTP do tipo `POST` de forma periódica (ex: a cada 10 ou 15 segundos).
   - O payload contém as coordenadas do GPS físico, a velocidade atual do caminhão, nível de bateria e estado da ignição.
   - O servidor recebe e processa essas informações, atualizando o mapa GIS instantaneamente no painel operacional.

2. **App do Cidadão (Ocorrências e Alertas de Limpeza):**
   - O munícipe utiliza o celular para reportar um descaso ou problema geolocalizado (como lixeiras cheias, omissão de varrição ou descarte de entulho irregular).
   - O app lê o sensor GPS do cidadão e envia via `POST /api/v1/citizen/alerts`.
   - A central de controle recebe o alerta por prioridade e plota o marcador vermelho ou laranja em tempo real no mapa operacional para despachar uma equipe.

---

## 🔑 Segurança e Autenticação

Todas as chamadas originadas das aplicações móveis precisam passar pelo firewall de Paragominas contendo o Cabeçalho HTTP de Autorização:

```http
Authorization: Bearer rv_live_key_97339377107_dev_paragominas_secure99a8b
```

*(Você pode gerar e rotacionar esta chave de autenticação a qualquer instante diretamente na aba de **Conexão Mobile** no painel).*

---

## 📡 Endpoints do Gateway Mobile

### 1. Transmitir Sinal de GPS & Telemetria do Coletor
* **Método:** `POST`
* **Rota:** `/api/v1/telemetry/report`
* **Payload Exemplo (JSON):**
  ```json
  {
    "driverId": 2,
    "truckId": 1,
    "routeId": 3,
    "latitude": -2.9985,
    "longitude": -47.3522,
    "speed": 34,
    "ignition": true,
    "battery": 97
  }
  ```

### 2. Registrar Alerta / Ocorrência Cidadã
* **Método:** `POST`
* **Rota:** `/api/v1/citizen/alerts`
* **Payload Exemplo (JSON):**
  ```json
  {
    "tipo": "omissao",
    "nome_rua": "Alameda Pará, Quadra 12 (Planalto)",
    "descricao": "Rua do comércio cheia de descartes sem caminhão recolher.",
    "latitude": -2.9785,
    "longitude": -47.3485
  }
  ```

---

## 🛠️ Tecnologias Utilizadas na Web

- **Layout & Visual:** React 18+ com Tailwind CSS (moderno, responsivo, modo escuro nativo para operações noturnas).
- **Mapa Satélite/Vias:** Leaflet JS + OpenStreetMap para visualização interativa de frotas e incidentes geoespaciais em tempo real.
- **Gráficos & BI:** Recharts para processamento de inteligência analítica de rotas coletadas, resíduos recolhidos e tempos de percurso.
- **Micro-Animações:** Motion (`motion/react`) para transições suaves.
- **Ícones do Sistema:** Lucide React.

---

## 🚀 Como Executar o Projeto Localmente

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o Servidor em Modo Desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Compilar para Produção:**
   ```bash
   npm run build
   ```

---

## 🌳 Estrutura do Código-fonte Principal

- `/src/components/GisMap.tsx` - Módulo do mapa operacional interativo com agrupamentos e traçados de rotas completas.
- `/src/components/BiDashboard.tsx` - Central de relatórios analíticos de eficiência, pesagens e emissões.
- `/src/components/ResourceManagement.tsx` - Escala diária e operacional de motoristas, veículos e equipes de varrição.
- `/src/components/AppIntegrationHub.tsx` - Interface interativa para visualização de logs em tempo real e documentação de código (Flutter/React Native/Swift/Kotlin).
- `/src/lib/syncState.ts` - Mecanismo de persistência client-side simulando barramento de dados unificado.
