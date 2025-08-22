import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

// A compact floating badge that docks at top-right of the content area, expands on hover.
const DeveloperCredit = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-auto fixed top-3 right-4 z-40"
    >
      <a
        href="https://www.linkedin.com/in/souvik-senapati/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-xs font-medium
                   text-gray-800 dark:text-foreground bg-white/70 dark:bg-secondary/50 border border-gray-200 dark:border-border
                   shadow-sm backdrop-blur-md hover:shadow-md transition-all"
        title="Developer credit"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/0 via-fuchsia-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Github size={14} className="opacity-70 group-hover:opacity-100" />
        <span className="whitespace-nowrap">Developed by Souvik Senapati</span>
      </a>
    </motion.div>
  );
};

export default DeveloperCredit;