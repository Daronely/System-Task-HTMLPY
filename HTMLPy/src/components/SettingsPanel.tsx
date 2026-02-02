import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Power, Monitor, Bell, Palette, Info, ExternalLink, Check } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [startWithSystem, setStartWithSystem] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'cyberpunk' | 'midnight'>('cyberpunk');

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <motion.button
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${
        checked ? 'bg-[#7aa2f7]' : 'bg-[#313244]'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow-md"
      />
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1E1E2E] border border-[#313244] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#313244] bg-[#181825]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#7aa2f7]/20">
              <Settings className="w-5 h-5 text-[#7aa2f7]" />
            </div>
            <h2 className="text-xl font-bold text-[#cdd6f4]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#313244] transition-colors"
          >
            <X className="w-5 h-5 text-[#6c7086]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Startup Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#6c7086] uppercase tracking-wider">Startup</h3>
            
            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Power className="w-5 h-5 text-[#9ece6a]" />
                  <div>
                    <span className="font-medium text-[#cdd6f4]">Start with Windows</span>
                    <p className="text-xs text-[#6c7086] mt-0.5">Launch CyberSys Monitor when you log in</p>
                  </div>
                </div>
                <Toggle checked={startWithSystem} onChange={() => setStartWithSystem(!startWithSystem)} />
              </div>
              {startWithSystem && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-[#313244]"
                >
                  <div className="flex items-center gap-2 text-sm text-[#9ece6a]">
                    <Check className="w-4 h-4" />
                    <span>Will be added to Windows Registry Run key</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-[#7aa2f7]" />
                  <div>
                    <span className="font-medium text-[#cdd6f4]">Minimize to System Tray</span>
                    <p className="text-xs text-[#6c7086] mt-0.5">Keep running in background when closed</p>
                  </div>
                </div>
                <Toggle checked={minimizeToTray} onChange={() => setMinimizeToTray(!minimizeToTray)} />
              </div>
            </div>
          </div>

          {/* Behavior Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#6c7086] uppercase tracking-wider">Behavior</h3>

            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#e0af68]" />
                  <div>
                    <span className="font-medium text-[#cdd6f4]">Show Notifications</span>
                    <p className="text-xs text-[#6c7086] mt-0.5">Alert when system resources are high</p>
                  </div>
                </div>
                <Toggle checked={showNotifications} onChange={() => setShowNotifications(!showNotifications)} />
              </div>
            </div>

            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-[#bb9af7]" />
                  <div>
                    <span className="font-medium text-[#cdd6f4]">Auto Refresh Data</span>
                    <p className="text-xs text-[#6c7086] mt-0.5">Automatically update system metrics</p>
                  </div>
                </div>
                <Toggle checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#6c7086] uppercase tracking-wider">Appearance</h3>

            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-[#f7768e]" />
                <span className="font-medium text-[#cdd6f4]">Theme</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark', colors: ['#1E1E2E', '#313244', '#7aa2f7'] },
                  { id: 'cyberpunk', label: 'Cyberpunk', colors: ['#1E1E2E', '#7aa2f7', '#f7768e'] },
                  { id: 'midnight', label: 'Midnight', colors: ['#0d1117', '#161b22', '#58a6ff'] },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as typeof theme)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      theme === t.id 
                        ? 'border-[#7aa2f7] bg-[#7aa2f7]/10' 
                        : 'border-[#313244] hover:border-[#6c7086]'
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {t.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-sm text-[#cdd6f4]">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#6c7086] uppercase tracking-wider">About</h3>

            <div className="bg-[#252535] rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7aa2f7] via-[#bb9af7] to-[#f7768e] p-[2px]">
                  <div className="w-full h-full rounded-xl bg-[#1E1E2E] flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-[#7aa2f7]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[#cdd6f4]">CyberSys Monitor</h4>
                  <p className="text-sm text-[#6c7086]">Version 1.0.0</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#313244] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6c7086]">
                  <Info className="w-4 h-4" />
                  <span>Built with React & Tailwind CSS</span>
                </div>
                <button className="flex items-center gap-1 text-sm text-[#7aa2f7] hover:text-[#7aa2f7]/80 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Docs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#313244] bg-[#181825] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#313244] text-[#cdd6f4] hover:bg-[#313244]/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#7aa2f7] text-white hover:bg-[#7aa2f7]/80 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
