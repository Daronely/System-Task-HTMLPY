import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, ListTodo, Play, Activity, Heart, Trash2, FileText, Shield
} from 'lucide-react';
import { SystemInfo } from './system/SystemInfo';
import { TaskManager } from './system/TaskManager';
import { StartupManager } from './system/StartupManager';
import { ProcessMonitor } from './system/ProcessMonitor';
import { StatusHealth } from './system/StatusHealth';
import { TempCleaner } from './system/TempCleaner';
import { EventViewer } from './system/EventViewer';
import { SecurityOverview } from './system/SecurityOverview';

const systemModules = [
  { id: 'info', label: 'System Info', icon: Info },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'startup', label: 'Startup', icon: Play },
  { id: 'monitor', label: 'Monitor', icon: Activity },
  { id: 'status', label: 'Status', icon: Heart },
  { id: 'cleaner', label: 'Cleaner', icon: Trash2 },
  { id: 'events', label: 'Events', icon: FileText },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SystemTab() {
  const [activeModule, setActiveModule] = useState('info');

  const renderContent = () => {
    switch (activeModule) {
      case 'info': return <SystemInfo />;
      case 'tasks': return <TaskManager />;
      case 'startup': return <StartupManager />;
      case 'monitor': return <ProcessMonitor />;
      case 'status': return <StatusHealth />;
      case 'cleaner': return <TempCleaner />;
      case 'events': return <EventViewer />;
      case 'security': return <SecurityOverview />;
      default: return <SystemInfo />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sub Navigation */}
      <div className="bg-[#181825]/50 backdrop-blur-sm border-b border-[#313244] px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {systemModules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <motion.button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-[#7aa2f7] text-white shadow-lg shadow-[#7aa2f7]/30'
                    : 'bg-[#252535] text-[#6c7086] hover:bg-[#313244] hover:text-[#cdd6f4]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{module.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
