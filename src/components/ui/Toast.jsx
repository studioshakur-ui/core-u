import React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cn } from '../../lib/utils.js'

export function ToastProvider({ children }) {
  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {children}
      <ToastPrimitives.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[calc(100%-2rem)] flex-col gap-2" />
    </ToastPrimitives.Provider>
  )
}

export function Toast({ open, onOpenChange, title, description, variant = 'default' }) {
  const styles = {
    default: 'bg-white text-neutral-100',
    success: 'bg-success text-white',
    danger:  'bg-danger text-white',
    warning: 'bg-warning text-neutral-100',
  }
  return (
    <ToastPrimitives.Root open={open} onOpenChange={onOpenChange} className={cn('rounded-xl p-4 shadow-e2', styles[variant])}>
      {title && <ToastPrimitives.Title className="font-heading text-lg">{title}</ToastPrimitives.Title>}
      {description && <ToastPrimitives.Description className="mt-1 text-sm opacity-90">{description}</ToastPrimitives.Description>}
    </ToastPrimitives.Root>
  )
}
