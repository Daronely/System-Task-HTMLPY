import { useState, useEffect, useCallback } from 'react';

// Simulated system data types
export interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  temperature: number;
}

export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'stopped';
  user: string;
  isAdmin: boolean;
  isSigned: boolean;
}

export interface SystemSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  motherboard: string;
  os: string;
  uptime: string;
  powerOnHours: number;
}

export interface StartupApp {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
  impact: 'low' | 'medium' | 'high';
}

export interface EventLog {
  id: string;
  type: 'error' | 'warning' | 'info' | 'critical';
  source: string;
  message: string;
  timestamp: Date;
}

export interface CacheItem {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'temp' | 'browser' | 'app';
  canDelete: boolean;
}

// Generate random metrics
const generateMetrics = (): SystemMetrics => ({
  cpu: Math.random() * 100,
  ram: 40 + Math.random() * 40,
  disk: 20 + Math.random() * 30,
  network: Math.random() * 1000,
  temperature: 40 + Math.random() * 30,
});

// Generate mock processes
const processNames = [
  'Chrome', 'Firefox', 'VSCode', 'Spotify', 'Discord', 'Slack',
  'Teams', 'Node', 'Python', 'Explorer', 'SystemService', 'Antivirus',
  'BackgroundTask', 'UpdateService', 'DriverHost', 'RuntimeBroker'
];

const generateProcesses = (): Process[] => {
  return processNames.map((name, i) => ({
    pid: 1000 + i * 123,
    name,
    cpu: Math.random() * 30,
    memory: Math.random() * 500,
    status: Math.random() > 0.1 ? 'running' : 'sleeping',
    user: Math.random() > 0.5 ? 'User' : 'SYSTEM',
    isAdmin: Math.random() > 0.7,
    isSigned: Math.random() > 0.2,
  }));
};

// System specs (static-ish)
const systemSpecs: SystemSpecs = {
  cpu: 'AMD Ryzen 9 5900X @ 3.7GHz (12C/24T)',
  gpu: 'NVIDIA GeForce RTX 3080 (10GB GDDR6X)',
  ram: '32GB DDR4-3600 (2x16GB)',
  motherboard: 'ASUS ROG Crosshair VIII Hero',
  os: 'Windows 11 Pro (Build 22631.3447)',
  uptime: '4d 12h 34m',
  powerOnHours: 8432,
};

// Startup apps
const startupApps: StartupApp[] = [
  { id: '1', name: 'Discord', path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', enabled: true, impact: 'medium' },
  { id: '2', name: 'Spotify', path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', enabled: true, impact: 'low' },
  { id: '3', name: 'Steam', path: 'C:\\Program Files\\Steam\\Steam.exe', enabled: false, impact: 'high' },
  { id: '4', name: 'OneDrive', path: 'C:\\Program Files\\Microsoft OneDrive\\OneDrive.exe', enabled: true, impact: 'medium' },
  { id: '5', name: 'Nvidia GeForce', path: 'C:\\Program Files\\NVIDIA\\NvContainer.exe', enabled: true, impact: 'low' },
];

// Event logs
const generateEventLogs = (): EventLog[] => [
  { id: '1', type: 'error', source: 'Application', message: 'Chrome crashed unexpectedly', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', type: 'warning', source: 'System', message: 'High CPU usage detected for extended period', timestamp: new Date(Date.now() - 7200000) },
  { id: '3', type: 'info', source: 'Windows Update', message: 'Updates installed successfully', timestamp: new Date(Date.now() - 86400000) },
  { id: '4', type: 'critical', source: 'Kernel-Power', message: 'System recovered from unexpected shutdown', timestamp: new Date(Date.now() - 172800000) },
  { id: '5', type: 'warning', source: 'Disk', message: 'Low disk space on drive C:', timestamp: new Date(Date.now() - 259200000) },
  { id: '6', type: 'info', source: 'Security', message: 'Windows Defender scan completed', timestamp: new Date(Date.now() - 345600000) },
  { id: '7', type: 'error', source: 'Application', message: 'VSCode extension failed to load', timestamp: new Date(Date.now() - 432000000) },
];

// Cache items
const cacheItems: CacheItem[] = [
  { id: '1', name: 'Windows Temp', path: 'C:\\Windows\\Temp', size: 1240000000, type: 'temp', canDelete: true },
  { id: '2', name: 'User Temp', path: 'C:\\Users\\User\\AppData\\Local\\Temp', size: 2560000000, type: 'temp', canDelete: true },
  { id: '3', name: 'Chrome Cache', path: 'C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache', size: 890000000, type: 'browser', canDelete: true },
  { id: '4', name: 'Edge Cache', path: 'C:\\Users\\User\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache', size: 450000000, type: 'browser', canDelete: true },
  { id: '5', name: 'Discord Cache', path: 'C:\\Users\\User\\AppData\\Roaming\\discord\\Cache', size: 320000000, type: 'app', canDelete: true },
  { id: '6', name: 'Spotify Cache', path: 'C:\\Users\\User\\AppData\\Local\\Spotify\\Storage', size: 1800000000, type: 'app', canDelete: true },
];

export function useSystemMetrics(interval = 1000) {
  const [metrics, setMetrics] = useState<SystemMetrics>(generateMetrics());
  const [history, setHistory] = useState<SystemMetrics[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);
      setHistory((prev) => [...prev.slice(-59), newMetrics]);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { metrics, history };
}

export function useProcesses() {
  const [processes, setProcesses] = useState<Process[]>(generateProcesses());

  useEffect(() => {
    const timer = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 10),
          memory: Math.max(0, p.memory + (Math.random() - 0.5) * 50),
        }))
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const killProcess = useCallback((pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  }, []);

  return { processes, killProcess };
}

export function useSystemSpecs() {
  const [specs] = useState<SystemSpecs>(systemSpecs);
  const [appUptime, setAppUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAppUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatAppUptime = () => {
    const hours = Math.floor(appUptime / 3600);
    const minutes = Math.floor((appUptime % 3600) / 60);
    const seconds = appUptime % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return { specs, appUptime: formatAppUptime() };
}

export function useStartupApps() {
  const [apps, setApps] = useState<StartupApp[]>(startupApps);

  const toggleApp = useCallback((id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, enabled: !app.enabled } : app
      )
    );
  }, []);

  return { apps, toggleApp };
}

export function useEventLogs() {
  const [logs] = useState<EventLog[]>(generateEventLogs());
  return { logs };
}

export function useCacheItems() {
  const [items, setItems] = useState<CacheItem[]>(cacheItems);
  const [cleaning, setCleaning] = useState(false);

  const cleanItems = useCallback(async (ids: string[]) => {
    setCleaning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    setCleaning(false);
  }, []);

  const totalSize = items.reduce((acc, item) => acc + item.size, 0);

  return { items, cleanItems, cleaning, totalSize };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
