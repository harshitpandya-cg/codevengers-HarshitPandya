import React, { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import { Search, ChevronRight, FileSearch, Sparkles, MessageSquare, ShieldQuestion, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvestigateTab({ sharedClues, players = [] }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('general'); // 'general', 'ask_rane', 'question_player'
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'system', text: 'The investigation has begun. Talk freely, ask Rane for clues, or question a suspect formally.' }
  ]);
  
  // Mock formal question state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [mockResponses, setMockResponses] = useState([]);

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    function onInvestigateResponse({ actionText, flavorText, clue }) {
      setIsInvestigating(false);
      setMessages(prev => [
        ...prev, 
        { type: 'user', text: actionText },
        { type: 'gm', text: flavorText, isClue: !!clue }
      ]);
    }
    
    function onGameError({ message }) {
      setIsInvestigating(false);
      setMessages(prev => [...prev, { type: 'error', text: message }]);
    }

    // Mock open chat receiver
    function onOpenChat({ sender, text }) {
      setMessages(prev => [...prev, { type: 'chat', sender, text }]);
    }

    socket.on('investigateResponse', onInvestigateResponse);
    socket.on('gameError', onGameError);
    socket.on('openChat', onOpenChat);

    return () => {
      socket.off('investigateResponse', onInvestigateResponse);
      socket.off('gameError', onGameError);
      socket.off('openChat', onOpenChat);
    };
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isInvestigating) return;

    if (mode === 'ask_rane') {
      socket.emit('investigateAction', { actionText: input.trim() });
      setIsInvestigating(true);
    } else if (mode === 'general') {
      // Mock open chat
      setMessages(prev => [...prev, { type: 'chat', sender: 'You', text: input.trim() }]);
      // socket.emit('sendOpenChat', { text: input.trim() });
    } else if (mode === 'question_player') {
      if (!selectedPlayer) return;
      // Mock formal questioning flow
      setMessages(prev => [...prev, { type: 'chat', sender: 'You', text: `[Formal Question to ${selectedPlayer}] ${input.trim()}` }]);
      setIsInvestigating(true);
      
      // Simulate backend generating responses for the questioned player
      setTimeout(() => {
        setIsInvestigating(false);
        setMockResponses([
          { type: 'honest', text: "I was in the library reading.", hint: "Low risk, but reveals your location." },
          { type: 'evasive', text: "I don't recall exactly where I was.", hint: "Medium risk, looks suspicious." },
          { type: 'lie', text: "I was with the victim the whole time.", hint: "High risk, easily contradicted." }
        ]);
        setShowQuestionModal(true);
      }, 2000);
    }
    setInput('');
  };

  const handleSelectMockResponse = (response) => {
    setShowQuestionModal(false);
    setMessages(prev => [...prev, { type: 'chat', sender: selectedPlayer, text: response.text }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] max-w-4xl mx-auto w-full font-case px-4 pt-4 pb-2 relative">
      
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4 shrink-0 overflow-x-auto custom-scrollbar pb-1">
        <button 
          onClick={() => setMode('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-typewriter uppercase tracking-wider whitespace-nowrap transition-colors ${mode === 'general' ? 'bg-mystery-brass text-black' : 'bg-black/40 text-mystery-textSecondary border border-mystery-hairline'}`}
        >
          <MessageSquare className="w-4 h-4" /> Open Chat
        </button>
        <button 
          onClick={() => setMode('ask_rane')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-typewriter uppercase tracking-wider whitespace-nowrap transition-colors ${mode === 'ask_rane' ? 'bg-mystery-brass text-black' : 'bg-black/40 text-mystery-textSecondary border border-mystery-hairline'}`}
        >
          <HelpCircle className="w-4 h-4" /> Ask Rane
        </button>
        <button 
          onClick={() => setMode('question_player')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-typewriter uppercase tracking-wider whitespace-nowrap transition-colors ${mode === 'question_player' ? 'bg-mystery-red text-white' : 'bg-black/40 text-mystery-textSecondary border border-mystery-hairline'}`}
        >
          <ShieldQuestion className="w-4 h-4" /> Question Player
        </button>
      </div>

      {mode === 'question_player' && (
        <div className="mb-4 shrink-0 flex items-center gap-3 bg-mystery-red/10 border border-mystery-red/30 p-3 rounded">
          <span className="text-mystery-red font-typewriter text-sm uppercase">Target:</span>
          <select 
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="bg-black/50 border border-mystery-red/30 text-mystery-text rounded px-3 py-1 font-typewriter text-sm focus:outline-none focus:border-mystery-red"
          >
            <option value="">-- Select Suspect --</option>
            {players.filter(p => p.id !== socket.id).map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
            {/* Mock options if players array is empty */}
            {players.length === 0 && <option value="Arthur">Arthur</option>}
            {players.length === 0 && <option value="Beatrice">Beatrice</option>}
          </select>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 bg-black/20 border border-[#2a251e] rounded p-4 custom-scrollbar">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'You' || msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded p-3 ${
                msg.type === 'user' || msg.sender === 'You'
                  ? 'bg-mystery-brass/10 border border-mystery-brass/30 text-mystery-text' 
                  : msg.type === 'error'
                  ? 'bg-red-900/40 border border-red-500/50 text-red-200'
                  : msg.type === 'chat'
                  ? 'bg-[#161310] border border-[#3a332a] text-mystery-text'
                  : 'bg-mystery-red/10 border border-mystery-red/20 text-mystery-textSecondary'
              }`}>
                
                {msg.type === 'chat' && msg.sender !== 'You' && (
                  <div className="text-mystery-brass text-xs font-typewriter mb-1 uppercase tracking-wide">
                    {msg.sender}
                  </div>
                )}
                
                {msg.type === 'gm' && msg.isClue && (
                  <div className="flex items-center text-mystery-brass text-xs font-typewriter mb-2 uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span>New Clue Found</span>
                  </div>
                )}
                
                {msg.type === 'system' && (
                  <div className="flex items-center text-mystery-textSecondary text-xs font-typewriter mb-2 uppercase tracking-wide border-b border-mystery-hairline pb-1">
                    <span>System</span>
                  </div>
                )}

                <p className={`whitespace-pre-wrap ${msg.sender === 'You' ? 'font-typewriter text-sm' : 'text-base leading-relaxed'}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {isInvestigating && (
            <div className="flex justify-start">
              <div className="bg-[#161310] border border-[#3a332a] text-mystery-textSecondary rounded p-4 max-w-[85%] flex items-center space-x-3">
                <Search className="w-4 h-4 animate-pulse text-mystery-brass" />
                <span className="font-typewriter text-sm animate-pulse tracking-wide">
                  Waiting for response...
                </span>
              </div>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="shrink-0 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'ask_rane' ? "e.g. 'Search the victim's pockets'" : "Type a message..."}
          disabled={isInvestigating || (mode === 'question_player' && !selectedPlayer)}
          className="w-full bg-[#161310] border border-[#3a332a] rounded py-4 pl-4 pr-12 text-mystery-text placeholder-mystery-textSecondary/40 focus:outline-none focus:border-mystery-brass transition-colors font-case disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isInvestigating || !input.trim() || (mode === 'question_player' && !selectedPlayer)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-mystery-brass hover:text-yellow-400 disabled:opacity-50 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </form>

      {/* Mock Formal Question Modal (UI Only) */}
      <AnimatePresence>
        {showQuestionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="bg-[#110e0c] border border-mystery-red w-full max-w-lg rounded shadow-2xl p-6 relative">
              <div className="absolute -top-3 -right-3 bg-mystery-red text-white p-1 rounded-full">
                <ShieldQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-typewriter text-mystery-text uppercase tracking-widest mb-2 border-b border-mystery-hairline pb-2">
                You are being questioned
              </h3>
              <p className="text-sm text-mystery-textSecondary italic mb-6">
                Choose how you want to respond. Rane will remember your lies.
              </p>
              
              <div className="space-y-4">
                {mockResponses.map((res, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSelectMockResponse(res)}
                    className="w-full text-left p-4 bg-black/40 border border-[#3a332a] hover:border-mystery-red rounded group transition-all"
                  >
                    <p className="text-mystery-text font-case text-lg group-hover:text-white">"{res.text}"</p>
                    <p className="text-mystery-red/70 text-xs font-typewriter mt-2 uppercase">Risk: {res.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
