import React from 'react';
import AtmosphericBackground from '../components/Background/AtmosphericBackground';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameLayout({ 
  children, 
  gameState, 
  theme = 'haveli' 
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-[#dcd6ce] font-case">
      {/* Dynamic Animated Background */}
      <AtmosphericBackground theme={theme} />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState?.phase || 'loading'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
