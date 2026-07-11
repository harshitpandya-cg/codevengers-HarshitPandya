import React from 'react';
import { motion } from 'framer-motion';

export default function AtmosphericBackground({ theme = 'default' }) {
  // We can swap out the background image based on the active theme/location.
  const getBgImage = () => {
    switch (theme) {
      case 'haveli':
        return 'url("https://www.transparenttextures.com/patterns/black-linen-2.png")'; // Placeholder until our quota resets
      default:
        return 'url("https://www.transparenttextures.com/patterns/black-linen-2.png")';
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      {/* Base Room Image / Texture */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: getBgImage() }}
      />
      
      {/* Dramatic Vignette & Color Grade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
      
      {/* Layer 1: Slow Deep Fog */}
      <motion.div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(200, 200, 200, 0.1) 0%, transparent 60%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2: Fast Foreground Mist */}
      <motion.div
        className="absolute inset-0 opacity-20 mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse at 80% 80%, rgba(180, 180, 200, 0.15) 0%, transparent 50%)'
        }}
        animate={{
          scale: [1.1, 1.3, 1.1],
          x: [0, 40, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rain / Dust particles (Subtle overlay) */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen animate-pulse" />
    </div>
  );
}
