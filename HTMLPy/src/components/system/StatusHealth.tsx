import { motion } from 'framer-motion';
import { Heart, Cpu, MemoryStick, HardDrive, Thermometer, Wifi, Shield, Clock, Activity } from 'lucide-react';
import { useSystemMetrics } from '@/hooks/useSystemData';

interface HealthIndicator {
  id: string;
  label: string;
  icon: React.ElementType;
  getValue: (metrics: ReturnType<typeof useSystemMetrics>['metrics']) => number;
  getStatus: (value: number) => 'good' | 'warning' | 'critical';
  unit: string;
  description: string;
}

const healthIndicators: HealthIndicator[] = [
  {
    id: 'cpu',
    label: 'CPU Load',
    icon: Cpu,
    getValue: (m) => m.cpu,
    getStatus: (v) => v > 90 ? 'critical' : v > 70 ? 'warning' : 'good',
    unit: '%',
    description: 'Current processor utilization'
  },
  {
    id: 'ram',
    label: 'Memory Usage',
    icon: MemoryStick,
    getValue: (m) => m.ram,
    getStatus: (v) => v > 90 ? 'critical' : v > 75 ? 'warning' : 'good',
    unit: '%',
    description: 'RAM consumption'
  },
  {
    id: 'disk',
    label: 'Disk Activity',
    icon: HardDrive,
    getValue: (m) => m.disk,
    getStatus: (v) => v > 95 ? 'critical' : v > 80 ? 'warning' : 'good',
    unit: '%',
    description: 'Storage I/O activity'
  },
  {
    id: 'temp',
    label: 'Temperature',
    icon: Thermometer,
    getValue: (m) => m.temperature,
    getStatus: (v) => v > 85 ? 'critical' : v > 70 ? 'warning' : 'good',
    unit: '°C',
    description: 'System temperature'
  },
  {
    id: 'network',
    label: 'Network',
    icon: Wifi,
    getValue: () => 85,
    getStatus: () => 'good',
    unit: '%',
    description: 'Network connectivity status'
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    getValue: () => 100,
    getStatus: () => 'good',
    unit: '%',
    description: 'Security status'
  },
];

const statusColors = {
  good: { bg: 'bg-[#9ece6a]', text: 'text-[#9ece6a]', bgLight: 'bg-[#9ece6a]/20', border: 'border-[#9ece6a]/30' },
  warning: { bg: 'bg-[#e0af68]', text: 'text-[#e0af68]', bgLight: 'bg-[#e0af68]/20', border: 'border-[#e0af68]/30' },
  critical: { bg: 'bg-[#f7768e]', text: 'text-[#f7768e]', bgLight: 'bg-[#f7768e]/20', border: 'border-[#f7768e]/30' },
};

export function StatusHealth() {
  const { metrics } = useSystemMetrics();

  const overallHealth = healthIndicators.reduce((acc, ind) => {
    const status = ind.getStatus(ind.getValue(metrics));
    if (status === 'critical') return 'critical';
    if (status === 'warning' && acc !== 'critical') return 'warning';
    return acc;
  }, 'good' as 'good' | 'warning' | 'critical');

  const getOverallMessage = () => {
    switch (overallHealth) {
      case 'critical':
        return { text: 'System needs attention!', color: 'text-[#f7768e]' };
      case 'warning':
        return { text: 'Some metrics elevated', color: 'text-[#e0af68]' };
      default:
        return { text: 'All systems healthy', color: 'text-[#9ece6a]' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">System Health</h2>
          <p className="text-[#6c7086] mt-1">At-a-glance system status</p>
        </div>
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-2xl p-8 ${statusColors[overallHealth].bgLight} border ${statusColors[overallHealth].border}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: overallHealth === 'good' ? '#9ece6a' : overallHealth === 'warning' ? '#e0af68' : '#f7768e' }} />
        <div className="relative flex items-center gap-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`p-4 rounded-2xl ${statusColors[overallHealth].bgLight}`}
          >
            <Heart className={`w-12 h-12 ${statusColors[overallHealth].text}`} />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-[#cdd6f4]">System Status</h3>
            <p className={`text-xl font-semibold mt-1 ${getOverallMessage().color}`}>
              {getOverallMessage().text}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Activity className={`w-6 h-6 ${statusColors[overallHealth].text}`} />
            <span className="text-2xl font-bold text-[#cdd6f4]">
              {overallHealth === 'good' ? '100' : overallHealth === 'warning' ? '75' : '50'}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Health Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {healthIndicators.map((indicator, index) => {
          const value = indicator.getValue(metrics);
          const status = indicator.getStatus(value);
          const Icon = indicator.icon;
          const colors = statusColors[status];

          return (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border ${colors.border} hover:border-opacity-100 transition-all duration-300 group`}
            >
              {/* Status Light */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute top-4 right-4 w-3 h-3 rounded-full ${colors.bg}`}
              />

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${colors.bgLight}`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-[#6c7086] block">{indicator.label}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-bold ${colors.text}`}>{value.toFixed(0)}</span>
                    <span className="text-[#6c7086] text-sm">{indicator.unit}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 bg-[#313244] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${colors.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(value, 100)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-xs text-[#cdd6f4] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {indicator.description}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#7aa2f7]" />
            <span className="font-semibold text-[#cdd6f4]">Uptime Analysis</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">System stable for</span>
              <span className="text-[#9ece6a] font-semibold">4 days, 12 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">Last restart</span>
              <span className="text-[#cdd6f4]">Dec 10, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">Crashes (30 days)</span>
              <span className="text-[#9ece6a] font-semibold">0</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#9ece6a]" />
            <span className="font-semibold text-[#cdd6f4]">Security Status</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">Windows Defender</span>
              <span className="text-[#9ece6a] font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">Firewall</span>
              <span className="text-[#9ece6a] font-semibold">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6c7086]">Last scan</span>
              <span className="text-[#cdd6f4]">2 hours ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
