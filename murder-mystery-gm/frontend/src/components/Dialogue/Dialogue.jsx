import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Dialogue({ speakerName, text, isAi = true, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  
  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    
    // Very fast typewriter for games
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20); // 20ms per character

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#111] border border-[#2a2218] rounded-xl p-4 md:p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle background glow for AI */}
      {isAi && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4a24c]/5 to-transparent animate-pulse" />
      )}

      <div className="relative z-10 flex items-start gap-4">
        {/* Speaker Avatar / Icon */}
        <div className="w-10 h-10 rounded-full bg-black border border-[#d4a24c] flex items-center justify-center shrink-0">
          {isAi ? <Sparkles size={18} className="text-[#d4a24c]" /> : <span className="font-bold text-sm">{speakerName[0]}</span>}
        </div>

        {/* Dialogue Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-typewriter font-bold tracking-widest text-[#d4a24c] uppercase">
              {speakerName}
            </h4>
          </div>
          
          <div className="prose prose-invert prose-p:leading-relaxed max-w-none text-gray-300 text-[15px]">
            <p>"{displayedText}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
