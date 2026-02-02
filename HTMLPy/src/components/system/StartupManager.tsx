import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useStartupApps } from '@/hooks/useSystemData';

interface StartupEvent {
  id: string;
  triggerApp: string;
  launchApp: string;
  delay: number;
}

export function StartupManager() {
  const { apps, toggleApp } = useStartupApps();
  const [events, setEvents] = useState<StartupEvent[]>([
    { id: '1', triggerApp: 'CyberSys Monitor', launchApp: 'Discord', delay: 5 }
  ]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ triggerApp: '', launchApp: '', delay: 0 });

  const addEvent = () => {
    if (newEvent.triggerApp && newEvent.launchApp) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
      setNewEvent({ triggerApp: '', launchApp: '', delay: 0 });
      setShowEventForm(false);
    }
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-[#f7768e] bg-[#f7768e]/20';
      case 'medium': return 'text-[#e0af68] bg-[#e0af68]/20';
      default: return 'text-[#9ece6a] bg-[#9ece6a]/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#cdd6f4]">Startup Manager</h2>
        <p className="text-[#6c7086] mt-1">Manage applications that start with Windows</p>
      </div>

      {/* Startup Apps */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#313244] bg-[#181825]">
          <h3 className="font-semibold text-[#cdd6f4] flex items-center gap-2">
            <Play className="w-4 h-4 text-[#7aa2f7]" />
            Startup Applications
          </h3>
        </div>
        <div className="divide-y divide-[#313244]">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-5 py-4 flex items-center justify-between hover:bg-[#313244]/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#cdd6f4]">{app.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getImpactColor(app.impact)}`}>
                    {app.impact} impact
                  </span>
                </div>
                <p className="text-sm text-[#6c7086] mt-1 truncate">{app.path}</p>
              </div>
              <motion.button
                onClick={() => toggleApp(app.id)}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-7 rounded-full p-1 transition-colors ${
                  app.enabled ? 'bg-[#7aa2f7]' : 'bg-[#313244]'
                }`}
              >
                <motion.div
                  animate={{ x: app.enabled ? 26 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md"
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Startup Events */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#313244] bg-[#181825] flex items-center justify-between">
          <h3 className="font-semibold text-[#cdd6f4] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#e0af68]" />
            Startup Events
          </h3>
          <motion.button
            onClick={() => setShowEventForm(!showEventForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#7aa2f7] text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Event
            {showEventForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* New Event Form */}
        {showEventForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 py-4 border-b border-[#313244] bg-[#181825]/50"
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[#6c7086] mb-2">When this app starts</label>
                <input
                  type="text"
                  value={newEvent.triggerApp}
                  onChange={(e) => setNewEvent({ ...newEvent, triggerApp: e.target.value })}
                  placeholder="e.g., CyberSys Monitor"
                  className="w-full px-3 py-2 bg-[#252535] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#7aa2f7]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6c7086] mb-2">Launch this app</label>
                <input
                  type="text"
                  value={newEvent.launchApp}
                  onChange={(e) => setNewEvent({ ...newEvent, launchApp: e.target.value })}
                  placeholder="e.g., Discord"
                  className="w-full px-3 py-2 bg-[#252535] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#7aa2f7]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6c7086] mb-2">Delay (seconds)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newEvent.delay}
                    onChange={(e) => setNewEvent({ ...newEvent, delay: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="flex-1 px-3 py-2 bg-[#252535] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#7aa2f7]"
                  />
                  <button
                    onClick={addEvent}
                    className="px-4 py-2 bg-[#9ece6a] text-[#1E1E2E] rounded-lg font-medium hover:bg-[#9ece6a]/80 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Event List */}
        <div className="divide-y divide-[#313244]">
          {events.length === 0 ? (
            <div className="px-5 py-8 text-center text-[#6c7086]">
              No startup events configured
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-[#313244]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#cdd6f4]">
                    <span className="font-medium">When </span>
                    <span className="text-[#7aa2f7] font-semibold">{event.triggerApp}</span>
                    <span className="font-medium"> starts → Launch </span>
                    <span className="text-[#9ece6a] font-semibold">{event.launchApp}</span>
                    {event.delay > 0 && (
                      <span className="text-[#6c7086]"> (after {event.delay}s delay)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="p-2 text-[#f7768e] hover:bg-[#f7768e]/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
