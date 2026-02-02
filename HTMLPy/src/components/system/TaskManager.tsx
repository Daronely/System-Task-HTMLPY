import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpDown, Skull } from 'lucide-react';
import { useProcesses, formatBytes } from '@/hooks/useSystemData';

type SortField = 'name' | 'pid' | 'cpu' | 'memory';
type SortDir = 'asc' | 'desc';

export function TaskManager() {
  const { processes, killProcess } = useProcesses();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('cpu');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [killingPid, setKillingPid] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleKill = async (pid: number) => {
    setKillingPid(pid);
    await new Promise(resolve => setTimeout(resolve, 500));
    killProcess(pid);
    setKillingPid(null);
  };

  const filteredProcesses = processes
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">Task Manager</h2>
          <p className="text-[#6c7086] mt-1">{processes.length} processes running</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c7086]" />
          <input
            type="text"
            placeholder="Search processes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#252535] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#7aa2f7] transition-colors w-64"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-[#cdd6f4]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#181825] border-b border-[#313244] text-sm font-medium text-[#6c7086]">
          <button
            onClick={() => handleSort('name')}
            className="col-span-4 flex items-center gap-2 hover:text-[#cdd6f4] transition-colors text-left"
          >
            Process Name
            {sortField === 'name' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => handleSort('pid')}
            className="col-span-2 flex items-center gap-2 hover:text-[#cdd6f4] transition-colors"
          >
            PID
            {sortField === 'pid' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => handleSort('cpu')}
            className="col-span-2 flex items-center gap-2 hover:text-[#cdd6f4] transition-colors"
          >
            CPU %
            {sortField === 'cpu' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => handleSort('memory')}
            className="col-span-2 flex items-center gap-2 hover:text-[#cdd6f4] transition-colors"
          >
            Memory
            {sortField === 'memory' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Process Rows */}
        <div className="max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {filteredProcesses.map((process) => (
              <motion.div
                key={process.pid}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, backgroundColor: '#f7768e20' }}
                className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#313244] last:border-b-0 hover:bg-[#313244]/50 transition-colors items-center"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${process.status === 'running' ? 'bg-[#9ece6a]' : 'bg-[#6c7086]'}`} />
                  <span className="text-[#cdd6f4] font-medium truncate">{process.name}</span>
                  {process.isAdmin && (
                    <span className="px-1.5 py-0.5 text-xs bg-[#f7768e]/20 text-[#f7768e] rounded">Admin</span>
                  )}
                </div>
                <div className="col-span-2 text-[#6c7086] font-mono text-sm">{process.pid}</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#313244] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          process.cpu > 80 ? 'bg-[#f7768e]' : process.cpu > 50 ? 'bg-[#e0af68]' : 'bg-[#9ece6a]'
                        }`}
                        style={{ width: `${Math.min(process.cpu, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#cdd6f4] w-12 text-right">{process.cpu.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="col-span-2 text-[#cdd6f4] text-sm">{formatBytes(process.memory * 1024 * 1024)}</div>
                <div className="col-span-2 text-right">
                  <motion.button
                    onClick={() => handleKill(process.pid)}
                    disabled={killingPid === process.pid}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg transition-colors ${
                      killingPid === process.pid
                        ? 'bg-[#f7768e] text-white'
                        : 'bg-[#f7768e]/20 text-[#f7768e] hover:bg-[#f7768e]/30'
                    }`}
                  >
                    <Skull className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
