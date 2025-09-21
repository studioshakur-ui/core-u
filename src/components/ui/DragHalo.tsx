import * as React from 'react';
import { motion } from 'framer-motion';

export function DragHalo({ active }: { active: boolean }) {
  return active ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="pointer-events-none absolute inset-0 rounded-2xl shadow-halo"
    />
  ) : null;
}
