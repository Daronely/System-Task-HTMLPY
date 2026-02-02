import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, AlertTriangle, Info, XCircle, Filter, Clock, Search } from 'lucide-react';
import { useEventLogs } from '@/hooks/useSystemData';

type FilterType = 'all' | 'error' | 'warning' | 'info' | 'critical';

export function EventViewer() {
  const { logs } = useEventLogs();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs
    .filter(log => filter === 'all' || log.type === filter)
    .filter(log => 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase())
    );

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return { 
          icon: XCircle, 
          color: 'text-[#f7768e]', 
          bg: 'bg-[#f7768e]/20', 
          border: 'border-[#f7768e]/30',
          label: 'Critical'
        };
      case 'error':
        return { 
          icon: AlertCircle, 
          color: 'text-[#ff9e64]', 
          bg: 'bg-[#ff9e64]/20', 
          border: 'border-[#ff9e64]/30',
          label: 'Error'
        };
      case 'warning':
        return { 
          icon: AlertTriangle, 
          color: 'text-[#e0af68]', 
          bg: 'bg-[#e0af68]/20', 
          border: 'border-[#e0af68]/30',
          label: 'Warning'
        };
      default:
        return { 
          icon: Info, 
          color: 'text-[#7aa2f7]', 
          bg: 'bg-[#7aa2f7]/20', 
          border: 'border-[#7aa2f7]/30',
          label: 'Info'
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const stats = {
    critical: logs.filter(l => l.type === 'critical').length,
    error: logs.filter(l => l.type === 'error').length,
    warning: logs.filter(l => l.type === 'warning').length,
    info: logs.filter(l => l.type === 'info').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">Event Log Viewer</h2>
          <p className="text-[#6c7086] mt-1">Simplified Windows event logs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { type: 'critical', count: stats.critical },
          { type: 'error', count: stats.error },
          { type: 'warning', count: stats.warning },
          { type: 'info', count: stats.info },
        ].map((stat, index) => {
          const config = getTypeConfig(stat.type);
          return (
            <motion.button
              key={stat.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setFilter(stat.type as FilterType)}
              className={`p-4 rounded-xl border transition-all ${
                filter === stat.type 
                  ? `${config.bg} ${config.border}` 
                  : 'bg-[#252535]/80 border-[#313244] hover:border-[#6c7086]'
              }`}
            >
              <div className="flex items-center justify-between">
                <config.icon className={`w-5 h-5 ${config.color}`} />
                <span className={`text-2xl font-bold ${config.color}`}>{stat.count}</span>
              </div>
              <span className="text-sm text-[#6c7086] mt-2 block text-left">{config.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c7086]" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#252535] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#7aa2f7]"
          />
        </div>
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-[#7aa2f7] text-white' 
              : 'bg-[#252535] text-[#6c7086] hover:text-[#cdd6f4]'
          }`}
        >
          <Filter className="w-4 h-4" />
          All Events
        </button>
      </div>

      {/* Event List */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#313244] bg-[#181825] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#7aa2f7]" />
          <span className="font-semibold text-[#cdd6f4]">
            Recent Events ({filteredLogs.length})
          </span>
        </div>

        <div className="divide-y divide-[#313244] max-h-[500px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="px-5 py-12 text-center text-[#6c7086]">
              No events found matching your criteria
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const config = getTypeConfig(log.type);
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-5 py-4 hover:bg-[#313244]/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-sm font-medium text-[#7aa2f7]">{log.source}</span>
                      </div>
                      <p className="text-[#cdd6f4] mb-2">{log.message}</p>
                      <div className="flex items-center gap-2 text-xs text-[#6c7086]">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(log.timestamp)}</span>
                        <span className="text-[#313244]">•</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 py-4">
        {['critical', 'error', 'warning', 'info'].map((type) => {
          const config = getTypeConfig(type);
          return (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.bg}`} style={{ borderWidth: 2, borderColor: config.color.replace('text-', '') }} />
              <span className="text-sm text-[#6c7086]">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
