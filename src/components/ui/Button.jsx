import React from 'react'
import { cn } from '@/lib/utils'

export default function Button({variant='primary',size='md',className,...props}){
  return (
    <button
      className={cn(
        'rounded-premium font-medium transition',
        variant==='primary' && 'bg-capo text-white px-4 py-2',
        variant==='outline' && 'border border-neutral-25 bg-white hover:bg-neutral-25',
        size==='sm'&&'text-sm px-2 py-1',
        size==='md'&&'text-base px-3 py-2',
        size==='lg'&&'text-lg px-4 py-3',
        className
      )}
      {...props}
    />
  )
}
