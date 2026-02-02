import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Wifi, Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useSystemMetrics } from '@/hooks/useSystemData';

export function ProcessMonitor() {
  const { metrics, history } = useSystemMetrics();

  const chartData = history.map((m, i) => ({
    time: i,
    cpu: m.cpu,
    ram: m.ram,
    disk: m.disk,
  }));

  const MetricCard = ({ 
    label, 
    value, 
    unit, 
    icon: Icon, 
    color, 
    bgColor 
  }: { 
    label: string; 
    value: number; 
    unit: string; 
    icon: React.ElementType; 
    color: string; 
    bgColor: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${bgColor} rounded-xl p-5 border border-[${color}]/30`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-[${color}]/20`}>
            <Icon className={`w-5 h-5`} style={{ color }} />
          </div>
          <span className="font-medium text-[#cdd6f4]">{label}</span>
        </div>
        <span className="text-2xl font-bold" style={{ color }}>{value.toFixed(1)}{unit}</span>
      </div>
      <div className="h-2 bg-[#313244] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#cdd6f4]">Process Monitor</h2>
        <p className="text-[#6c7086] mt-1">Real-time system performance metrics</p>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          label="CPU" 
          value={metrics.cpu} 
          unit="%" 
          icon={Cpu} 
          color="#7aa2f7" 
          bgColor="bg-[#7aa2f7]/10" 
        />
        <MetricCard 
          label="RAM" 
          value={metrics.ram} 
          unit="%" 
          icon={MemoryStick} 
          color="#bb9af7" 
          bgColor="bg-[#bb9af7]/10" 
        />
        <MetricCard 
          label="Disk" 
          value={metrics.disk} 
          unit="%" 
          icon={HardDrive} 
          color="#9ece6a" 
          bgColor="bg-[#9ece6a]/10" 
        />
        <MetricCard 
          label="Network" 
          value={metrics.network} 
          unit=" KB/s" 
          icon={Wifi} 
          color="#e0af68" 
          bgColor="bg-[#e0af68]/10" 
        />
        <MetricCard 
          label="Temp" 
          value={metrics.temperature} 
          unit="°C" 
          icon={Thermometer} 
          color="#f7768e" 
          bgColor="bg-[#f7768e]/10" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CPU Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-[#7aa2f7]" />
            <span className="font-semibold text-[#cdd6f4]">CPU Usage History</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7aa2f7" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7aa2f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2">
                          <span className="text-[#7aa2f7] font-semibold">{payload[0].value?.toString().slice(0, 5)}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#7aa2f7"
                  strokeWidth={2}
                  fill="url(#cpuGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RAM Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <div className="flex items-center gap-2 mb-4">
            <MemoryStick className="w-5 h-5 text-[#bb9af7]" />
            <span className="font-semibold text-[#cdd6f4]">RAM Usage History</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bb9af7" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#bb9af7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2">
                          <span className="text-[#bb9af7] font-semibold">{payload[0].value?.toString().slice(0, 5)}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ram"
                  stroke="#bb9af7"
                  strokeWidth={2}
                  fill="url(#ramGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Disk Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-[#9ece6a]" />
            <span className="font-semibold text-[#cdd6f4]">Disk Activity History</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9ece6a" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#9ece6a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2">
                          <span className="text-[#9ece6a] font-semibold">{payload[0].value?.toString().slice(0, 5)}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="disk"
                  stroke="#9ece6a"
                  strokeWidth={2}
                  fill="url(#diskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Combined Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
      >
        <h3 className="font-semibold text-[#cdd6f4] mb-4">Combined Performance Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7aa2f7" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7aa2f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bb9af7" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#bb9af7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="diskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ece6a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#9ece6a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#181825] border border-[#313244] rounded-lg px-4 py-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#7aa2f7]" />
                          <span className="text-[#cdd6f4]">CPU: {Number(payload[0].value).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#bb9af7]" />
                          <span className="text-[#cdd6f4]">RAM: {Number(payload[1].value).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#9ece6a]" />
                          <span className="text-[#cdd6f4]">Disk: {Number(payload[2].value).toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#7aa2f7" strokeWidth={2} fill="url(#cpuGrad)" />
              <Area type="monotone" dataKey="ram" stroke="#bb9af7" strokeWidth={2} fill="url(#ramGrad)" />
              <Area type="monotone" dataKey="disk" stroke="#9ece6a" strokeWidth={2} fill="url(#diskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#7aa2f7]" />
            <span className="text-sm text-[#6c7086]">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#bb9af7]" />
            <span className="text-sm text-[#6c7086]">RAM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#9ece6a]" />
            <span className="text-sm text-[#6c7086]">Disk</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
