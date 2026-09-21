import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-lg' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs rounded-xl min-h-[40px] gap-1.5',
    md: 'px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base rounded-xl min-h-[48px] gap-2',
    lg: 'w-full py-3.5 sm:py-4 px-6 text-base sm:text-lg rounded-2xl min-h-[56px] gap-3 shadow-md'
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm',
    'primary-lg': 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg w-full',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600'
  };

  const appliedSize = variant === 'primary-lg' ? sizeStyles.lg : sizeStyles[size];
  const widthStyle = fullWidth || variant === 'primary-lg' ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${appliedSize} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
