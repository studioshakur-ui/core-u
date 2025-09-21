import React from 'react'
import { cn } from '@/lib/utils.js'

export function Card(props) {
  const { className, ...rest } = props
  return <div className={cn('card rounded-2xl bg-white shadow-e1', className)} {...rest} />
}

export function CardHeader(props) {
  const { className, ...rest } = props
  return <div className={cn('mb-3', className)} {...rest} />
}

export function CardTitle(props) {
  const { className, ...rest } = props
  return <h3 className={cn('h3 font-heading', className)} {...rest} />
}

export function CardContent(props) {
  const { className, ...rest } = props
  return <div className={cn('text-base text-neutral-100', className)} {...rest} />
}
