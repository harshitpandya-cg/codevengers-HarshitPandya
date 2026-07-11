import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronRight, CircleDot, Clock3, DoorOpen, FileSearch, Map, MessageSquare, Mic, MicOff, Network, Search, ShieldAlert, Users, X } from 'lucide-react';
import InvestigateTab from './InvestigateTab';
import AccuseTab from './AccuseTab';
import GameLayout from './layouts/GameLayout';
import Dialogue from './components/Dialogue/Dialogue';
import CharacterPortrait from './components/Character/CharacterPortrait';

const rooms = ['Grand Hall', 'Library', 'Kitchen', 'Garden', 'Bedroom', 'Study', 'Basement', 'Secret Room'];

const initials = (name = '?') => name.split(' ').map((piece) => piece[0]).join('').slice(0, 2).toUpperCase();

function Player({ player, active, host }) {
  return <div className={`detective-player ${active ? 'is-speaking' : ''}`}>
    <div className="detective-avatar">{initials(player.name)}<span className="detective-online" /></div>
    <div className="min-w-0 flex-1"><p>{player.name}</p><span>{host ? 'CASE LEAD' : active ? 'SPEAKING' : 'CONNECTED'}</span></div>
    {active ? <Mic size={15} /> : <MicOff size={15} className="opacity-40" />}
  </div>;
}

export default function CinematicGame({ caseInfo, character, players, typingPlayers, sharedClues, setGmSpeaking, hasVoted, voteCount, onVote, currentUserId }) {
  const [tab, setTab] = React.useState('investigate');
  const [notebook, setNotebook] = React.useState(false);
  const [room, setRoom] = React.useState('Grand Hall');
  const activeNames = new Set(Object.values(typingPlayers));
  const currentCharacter = character?.name || 'Unknown Detective';
  
  return (
    <GameLayout gameState={{ phase: 'active' }}>
      <main className="detective-game relative z-10 w-full h-full">
    <header className="detective-topbar">
      <div><span className="eyebrow">ACTIVE CASE / {caseInfo?.round || '01'}</span><h1>{caseInfo?.title || 'An Unsolved Silence'}</h1></div>
      <div className="objective"><ShieldAlert size={18}/><div><span>CURRENT OBJECTIVE</span><strong>Find the truth before the house closes in.</strong></div></div>
      <div className="case-clock"><Clock3 size={18}/><span>INVESTIGATION</span><strong>24:18</strong></div>
    </header>
    <div className="detective-layout">
      <aside className="detective-sidebar left-sidebar">
        <div className="side-heading"><Users size={16}/> INVESTIGATORS <span>{players.length}</span></div>
        <div className="player-list">{players.map((player, i) => <Player key={player.id} player={player} host={i === 0} active={activeNames.has(player.name)} />)}</div>
        <div className="side-heading rooms-heading"><DoorOpen size={16}/> MANSION ROOMS</div>
        <nav className="room-list">{rooms.map((item, i) => <button onClick={() => setRoom(item)} className={room === item ? 'active' : ''} key={item}><span>0{i + 1}</span>{item}{item === room && <CircleDot size={13}/>}</button>)}</nav>
      </aside>
      <section className="detective-stage">
        <div className="room-scene">
          <div className="scene-copy"><span>LOCATION / EAST WING</span><h2>{room}</h2><p>The silence here is not empty. It is listening.</p></div>
          <button className="hotspot hotspot-book"><FileSearch size={15}/><span>Examine records</span></button><button className="hotspot hotspot-window"><Search size={15}/><span>Window latch</span></button><button className="hotspot hotspot-desk"><Search size={15}/><span>Desk drawer</span></button>
          <div className="scene-light" />
        </div>
        <div className="w-full max-w-4xl mx-auto -mt-6 z-20 px-4">
          <Dialogue 
            speakerName="The Game Master" 
            text="Every detail has a voice. What will you investigate?" 
            isAi={true} 
          />
        </div>
        <div className="game-workspace mt-4">
          {tab === 'investigate' ? <InvestigateTab sharedClues={sharedClues} typingPlayers={typingPlayers} setGmSpeaking={setGmSpeaking} /> : <AccuseTab players={players} currentUserId={currentUserId} hasVoted={hasVoted} voteCount={voteCount} totalPlayers={players.length} onVote={onVote} />}
        </div>
      </section>
      <aside className="detective-sidebar right-sidebar">
        <div className="side-heading"><FileSearch size={16}/> EVIDENCE <span>{sharedClues.length}</span></div>
        <div className="quick-evidence">{sharedClues.length ? sharedClues.slice(-3).map(clue => <article key={clue.id}><i />{clue.description}</article>) : <p>No evidence catalogued.<br/>Search the estate.</p>}</div>
        <button className="case-tool" onClick={() => setNotebook(true)}><BookOpen size={18}/><span>CASE NOTEBOOK</span><ChevronRight size={15}/></button>
        <button className="case-tool" onClick={() => setNotebook(true)}><Network size={18}/><span>RELATIONSHIP BOARD</span><ChevronRight size={15}/></button>
        <div className="mt-4 flex justify-center">
          <CharacterPortrait name={currentCharacter} emotion="idle" />
        </div>
      </aside>
    </div>
    <nav className="action-dock"><button className={tab === 'investigate' ? 'selected' : ''} onClick={() => setTab('investigate')}><Search />Investigate</button><button><MessageSquare />Question</button><button onClick={() => setNotebook(true)}><Map />Map</button><button onClick={() => setNotebook(true)}><BookOpen />Notebook</button><button className={tab === 'accuse' ? 'accuse selected' : 'accuse'} onClick={() => setTab('accuse')}><ShieldAlert />Accuse</button></nav>
    <AnimatePresence>{notebook && <motion.div className="notebook-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setNotebook(false)}><motion.section className="notebook-panel" initial={{x:480}} animate={{x:0}} exit={{x:480}} transition={{type:'spring', damping:28}} onClick={e => e.stopPropagation()}><button className="notebook-close" onClick={() => setNotebook(false)}><X /></button><span className="eyebrow">PRIVATE RECORD / DETECTIVE'S NOTEBOOK</span><h2>Case Notes</h2><div className="notebook-tabs"><button>Evidence</button><button>Suspects</button><button>Timeline</button><button>Objectives</button></div><div className="evidence-board"><div className="board-node victim">VICTIM<br/><b>{caseInfo?.victim || 'Unknown'}</b></div><div className="board-wire wire-one"/><div className="board-wire wire-two"/><div className="board-node suspect">SUSPECTS<br/><b>{Math.max(players.length - 1, 0)} active</b></div><div className="board-node clue">EVIDENCE<br/><b>{sharedClues.length} recovered</b></div></div></motion.section></motion.div>}</AnimatePresence>
      </main>
    </GameLayout>
  );
}
