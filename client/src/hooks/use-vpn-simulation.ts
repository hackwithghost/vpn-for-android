import { useState, useEffect, useCallback } from 'react';

export type VpnStatus = 'disconnected' | 'connecting' | 'connected';

export interface VpnServer {
  id: string;
  name: string;
  countryCode: string;
  flag: string;
  ping: number;
}

export const DEMO_SERVERS: VpnServer[] = [
  { id: 'us-east', name: 'New York, USA', countryCode: 'US', flag: '🇺🇸', ping: 24 },
  { id: 'de-frankfurt', name: 'Frankfurt, Germany', countryCode: 'DE', flag: '🇩🇪', ping: 18 },
  { id: 'sg-main', name: 'Singapore', countryCode: 'SG', flag: '🇸🇬', ping: 45 },
  { id: 'in-mumbai', name: 'Mumbai, India', countryCode: 'IN', flag: '🇮🇳', ping: 62 },
  { id: 'jp-tokyo', name: 'Tokyo, Japan', countryCode: 'JP', flag: '🇯🇵', ping: 38 },
];

const generateFakeIp = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

interface SavedConnectionState {
  status: VpnStatus;
  ipAddress: string;
}

const STORAGE_KEY = 'vpn-connection-state';

const loadConnectionState = (): SavedConnectionState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveConnectionState = (state: SavedConnectionState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

const clearConnectionState = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

export function useVpnSimulation() {
  const savedState = loadConnectionState();
  const [status, setStatus] = useState<VpnStatus>(savedState?.status || 'disconnected');
  const [activeServer, setActiveServer] = useState<VpnServer>(DEMO_SERVERS[0]);
  const [ipAddress, setIpAddress] = useState<string>(savedState?.ipAddress || '---.---.---.---');
  const [connectionTime, setConnectionTime] = useState<number>(0);
  
  // Speeds in Mbps
  const [speeds, setSpeeds] = useState({ download: 0, upload: 0 });

  // Handle connection toggle
  const toggleConnection = useCallback(() => {
    if (status === 'disconnected') {
      setStatus('connecting');
      // Simulate connection delay
      setTimeout(() => {
        const newIp = generateFakeIp();
        setStatus('connected');
        setIpAddress(newIp);
        setConnectionTime(0);
        // Save connection state to localStorage
        saveConnectionState({ status: 'connected', ipAddress: newIp });
      }, 2500 + Math.random() * 1000); // 2.5s - 3.5s delay
    } else {
      setStatus('disconnected');
      setIpAddress('---.---.---.---');
      setConnectionTime(0);
      setSpeeds({ download: 0, upload: 0 });
      // Clear saved connection state
      clearConnectionState();
    }
  }, [status]);

  // Handle connection timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'connected') {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Handle network speed simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'connected') {
      // Fluctuate speeds rapidly for visual effect
      interval = setInterval(() => {
        setSpeeds({
          download: +(Math.random() * 150 + 50).toFixed(1), // 50 - 200 Mbps
          upload: +(Math.random() * 40 + 10).toFixed(1),    // 10 - 50 Mbps
        });
      }, 800);
    } else {
      setSpeeds({ download: 0, upload: 0 });
    }
    return () => clearInterval(interval);
  }, [status]);

  return {
    status,
    activeServer,
    setActiveServer,
    ipAddress,
    connectionTime,
    speeds,
    toggleConnection,
    servers: DEMO_SERVERS,
  };
}
