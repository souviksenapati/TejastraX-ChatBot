import React from 'react';
import { motion } from 'framer-motion';

export default function LogoTejastraX({ className = '' }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} aria-label="TejastraX logo">
      <motion.svg
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewBox="0 0 680 160"
        className="h-14 w-auto drop-shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
        role="img"
        aria-labelledby="txTitle"
      >
        <title id="txTitle">TejastraX</title>
        <defs>
          <linearGradient id="txGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="40%" stopColor="#A78BFA" />
            <stop offset="75%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#A78BFA" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F472B6" stopOpacity="0.0" />
            <stop offset="75%" stopColor="#34D399" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* orbiting ring */}
        <g transform="translate(48,18)">
          <motion.circle
            cx="56"
            cy="56"
            r="46"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="3"
            style={{ filter: 'url(#glow)' }}
            className="origin-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
          {/* small comet */}
          <motion.circle
            cx="100"
            cy="56"
            r="3.5"
            fill="#A78BFA"
            animate={{ rotate: 360 }}
            transform="rotate(0 56 56)"
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* wordmark */}
        <g transform="translate(128,28)">
          {/* subtle outline */}
          <text x="0" y="86" fontSize="96" fontWeight="800" fontFamily="Inter, ui-sans-serif, system-ui" fill="transparent" stroke="white" strokeOpacity="0.18" strokeWidth="2">TejastraX</text>
          {/* gradient fill */}
          <text x="0" y="86" fontSize="96" fontWeight="800" fontFamily="Inter, ui-sans-serif, system-ui" fill="url(#txGrad)">TejastraX</text>
        </g>

        {/* spark on X */}
        <g transform="translate(600,40)">
          <motion.g
            animate={{ scale: [1, 1.1, 1], rotate: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M16 0 L20 12 L32 16 L20 20 L16 32 L12 20 L0 16 L12 12 Z" fill="url(#txGrad)" opacity="0.9" />
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
}
