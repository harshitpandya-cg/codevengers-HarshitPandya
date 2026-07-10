import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaseIntro({ caseInfo, onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let innerTimer;
    const timer = setTimeout(() => {
      if (step < 2) {
        setStep(s => s + 1);
      } else {
        innerTimer = setTimeout(onComplete, 3000);
      }
    }, 5000); // 5 seconds per step

    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0806] flex flex-col items-center justify-center z-50 p-6 overflow-hidden font-case">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/diary_texture.png')` }}
      />
      
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center space-y-8">
        
        {/* Typewriter text reveal for the title */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="text-center"
        >
          <div className="text-mystery-red font-typewriter text-sm tracking-[0.3em] uppercase mb-2">Case File</div>
          <h1 className="text-4xl md:text-5xl font-typewriter text-mystery-text uppercase tracking-widest border-b border-mystery-hairline pb-4">
            {caseInfo?.title || "Unknown Case"}
          </h1>
        </motion.div>

        <div className="h-48 flex items-center justify-center text-center px-4 w-full">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.5 }}
                className="space-y-4"
              >
                <p className="font-typewriter text-2xl text-mystery-textSecondary leading-relaxed italic">
                  "The victim was <span className="text-mystery-brass not-italic">{caseInfo?.victim || "someone"}</span>."
                </p>
                <p className="font-typewriter text-xl text-mystery-textSecondary/80">
                  Found dead at {caseInfo?.location || "an unknown location"}.
                </p>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.5 }}
                className="space-y-4"
              >
                <p className="font-typewriter text-2xl text-mystery-text leading-relaxed italic">
                  "{caseInfo?.description || "A tragedy waiting to happen."}"
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.5 }}
                className="space-y-4"
              >
                <p className="font-typewriter text-2xl text-mystery-red leading-relaxed italic">
                  "Everyone here had a reason to want them dead. Only one actually did it."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
