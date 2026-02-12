import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-mac-accent' }[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg transition-all duration-300 ${bgColor} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <span className="font-medium">{message}</span>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="ml-2 p-1 hover:bg-white/20 rounded transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

interface ToastItem { id: number; message: string; type: ToastType; }
let toastId = 0;
const listeners: ((toast: ToastItem) => void)[] = [];

export const toast = {
  success: (message: string) => { listeners.forEach(fn => fn({ id: ++toastId, message, type: 'success' })); },
  error: (message: string) => { listeners.forEach(fn => fn({ id: ++toastId, message, type: 'error' })); },
  info: (message: string) => { listeners.forEach(fn => fn({ id: ++toastId, message, type: 'info' })); },
  subscribe: (fn: (toast: ToastItem) => void) => {
    listeners.push(fn);
    return () => { const i = listeners.indexOf(fn); if (i > -1) listeners.splice(i, 1); };
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => toast.subscribe(t => setToasts(prev => [...prev, t])), []);
  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t, i) => (
        <div key={t.id} style={{ transform: `translateY(-${i * 60}px)` }}>
          <Toast message={t.message} type={t.type} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
};
