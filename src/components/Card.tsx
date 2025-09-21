import { cn } from './utils'
import React from 'react'
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => (
  <div className={cn('card p-4', className)} {...props} />
)