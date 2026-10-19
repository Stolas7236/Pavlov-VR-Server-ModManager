import React from 'react';
import { useServer } from '../context/ServerContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useServer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-[#2E3440]';
        let bgClass = 'bg-[#181A20]';
        let textClass = 'text-[#E2E2E8]';
        let IconComponent = Info;
        let iconColor = 'text-[#0EA5E9]';

        if (toast.type === 'success') {
          borderClass = 'border-[#22C55E]/40';
          iconColor = 'text-[#22C55E]';
          IconComponent = CheckCircle2;
        } else if (toast.type === 'warning') {
          borderClass = 'border-[#F59E0B]/40';
          iconColor = 'text-[#F59E0B]';
          IconComponent = AlertTriangle;
        } else if (toast.type === 'error') {
          borderClass = 'border-[#EF4444]/40';
          iconColor = 'text-[#EF4444]';
          IconComponent = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded border ${borderClass} ${bgClass} shadow-xl shadow-black/60 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs leading-relaxed text-[#E2E2E8] font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#88929B] hover:text-white p-0.5 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
