import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, FolderOpen, Check, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { useCacheItems, formatBytes } from '@/hooks/useSystemData';

export function TempCleaner() {
  const { items, cleanItems, cleaning, totalSize } = useCacheItems();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [cleanComplete, setCleanComplete] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.id));
    }
  };

  const handleClean = async () => {
    if (selectedItems.length === 0) return;
    setShowPreview(false);
    await cleanItems(selectedItems);
    setSelectedItems([]);
    setCleanComplete(true);
    setTimeout(() => setCleanComplete(false), 3000);
  };

  const selectedSize = items
    .filter(i => selectedItems.includes(i.id))
    .reduce((acc, i) => acc + i.size, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'temp':
        return <div className="w-8 h-8 rounded-lg bg-[#f7768e]/20 flex items-center justify-center"><FolderOpen className="w-4 h-4 text-[#f7768e]" /></div>;
      case 'browser':
        return <div className="w-8 h-8 rounded-lg bg-[#7aa2f7]/20 flex items-center justify-center"><FolderOpen className="w-4 h-4 text-[#7aa2f7]" /></div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-[#bb9af7]/20 flex items-center justify-center"><FolderOpen className="w-4 h-4 text-[#bb9af7]" /></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#cdd6f4]">Temp & Cache Cleaner</h2>
          <p className="text-[#6c7086] mt-1">Safely clean temporary files and caches</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-[#6c7086]">Total Recoverable</div>
          <div className="text-2xl font-bold text-[#7aa2f7]">{formatBytes(totalSize)}</div>
        </div>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 bg-[#e0af68]/10 border border-[#e0af68]/30 rounded-xl"
      >
        <AlertTriangle className="w-5 h-5 text-[#e0af68] flex-shrink-0" />
        <p className="text-sm text-[#e0af68]">
          <span className="font-semibold">Smart Cleaning:</span> Only safe-to-delete files are shown. Your system files are protected.
        </p>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {cleanComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 bg-[#9ece6a]/10 border border-[#9ece6a]/30 rounded-xl"
          >
            <Sparkles className="w-5 h-5 text-[#9ece6a]" />
            <p className="text-sm text-[#9ece6a] font-medium">Cleaning complete! Your system is now cleaner.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cache Items */}
      <div className="bg-[#252535]/80 backdrop-blur-sm rounded-xl border border-[#313244] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#313244] bg-[#181825] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedItems.length === items.length
                  ? 'bg-[#7aa2f7] border-[#7aa2f7]'
                  : 'border-[#6c7086] hover:border-[#7aa2f7]'
              }`}
            >
              {selectedItems.length === items.length && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className="font-semibold text-[#cdd6f4]">
              Select All ({items.length} items)
            </span>
          </div>
          {selectedItems.length > 0 && (
            <span className="text-sm text-[#7aa2f7]">
              {selectedItems.length} selected • {formatBytes(selectedSize)}
            </span>
          )}
        </div>

        <div className="divide-y divide-[#313244] max-h-[400px] overflow-y-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleItem(item.id)}
              className={`px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors ${
                selectedItems.includes(item.id) ? 'bg-[#7aa2f7]/10' : 'hover:bg-[#313244]/30'
              }`}
            >
              <button
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedItems.includes(item.id)
                    ? 'bg-[#7aa2f7] border-[#7aa2f7]'
                    : 'border-[#6c7086]'
                }`}
              >
                {selectedItems.includes(item.id) && <Check className="w-3 h-3 text-white" />}
              </button>
              {getTypeIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#cdd6f4]">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.type === 'temp' ? 'bg-[#f7768e]/20 text-[#f7768e]' :
                    item.type === 'browser' ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' :
                    'bg-[#bb9af7]/20 text-[#bb9af7]'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-[#6c7086] truncate mt-1">{item.path}</p>
              </div>
              <span className="text-[#cdd6f4] font-semibold">{formatBytes(item.size)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => setShowPreview(true)}
          disabled={selectedItems.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            selectedItems.length === 0
              ? 'bg-[#313244] text-[#6c7086] cursor-not-allowed'
              : 'bg-[#7aa2f7] text-white hover:bg-[#7aa2f7]/80'
          }`}
        >
          Preview Changes
        </motion.button>
        <motion.button
          onClick={handleClean}
          disabled={selectedItems.length === 0 || cleaning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            selectedItems.length === 0 || cleaning
              ? 'bg-[#313244] text-[#6c7086] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#f7768e] to-[#ff9e64] text-white hover:opacity-90'
          }`}
        >
          {cleaning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Cleaning...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              Clean Selected ({formatBytes(selectedSize)})
            </>
          )}
        </motion.button>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E1E2E] border border-[#313244] rounded-2xl p-6 max-w-lg w-full"
            >
              <h3 className="text-xl font-bold text-[#cdd6f4] mb-4">Cleaning Preview</h3>
              <p className="text-[#6c7086] mb-4">The following items will be deleted:</p>
              <div className="bg-[#252535] rounded-xl p-4 max-h-64 overflow-y-auto mb-4">
                {items.filter(i => selectedItems.includes(i.id)).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
                    <span className="text-[#cdd6f4]">{item.name}</span>
                    <span className="text-[#6c7086]">{formatBytes(item.size)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-[#9ece6a]/10 rounded-xl mb-4">
                <span className="text-[#cdd6f4]">Space to be freed:</span>
                <span className="text-2xl font-bold text-[#9ece6a]">{formatBytes(selectedSize)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 bg-[#313244] text-[#cdd6f4] rounded-lg hover:bg-[#313244]/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClean}
                  className="flex-1 px-4 py-2 bg-[#f7768e] text-white rounded-lg hover:bg-[#f7768e]/80 transition-colors"
                >
                  Confirm Clean
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
