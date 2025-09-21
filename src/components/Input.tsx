import { cn } from './utils'
import React from 'react'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({className, ...props}, ref) => {
  return <input ref={ref} className={cn('input w-full', className)} {...props} />
})