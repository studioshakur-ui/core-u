import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'block w-full rounded-xl border border-neutral-25 bg-white px-3 py-2 text-base',
        'focus:ring-0 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(29,185,84,0.45)]',
        'transition duration-fast',
        className
      )}
      {...props}
    />
  )
})
