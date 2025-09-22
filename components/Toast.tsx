import React, { useState, useEffect } from 'react';
import { ToastType } from '../contexts/ToastContext';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import InfoIcon from './icons/InfoIcon';
import XIcon from './icons/XIcon';

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onDismiss: (id: number) => void;
  duration?: number;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircleIcon className="text-green-500" />,
  error: <ExclamationIcon className="text-red-500" />,
  warning: <ExclamationIcon className="text-yellow-500" />,
  info: <InfoIcon className="text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300); // Allow time for exit animation
  };

  const animationClass = isExiting ? 'animate-[toast-out_0.3s_ease-out_forwards]' : 'animate-[toast-in_0.3s_ease-out_forwards]';

  return (
    <div
      role="alert"
      className={`relative flex items-start w-full max-w-sm p-4 pr-10 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden ${animationClass}`}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {ICONS[type]}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-base font-bold text-black dark:text-white">
          {message}
        </p>
      </div>
       <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;