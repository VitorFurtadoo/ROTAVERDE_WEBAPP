/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, Truck, Route } from '../types';
import { MOCK_DRIVERS, MOCK_TRUCKS, MOCK_ROUTES, MOCK_OMISSIONS } from '../data';

// Extended definitions
export interface ActiveTeam {
  id: number;
  nome_equipe: string;
  id_motorista: number;
  id_caminhao: number;
  id_rota: number;
  turno: 'diurno' | 'noturno' | 'vespertino';
  status: 'em_servico' | 'pausa' | 'finalizado';
}

export interface LiveTelemetry {
  driverId: number;
  truckId: number;
  routeId: number;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: boolean;
  battery: number;
  isActive: boolean;
  currStepIndex: number;
  lastUpdated: string;
}

export interface CitizenAlert {
  id: number;
  tipo: 'omissao' | 'lixeira_lotada' | 'descarte_irregular';
  nome_rua: string;
  latitude: number;
  longitude: number;
  descricao: string;
  recorrencia_ciclos: number;
  data_hora: string;
  status: 'pendente' | 'em_investigacao' | 'resolvido';
}

// Default initial Teams
const INITIAL_TEAMS: ActiveTeam[] = [
  { id: 1, nome_equipe: "Alfa - Coleta Rápida Centro", id_motorista: 1, id_caminhao: 1, id_rota: 1, turno: "diurno", status: "em_servico" },
  { id: 2, nome_equipe: "Beta - Comercial Cidade Nova", id_motorista: 2, id_caminhao: 2, id_rota: 2, turno: "noturno", status: "em_servico" },
  { id: 3, nome_equipe: "Gama - Industrial Pesado", id_motorista: 3, id_caminhao: 3, id_rota: 3, turno: "diurno", status: "pausa" }
];

// Default initial Citizen Alerts based on mock omissions plus extra
const INITIAL_CITIZEN_ALERTS: CitizenAlert[] = [
  { id: 101, tipo: 'omissao', nome_rua: 'Avenida Presidente Vargas, 452 (Centro)', latitude: -2.9985, longitude: -47.3522, descricao: 'Lixo acumulado há 3 dias. Lixeiras de condomínio cheias.', recorrencia_ciclos: 3, data_hora: '2026-06-09T10:30:00Z', status: 'pendente' },
  { id: 102, tipo: 'lixeira_lotada', nome_rua: 'Esquina da Rua Pará, Quadra 12 (Planalto)', latitude: -2.9785, longitude: -47.3485, descricao: 'Recipiente público quebrado e transbordando restos.', recorrencia_ciclos: 4, data_hora: '2026-06-09T11:15:00Z', status: 'em_investigacao' },
  { id: 103, tipo: 'descarte_irregular', nome_rua: 'Via Industrial, próximo à Serraria Ecológica', latitude: -3.0285, longitude: -47.3325, descricao: 'Descarte volumoso de sobras de madeira no acostamento primário.', recorrencia_ciclos: 1, data_hora: '2026-06-09T12:00:00Z', status: 'pendente' }
];

// Initialize local storage values if empty
export const initializeSyncState = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('rv_drivers')) {
    localStorage.setItem('rv_drivers', JSON.stringify(MOCK_DRIVERS));
  }
  if (!localStorage.getItem('rv_trucks')) {
    localStorage.setItem('rv_trucks', JSON.stringify(MOCK_TRUCKS));
  }
  if (!localStorage.getItem('rv_teams')) {
    localStorage.setItem('rv_teams', JSON.stringify(INITIAL_TEAMS));
  }
  if (!localStorage.getItem('rv_citizen_alerts')) {
    localStorage.setItem('rv_citizen_alerts', JSON.stringify(INITIAL_CITIZEN_ALERTS));
  }
  if (!localStorage.getItem('rv_telemetry')) {
    const defaultTelemetry: LiveTelemetry = {
      driverId: 1,
      truckId: 1,
      routeId: 1,
      latitude: -2.9985,
      longitude: -47.3522,
      speed: 0,
      ignition: false,
      battery: 100,
      isActive: false,
      currStepIndex: 0,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('rv_telemetry', JSON.stringify(defaultTelemetry));
  }
};

// State Event Dispatcher
const STATE_CHANGE_EVENT = 'rv_state_change';

export const dispatchStateChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
  }
};

// Helper getters/setters with Event dispatch
export const getRVState = {
  getDrivers: (): Driver[] => {
    initializeSyncState();
    return JSON.parse(localStorage.getItem('rv_drivers') || '[]');
  },
  setDrivers: (drivers: Driver[]) => {
    localStorage.setItem('rv_drivers', JSON.stringify(drivers));
    dispatchStateChange();
  },
  getTrucks: (): Truck[] => {
    initializeSyncState();
    return JSON.parse(localStorage.getItem('rv_trucks') || '[]');
  },
  setTrucks: (trucks: Truck[]) => {
    localStorage.setItem('rv_trucks', JSON.stringify(trucks));
    dispatchStateChange();
  },
  getTeams: (): ActiveTeam[] => {
    initializeSyncState();
    return JSON.parse(localStorage.getItem('rv_teams') || '[]');
  },
  setTeams: (teams: ActiveTeam[]) => {
    localStorage.setItem('rv_teams', JSON.stringify(teams));
    dispatchStateChange();
  },
  getAlerts: (): CitizenAlert[] => {
    initializeSyncState();
    return JSON.parse(localStorage.getItem('rv_citizen_alerts') || '[]');
  },
  setAlerts: (alerts: CitizenAlert[]) => {
    localStorage.setItem('rv_citizen_alerts', JSON.stringify(alerts));
    dispatchStateChange();
  },
  getTelemetry: (): LiveTelemetry => {
    initializeSyncState();
    return JSON.parse(localStorage.getItem('rv_telemetry') || '{}');
  },
  setTelemetry: (telemetry: LiveTelemetry) => {
    localStorage.setItem('rv_telemetry', JSON.stringify(telemetry));
    dispatchStateChange();
  }
};

// React Hook to subscribe to state alterations
import { useEffect as useReactEffect } from 'react';

export const useSyncState = (onStateChange: () => void) => {
  useReactEffect(() => {
    if (typeof window === 'undefined') return;
    initializeSyncState();
    
    const handler = () => {
      onStateChange();
    };

    window.addEventListener(STATE_CHANGE_EVENT, handler);
    // Also listen to storage modifications on other panes
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener(STATE_CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, [onStateChange]);
};
