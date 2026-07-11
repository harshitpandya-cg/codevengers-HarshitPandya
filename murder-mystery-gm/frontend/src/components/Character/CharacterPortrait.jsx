import React from 'react';
import { motion } from 'framer-motion';

// Mapping of character names to their generated portrait files
const PORTRAIT_MAP = {
  'Aditya Rathore': '/portraits/aditya_portrait_1783707512108.png',
  'Arjun Rathore': '/portraits/arjun_portrait_1783707502999.png',
  'Bahadur Singh': '/portraits/bahadur_portrait_1783707533968.png',
  'Kavita Rathore': '/portraits/kavita_portrait_1783707493730.png',
  'Meera Kapoor': '/portraits/meera_portrait_1783707522071.png',
  'Raghubir Singh Rathore': '/portraits/raghubir_portrait_1783707484170.png'
};

export default function CharacterPortrait({ name, emotion = 'idle', isSpeaking = false }) {
  const imageSrc = PORTRAIT_MAP[name] || 'https://www.transparenttextures.com/patterns/stardust.png'; // Fallback

  return (
    <div className="relative w-48 h-64 rounded-xl overflow-hidden border border-[#3a3129] shadow-2xl group">
      {/* Speaking Glow Animation */}
      {isSpeaking && (
        <motion.div 
          className="absolute inset-0 bg-[#d4a24c]/20 z-0"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* The Portrait Image */}
      <motion.img 
        src={imageSrc} 
        alt={`${name} portrait`} 
        className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105"
        layoutId={`portrait-${name}`}
      />

      {/* Emotion Overlay (Simulated via color grading if we don't have separate emotion assets) */}
      <div className={`absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-30 transition-colors duration-500
        ${emotion === 'angry' ? 'bg-red-500' : ''}
        ${emotion === 'shocked' ? 'bg-white' : ''}
        ${emotion === 'thinking' ? 'bg-blue-500' : ''}
      `} />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-30" />

      {/* Name Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-40 bg-gradient-to-t from-black to-transparent">
        <h3 className="font-typewriter text-[#d4a24c] text-sm tracking-wider uppercase text-center drop-shadow-md">
          {name}
        </h3>
      </div>
    </div>
  );
}
