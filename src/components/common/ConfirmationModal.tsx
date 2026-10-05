import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#13161f] border border-stone-800 rounded-2xl p-6 shadow-2xl z-10"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isDangerous && (
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-stone-100">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-stone-300 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-850 rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
