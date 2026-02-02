import { motion } from 'framer-motion';
import { Cpu, MonitorPlay, MemoryStick, CircuitBoard, Monitor, Clock, HardDrive, Timer } from 'lucide-react';
import { useSystemSpecs } from '@/hooks/useSystemData';

const specItems = [
  { key: 'cpu', label: 'Processor', icon: Cpu, tooltip: 'Central Processing Unit - The brain of your computer' },
  { key: 'gpu', label: 'Graphics Card', icon: MonitorPlay, tooltip: 'Graphics Processing Unit - Handles visual rendering' },
  { key: 'ram', label: 'Memory', icon: MemoryStick, tooltip: 'Random Access Memory - Temporary fast storage for running programs' },
  { key: 'motherboard', label: 'Motherboard', icon: CircuitBoard, tooltip: 'Main circuit board connecting all components' },
  { key: 'os', label: 'Operating System', icon: Monitor, tooltip: 'The software that manages your computer' },
];

export function SystemInfo() {
  const { specs, appUptime } = useSystemSpecs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">System Information</h2>
          <p className="text-[#6c7086] mt-1">Comprehensive hardware specifications</p>
        </div>
      </div>

      {/* Spec Cards */}
      <div className="grid gap-4">
        {specItems.map((item, index) => {
          const Icon = item.icon;
          const value = specs[item.key as keyof typeof specs];
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244] hover:border-[#7aa2f7]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#7aa2f7]/10 text-[#7aa2f7] group-hover:bg-[#7aa2f7]/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6c7086] font-medium">{item.label}</span>
                    <div className="relative group/tooltip">
                      <div className="w-4 h-4 rounded-full bg-[#313244] text-[#6c7086] text-xs flex items-center justify-center cursor-help">?</div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-xs text-[#cdd6f4] w-48 text-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.tooltip}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#cdd6f4] font-semibold mt-1 truncate">{value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Uptime Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#7aa2f7]/20 to-[#7aa2f7]/5 rounded-xl p-5 border border-[#7aa2f7]/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-[#7aa2f7]" />
            <span className="text-sm text-[#6c7086]">System Uptime</span>
          </div>
          <p className="text-2xl font-bold text-[#7aa2f7]">{specs.uptime}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-[#9ece6a]/20 to-[#9ece6a]/5 rounded-xl p-5 border border-[#9ece6a]/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-[#9ece6a]" />
            <span className="text-sm text-[#6c7086]">HDD Power-On Hours</span>
          </div>
          <p className="text-2xl font-bold text-[#9ece6a]">{specs.powerOnHours.toLocaleString()}h</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-[#bb9af7]/20 to-[#bb9af7]/5 rounded-xl p-5 border border-[#bb9af7]/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Timer className="w-5 h-5 text-[#bb9af7]" />
            <span className="text-sm text-[#6c7086]">App Timer</span>
          </div>
          <p className="text-2xl font-bold text-[#bb9af7]">{appUptime}</p>
        </motion.div>
      </div>
    </div>
  );
}
