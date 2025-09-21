import { cn } from './utils'
import React from 'react'
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'ghost'}> = ({className, variant='primary', ...props}) => {
  return <button className={cn('btn', variant==='primary'?'btn-primary':'btn-ghost', className)} {...props} />
}