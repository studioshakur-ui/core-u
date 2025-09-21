import React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn focus-ring',
        variant === 'primary' && 'bg-capo text-white hover:bg-capo-600 active:bg-capo-700',
        variant === 'outline' && 'border border-neutral-25 bg-white hover:bg-neutral-25',
        variant === 'ghost' && 'bg-transparent hover:bg-neutral-25',
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4 text-base',
        size === 'lg' && 'h-12 px-6 text-lg',
        'rounded-premium font-medium duration-normal',
        className
      )}
      {...props}
    />
  );
}
