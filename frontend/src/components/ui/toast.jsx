import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = ({ toast, onClose }) => {
  const { id, type = 'info', title, message, duration = 3000 } = toast;

  // Icon và màu sắc theo type
  const toastConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-white',
      borderColor: 'border-green-300',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-500',
      titleColor: 'text-green-900',
      messageColor: 'text-green-800',
      shadowColor: 'shadow-lg shadow-green-200/60',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-white',
      borderColor: 'border-red-300',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-500',
      titleColor: 'text-red-900',
      messageColor: 'text-red-800',
      shadowColor: 'shadow-lg shadow-red-200/60',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-white',
      borderColor: 'border-amber-300',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-500',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-800',
      shadowColor: 'shadow-lg shadow-amber-200/60',
    },
    info: {
      icon: Info,
      bgColor: 'bg-white',
      borderColor: 'border-blue-300',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-800',
      shadowColor: 'shadow-lg shadow-blue-200/60',
    },
  };

  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full fade-in-0',
        config.bgColor,
        config.borderColor,
        config.shadowColor,
        'min-w-[320px] max-w-[420px]'
      )}
      role="alert"
    >
      {/* Decorative background */}
      <div className={cn('absolute -right-8 -bottom-8 h-24 w-24 rounded-full blur-2xl opacity-20', config.iconBg)} />
      
      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 rounded-lg p-2 bg-white', config.iconBg, 'ring-2 ring-white')}>
          <Icon className={cn('h-5 w-5 text-white')} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-semibold text-sm mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm leading-relaxed', config.messageColor)}>
            {message || title}
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => onClose(id)}
          className={cn(
            'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
            'text-gray-500 hover:text-gray-700',
            'focus:ring-gray-400'
          )}
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

