import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Eye, AlertTriangle, Lock, Unlock, UserCheck } from 'lucide-react';
import { useProcesses } from '@/hooks/useSystemData';

export function SecurityOverview() {
  const { processes } = useProcesses();

  const adminProcesses = processes.filter(p => p.isAdmin);
  const unsignedProcesses = processes.filter(p => !p.isSigned);
  const suspiciousProcesses = processes.filter(p => p.isAdmin && !p.isSigned);

  const SecurityCard = ({ 
    title, 
    value, 
    status, 
    icon: Icon,
    description 
  }: { 
    title: string; 
    value: number | string; 
    status: 'good' | 'warning' | 'alert';
    icon: React.ElementType;
    description: string;
  }) => {
    const colors = {
      good: { bg: 'bg-[#9ece6a]/20', text: 'text-[#9ece6a]', border: 'border-[#9ece6a]/30' },
      warning: { bg: 'bg-[#e0af68]/20', text: 'text-[#e0af68]', border: 'border-[#e0af68]/30' },
      alert: { bg: 'bg-[#f7768e]/20', text: 'text-[#f7768e]', border: 'border-[#f7768e]/30' },
    };
    const c = colors[status];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-xl ${c.bg} border ${c.border}`}
      >
        <div className="flex items-center justify-between mb-3">
          <Icon className={`w-6 h-6 ${c.text}`} />
          <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        </div>
        <h4 className="font-semibold text-[#cdd6f4]">{title}</h4>
        <p className="text-sm text-[#6c7086] mt-1">{description}</p>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">Security Overview</h2>
          <p className="text-[#6c7086] mt-1">Monitor processes with elevated privileges</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#9ece6a]/20 border border-[#9ece6a]/30 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-[#9ece6a]" />
          <span className="text-[#9ece6a] font-medium">Monitoring Active</span>
        </div>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-[#7aa2f7]/10 border border-[#7aa2f7]/30 rounded-xl"
      >
        <Eye className="w-5 h-5 text-[#7aa2f7] flex-shrink-0" />
        <p className="text-sm text-[#7aa2f7]">
          <span className="font-semibold">Monitor & Warn Mode:</span> This tool observes and reports. It does not auto-block to prevent breaking system functionality.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <SecurityCard
          title="Admin Processes"
          value={adminProcesses.length}
          status={adminProcesses.length > 5 ? 'warning' : 'good'}
          icon={Lock}
          description="Processes running with elevated privileges"
        />
        <SecurityCard
          title="Unsigned Processes"
          value={unsignedProcesses.length}
          status={unsignedProcesses.length > 3 ? 'warning' : 'good'}
          icon={Unlock}
          description="Processes without verified signatures"
        />
        <SecurityCard
          title="Suspicious"
          value={suspiciousProcesses.length}
          status={suspiciousProcesses.length > 0 ? 'alert' : 'good'}
          icon={ShieldAlert}
          description="Admin + Unsigned = Potential risk"
        />
      </div>

      {/* Admin Processes List */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#313244] bg-[#181825] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#7aa2f7]" />
            <span className="font-semibold text-[#cdd6f4]">Elevated Privilege Processes</span>
          </div>
          <span className="text-sm text-[#6c7086]">{adminProcesses.length} processes</span>
        </div>

        <div className="divide-y divide-[#313244] max-h-[300px] overflow-y-auto">
          {adminProcesses.map((process, index) => (
            <motion.div
              key={process.pid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-5 py-4 flex items-center justify-between hover:bg-[#313244]/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${process.isSigned ? 'bg-[#9ece6a]/20' : 'bg-[#f7768e]/20'}`}>
                  {process.isSigned ? (
                    <UserCheck className="w-4 h-4 text-[#9ece6a]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#f7768e]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#cdd6f4]">{process.name}</span>
                    <span className="px-1.5 py-0.5 text-xs bg-[#f7768e]/20 text-[#f7768e] rounded">Admin</span>
                    {!process.isSigned && (
                      <span className="px-1.5 py-0.5 text-xs bg-[#e0af68]/20 text-[#e0af68] rounded">Unsigned</span>
                    )}
                  </div>
                  <span className="text-sm text-[#6c7086]">PID: {process.pid} • User: {process.user}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${process.isSigned ? 'text-[#9ece6a]' : 'text-[#e0af68]'}`}>
                  {process.isSigned ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suspicious Processes */}
      {suspiciousProcesses.length > 0 && (
        <div className="bg-[#f7768e]/10 backdrop-blur-sm rounded-xl border border-[#f7768e]/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f7768e]/20 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#f7768e]" />
            <span className="font-semibold text-[#f7768e]">Potentially Suspicious Processes</span>
          </div>

          <div className="p-5">
            <p className="text-sm text-[#6c7086] mb-4">
              These processes have administrator privileges but are not digitally signed. 
              While this doesn't always indicate malware, it warrants attention.
            </p>
            <div className="space-y-3">
              {suspiciousProcesses.map((process) => (
                <div
                  key={process.pid}
                  className="flex items-center justify-between p-3 bg-[#1E1E2E] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#f7768e]" />
                    <span className="font-medium text-[#cdd6f4]">{process.name}</span>
                  </div>
                  <span className="text-sm text-[#6c7086]">PID: {process.pid}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tips */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <h4 className="font-semibold text-[#cdd6f4] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#9ece6a]" />
            What's Safe
          </h4>
          <ul className="space-y-2 text-sm text-[#6c7086]">
            <li className="flex items-start gap-2">
              <span className="text-[#9ece6a]">✓</span>
              <span>Windows system processes (svchost, csrss, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#9ece6a]">✓</span>
              <span>Signed driver hosts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#9ece6a]">✓</span>
              <span>Known applications with admin installers</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#252535]/80 backdrop-blur-sm rounded-xl p-5 border border-[#313244]"
        >
          <h4 className="font-semibold text-[#cdd6f4] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#e0af68]" />
            What to Watch
          </h4>
          <ul className="space-y-2 text-sm text-[#6c7086]">
            <li className="flex items-start gap-2">
              <span className="text-[#e0af68]">!</span>
              <span>Unknown processes with admin rights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#e0af68]">!</span>
              <span>Unsigned executables from temp folders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#e0af68]">!</span>
              <span>Processes with suspicious names</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
