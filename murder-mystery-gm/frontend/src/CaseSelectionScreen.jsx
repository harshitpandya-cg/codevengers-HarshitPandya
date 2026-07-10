import React, { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CASES = [
  {
    id: 'case-001',
    title: 'The Film Set Fatality',
    victim: 'Arthur Sterling',
    location: 'Studio 4, Hollywood',
    description: 'A tyrannical director is found crushed under a lighting rig. Was it an accident, or was it a final cut?',
    difficulty: 'Medium'
  },
  {
    id: 'case-002',
    title: 'Wedding Bell Blues',
    victim: 'The Best Man',
    location: 'Highcliff Manor',
    description: 'The groom\'s brother is found poisoned in the wine cellar just before the toast. A family full of secrets.',
    difficulty: 'Hard'
  }
];

export default function CaseSelectionScreen({ onSelectCase, isHost }) {
  const [selectedId, setSelectedId] = useState(MOCK_CASES[0].id);

  if (!isHost) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-case relative">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url('/diary_texture.png')` }}
          />
        <div className="relative z-10 space-y-4">
          <BookOpen className="w-12 h-12 text-mystery-brass mx-auto animate-pulse" />
          <h2 className="text-2xl font-typewriter text-mystery-text uppercase tracking-widest">
            Host is browsing the diary
          </h2>
          <p className="text-mystery-textSecondary italic">
            Wait for a case to be selected...
          </p>
        </div>
      </div>
    );
  }

  const selectedCase = MOCK_CASES.find(c => c.id === selectedId);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8 font-case relative">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('/diary_texture.png')` }}
      />
      
      <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row gap-8 bg-[#110e0c]/90 p-8 rounded-sm border border-mystery-hairline shadow-2xl backdrop-blur-sm">
        
        {/* Left Page: List of Cases */}
        <div className="flex-1 border-r border-mystery-hairline border-dashed pr-8 space-y-6">
          <div className="border-b border-mystery-hairline pb-4 mb-4">
            <h1 className="text-3xl font-typewriter text-mystery-text uppercase tracking-widest">
              Rane's Diary
            </h1>
            <p className="text-mystery-textSecondary text-sm uppercase tracking-widest mt-1">
              Select an open file
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_CASES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 rounded border transition-all ${
                  selectedId === c.id 
                    ? 'bg-mystery-brass/10 border-mystery-brass text-mystery-brass'
                    : 'bg-black/30 border-mystery-hairline text-mystery-text hover:border-mystery-brass/50'
                }`}
              >
                <div className="font-typewriter uppercase tracking-wide">{c.title}</div>
                <div className="text-xs mt-1 text-mystery-textSecondary">Victim: {c.victim}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Page: Case Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
             <div className="inline-block px-3 py-1 border border-mystery-red/50 text-mystery-red text-xs font-typewriter uppercase tracking-widest rounded-sm mb-2">
              Confidential
            </div>
            
            <h2 className="text-2xl font-case text-mystery-text font-bold">
              {selectedCase.title}
            </h2>
            
            <div className="space-y-2 text-sm font-typewriter text-mystery-textSecondary">
              <p><span className="text-mystery-brass">Victim:</span> {selectedCase.victim}</p>
              <p><span className="text-mystery-brass">Location:</span> {selectedCase.location}</p>
              <p><span className="text-mystery-brass">Difficulty:</span> {selectedCase.difficulty}</p>
            </div>
            
            <div className="p-4 bg-black/40 border-l-2 border-mystery-brass text-mystery-text italic leading-relaxed">
              "{selectedCase.description}"
            </div>
          </div>

          <div className="pt-8 mt-auto flex justify-end">
            <button
              onClick={() => onSelectCase(selectedCase)}
              className="flex items-center gap-2 px-6 py-3 bg-mystery-red hover:bg-red-900 text-white font-typewriter uppercase tracking-widest rounded transition-all shadow-lg hover:-translate-y-0.5"
            >
              <span>Open Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
