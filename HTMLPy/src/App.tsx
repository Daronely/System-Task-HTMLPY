import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Gamepad2, Cpu, Wrench, Settings, X, Minus, Square,
  ChevronRight
} from 'lucide-react';
import { SystemTab } from './components/SystemTab';
import { SettingsPanel } from './components/SettingsPanel';

const tabs = [
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'game', label: 'Game', icon: Gamepad2 },
  { id: 'electronic', label: 'Electronic', icon: Cpu },
  { id: 'tools', label: 'More Tools', icon: Wrench },
];

export function App() {
  const [activeTab, setActiveTab] = useState('system');
  const [showSettings, setShowSettings] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-[#c0caf5] overflow-hidden">
      {/* Custom Title Bar */}
      <div className="h-10 bg-[#181825] flex items-center justify-between px-4 select-none border-b border-[#313244]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7aa2f7] to-[#bb9af7] flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[#cdd6f4]">CyberSys Monitor</span>
          <span className="text-xs text-[#6c7086]">v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6c7086] mr-4">
            {time.toLocaleTimeString()}
          </span>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#313244] rounded transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#313244] rounded transition-colors">
            <Square className="w-3 h-3" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f7768e] rounded transition-colors group">
            <X className="w-4 h-4 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-40px)]">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-[#181825]/80 backdrop-blur-xl border-r border-[#313244] flex flex-col"
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-[#313244]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7aa2f7] via-[#bb9af7] to-[#f7768e] p-[2px]">
                <div className="w-full h-full rounded-xl bg-[#1E1E2E] flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-[#7aa2f7]" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg text-[#cdd6f4]">CyberSys</h1>
                <p className="text-xs text-[#6c7086]">Control Center</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' 
                      : 'hover:bg-[#252535] text-[#6c7086] hover:text-[#cdd6f4]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#7aa2f7] rounded-r"
                    />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#7aa2f7]' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Settings Button */}
          <div className="p-4 border-t border-[#313244]">
            <motion.button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#252535] hover:bg-[#313244] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5 text-[#6c7086]" />
              <span className="font-medium text-[#6c7086]">Settings</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <SystemTab />
              </motion.div>
            )}
            {activeTab === 'game' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <PlaceholderTab icon={Gamepad2} title="Game Optimizer" description="Game performance tools coming soon..." />
              </motion.div>
            )}
            {activeTab === 'electronic' && (
              <motion.div
                key="electronic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <PlaceholderTab icon={Cpu} title="Electronic Hub" description="Hardware management coming soon..." />
              </motion.div>
            )}
            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <PlaceholderTab icon={Wrench} title="More Tools" description="Additional utilities coming soon..." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderTab({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#7aa2f7]/20 to-[#bb9af7]/20 flex items-center justify-center border border-[#313244]"
      >
        <Icon className="w-12 h-12 text-[#7aa2f7]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-[#cdd6f4] mb-2">{title}</h2>
      <p className="text-[#6c7086]">{description}</p>
    </div>
  );
}
