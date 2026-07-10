import React from 'react';
import { ScrollText, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock timeline data for the replay screen
const MOCK_TIMELINE = [
  { time: '20:00', type: 'assignment', text: 'Roles were assigned. Arthur became the Butler. Beatrice became the Heiress.' },
  { time: '20:05', type: 'chat', sender: 'Arthur', text: 'I heard a scream from the study.' },
  { time: '20:08', type: 'formal_question', text: 'Beatrice formally questioned Arthur about his whereabouts.' },
  { time: '20:09', type: 'lie', text: 'Arthur claimed he was in the kitchen. (This was a lie)' },
  { time: '20:15', type: 'rane', text: 'Rane intervened: "You seem to forget the broken glass in the hallway."' },
  { time: '20:25', type: 'vote', text: 'The group voted. 3 votes for Arthur, 1 for Beatrice.' },
  { time: '20:30', type: 'reveal', text: 'Rane revealed the truth. Arthur was the murderer.' }
];

export default function ReplayScreen({ onReturnToLobby }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-8 font-case relative">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('/diary_texture.png')` }}
      />
      
      <div className="w-full max-w-3xl relative z-10 flex flex-col h-full bg-[#110e0c]/90 border border-mystery-hairline rounded shadow-2xl backdrop-blur-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-mystery-hairline bg-black/40 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-typewriter text-mystery-text uppercase tracking-widest flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-mystery-brass" />
              Case Timeline
            </h1>
            <p className="text-mystery-textSecondary text-sm uppercase tracking-widest mt-1">
              The official record
            </p>
          </div>
          
          <button 
            onClick={onReturnToLobby}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-mystery-panel border border-mystery-hairline text-mystery-text rounded font-typewriter uppercase tracking-wider text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lobby
          </button>
        </div>

        {/* Timeline Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {MOCK_TIMELINE.map((event, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 relative"
            >
              {/* Vertical line connecting events */}
              {i !== MOCK_TIMELINE.length - 1 && (
                <div className="absolute left-6 top-8 bottom-[-2rem] w-px bg-mystery-hairline pointer-events-none" />
              )}
              
              <div className="w-12 pt-1 shrink-0 flex flex-col items-center">
                <div className="bg-black border border-mystery-brass text-mystery-brass rounded-full p-1.5 z-10">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-typewriter text-mystery-textSecondary mt-2">{event.time}</span>
              </div>
              
              <div className={`flex-1 rounded p-4 border ${
                event.type === 'lie' ? 'bg-mystery-red/10 border-mystery-red/30' :
                event.type === 'rane' ? 'bg-mystery-brass/10 border-mystery-brass/30' :
                event.type === 'reveal' ? 'bg-mystery-panelLight border-mystery-brass' :
                'bg-black/30 border-mystery-hairline'
              }`}>
                {event.sender && (
                  <div className="text-xs font-typewriter uppercase tracking-wider text-mystery-textSecondary mb-1">
                    {event.sender}
                  </div>
                )}
                <p className={`font-case text-lg ${
                  event.type === 'lie' ? 'text-mystery-red' :
                  event.type === 'rane' ? 'text-mystery-brass italic' :
                  'text-mystery-text'
                }`}>
                  {event.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
