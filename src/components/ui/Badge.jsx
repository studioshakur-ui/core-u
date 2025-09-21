import React from 'react'
import { cn } from '@/lib/utils.js'

export function Badge({ variant = 'default', className, ...props }) {
  const styles = {
    default: 'bg-neutral-25 text-neutral-100',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger:  'bg-danger/10 text-danger',
    'hse-ok': 'bg-success/10 text-success',
    'hse-ko': 'bg-danger/10 text-danger',
  }
  return <span className={cn('inline-flex items-center rounded-xl px-2.5 py-1 text-sm font-medium', styles[variant], className)} {...props} />
}
