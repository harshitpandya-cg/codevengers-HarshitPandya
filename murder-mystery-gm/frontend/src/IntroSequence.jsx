import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroSequence({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let innerTimer;
    const timer = setTimeout(() => {
      if (step < 2) {
        setStep(s => s + 1);
      } else {
        innerTimer = setTimeout(onComplete, 2000); // Wait a bit after the last text before completing
      }
    }, 4000); // 4 seconds per step

    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-6 overflow-hidden font-case">
      {/* Background Rane image, slowly zooming in */}
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.25 }}
        transition={{ duration: 15, ease: "linear" }}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/rane_portrait.png')`, filter: 'sepia(0.8) contrast(1.2)' }}
      />
      
      <div className="relative z-10 max-w-2xl w-full text-center space-y-6">
        <div className="h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.p
                key="step0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1 }}
                className="font-typewriter text-2xl md:text-3xl text-mystery-brass leading-relaxed italic shadow-black drop-shadow-xl"
              >
                "I've seen the worst of this city... the lies people tell when they think no one is watching."
              </motion.p>
            )}
            {step === 1 && (
              <motion.p
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1 }}
                className="font-typewriter text-2xl md:text-3xl text-mystery-text leading-relaxed italic shadow-black drop-shadow-xl"
              >
                "These are my old case files. I'm handing them over to you."
              </motion.p>
            )}
            {step === 2 && (
              <motion.p
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1 }}
                className="font-typewriter text-2xl md:text-3xl text-mystery-red leading-relaxed italic shadow-black drop-shadow-xl"
              >
                "I'll be watching. If you lose the trail, I might just step in."
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <button 
          onClick={onComplete}
          className="mt-12 text-mystery-textSecondary hover:text-mystery-text uppercase tracking-widest text-sm font-typewriter transition-colors opacity-50 hover:opacity-100 focus:outline-none"
        >
          [ Skip ]
        </button>
      </div>
    </div>
  );
}
