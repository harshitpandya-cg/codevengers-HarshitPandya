<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { socket } from './socket';
import { Skull, UserPlus, LogIn, AlertCircle, Users, FileSearch, Fingerprint } from 'lucide-react';
import LobbyScreen from './LobbyScreen';
import LoadingMystery from './LoadingMystery';
import PublicInfoBar from './PublicInfoBar';
import CharacterCard from './CharacterCard';
import InvestigateTab from './InvestigateTab';
import AccuseTab from './AccuseTab';
import RevealScreen from './RevealScreen';
import PlayerGrid from './PlayerGrid';
import AdminTest from './AdminTest';
import weddingTheme from './themes/wedding';
import { ThemeAmbient, ThemeProvider } from './themes/ThemeProvider';
import React, { Suspense } from 'react';
const VoiceChat = React.lazy(() => import('./components/VoiceChat'));

const MIN_PLAYERS = 3;

export default function App() {
  // Theme selection can eventually come from the generated mystery's setting field.
  // It is intentionally fixed here so no game-state or generator schema changes are needed.
  const activeTheme = weddingTheme;
  const [view, setView] = useState('home'); // home, lobby, loading, game, reveal
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    setIsConnected(socket.connected);

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const [currentRoom, setCurrentRoom] = useState('');
  const [players, setPlayers] = useState([]);
  const [hostId, setHostId] = useState('');
  const [myCharacter, setMyCharacter] = useState(null);
  const [caseInfo, setCaseInfo] = useState(null);
  
  const [typingPlayers, setTypingPlayers] = useState({});
  const [gmSpeaking, setGmSpeaking] = useState(false);

  // Phase 3 State
  const [gameTab, setGameTab] = useState('dossier'); // dossier, investigate, accuse
  const [sharedClues, setSharedClues] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [revealData, setRevealData] = useState(null);
=======
import React, { useEffect, useRef } from 'react';
import { useGame } from './state/GameContext.jsx';
import Home from './pages/Home.jsx';
import Lobby from './pages/Lobby.jsx';
import Briefing from './pages/Briefing.jsx';
import Investigation from './pages/Investigation.jsx';
import Reveal from './pages/Reveal.jsx';
import PastGames from './pages/PastGames.jsx';
import AudioControl from './components/AudioControl.jsx';
import { audioEngine } from './audio/audioEngine.js';

export default function App() {
  const { state, setView } = useGame();
  const revealStingPlayed = useRef(false);
>>>>>>> 0b6d1fa (working)

  // Browsers block audio until a real user gesture happens anywhere on the page —
  // unlock on the first click/keypress rather than requiring the user to specifically
  // touch the volume control first.
  useEffect(() => {
    const unlock = () => {
      audioEngine.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Ambient bed plays only during active investigation; stops on any other screen.
  useEffect(() => {
    if (state.status === 'investigating') {
      audioEngine.startAmbient();
    } else {
      audioEngine.stopAmbient();
    }
  }, [state.status]);

  // One-shot reveal sting, fired once per game when the solution lands.
  useEffect(() => {
    if (state.status === 'revealed' && !revealStingPlayed.current) {
      revealStingPlayed.current = true;
      audioEngine.play('reveal');
    }
    if (state.status !== 'revealed') revealStingPlayed.current = false;
  }, [state.status]);

  // Event-injection / accusation stings, driven off new transcript entries.
  const lastSeenLength = useRef(0);
  useEffect(() => {
    const newMessages = state.transcript.slice(lastSeenLength.current);
    lastSeenLength.current = state.transcript.length;
    newMessages.forEach((m) => {
      if (m.type === 'event') audioEngine.play('event');
      if (m.type === 'accusation') audioEngine.play('accusation');
    });
  }, [state.transcript]);

<<<<<<< HEAD
  const handleJoin = (e) => {
    e.preventDefault();
    setError('');
    if (!playerName.trim()) return setError('Please enter your name');
    if (!roomCodeInput.trim()) return setError('Please enter a room code');

    socket.emit('joinRoom', { roomCode: roomCodeInput, playerName }, (res) => {
      if (res.ok) {
        setCurrentRoom(res.roomCode);
        setPlayers(res.players);
        setHostId(res.hostId);
        setView('lobby');
      } else {
        setError(res.error);
      }
    });
  };

  const handleStartGame = () => {
    setError('');
    setIsStarting(true);
    socket.emit('startGame', { roomCode: currentRoom }, (res) => {
      if (!res?.ok) {
        setError(res?.error || 'Failed to start game');
        setIsStarting(false);
      }
    });
  };

  const handleVote = (accusedId, motive) => {
    socket.emit('submitVote', { accusedId, motive });
    setHasVoted(true);
  };

  const handleReturnToLobby = () => {
    socket.emit('returnToLobby');
  };

  const handleKick = (targetId) => {
    socket.emit('kickPlayer', { targetId }, (res) => {
      if (!res?.ok) setError(res?.error || 'Could not kick player');
    });
  };

  // =====================
  //  ADAPTER LAYER
  // =====================

  const lobbyPlayers = (players || []).map(p => ({
    id: p.id,
    name: p.name,
    isHost: p.id === hostId
  }));

  const adaptCharacter = (char) => {
    if (!char) return {};
    return {
      name: char.character_name,
      background: char.public_bio + '\n\n' + char.private_bio,
      secret: char.secrets?.join('\n'),
      hiddenInfo: char.hidden_information?.join('\n'),
      motive: char.personal_objective,
      relationships: char.relationships || [],
      alibi: char.alibi_claimed
    };
  };

  // =====================
  //  VIEWS
  // =====================

  if (view === 'reveal' && revealData) {
    return (
      <RevealScreen 
        revealData={revealData}
        isHost={socket.id === hostId}
        onReturnToLobby={handleReturnToLobby}
        setGmSpeaking={setGmSpeaking}
      />
    );
  }

  if (view === 'game') {
    const adapted = adaptCharacter(myCharacter);
    
    return (
      <ThemeProvider theme={activeTheme}>
        <div className="themed-game-shell min-h-screen bg-mystery-bg flex flex-col pb-20">
          <ThemeAmbient />
          <PublicInfoBar
            title={caseInfo?.title}
            victim={caseInfo?.victim}
            location={caseInfo?.location}
            round={caseInfo?.round}
            totalRounds={caseInfo?.totalRounds}
          />

          <PlayerGrid players={players} typingPlayers={typingPlayers} gmSpeaking={gmSpeaking} />
          
          <div className="flex-1">
            {gameTab === 'dossier' && (
              <CharacterCard
                name={adapted.name}
                background={adapted.background}
                secret={adapted.secret}
                hiddenInfo={adapted.hiddenInfo}
                motive={adapted.motive}
                relationships={adapted.relationships}
                alibi={adapted.alibi}
              />
            )}
            {gameTab === 'investigate' && (
              <InvestigateTab 
                sharedClues={sharedClues} 
                setGmSpeaking={setGmSpeaking} 
                typingPlayers={typingPlayers}
              />
            )}
            {gameTab === 'accuse' && (
              <AccuseTab 
                players={players} 
                currentUserId={socket.id}
                hasVoted={hasVoted}
                voteCount={voteCount}
                totalPlayers={players.length}
                onVote={handleVote}
              />
            )}
          </div>

          {/* Voice Chat – floats above bottom nav */}
          <Suspense fallback={null}>
            <VoiceChat players={players} roomCode={currentRoom} />
          </Suspense>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 w-full bg-[#110e0c] border-t border-[#2a251e] flex justify-around p-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setGameTab('dossier')}
              className={`font-typewriter tracking-widest text-sm uppercase px-4 py-2 rounded transition-colors ${gameTab === 'dossier' ? 'text-mystery-brass bg-[#2a251e]' : 'text-mystery-textSecondary hover:text-mystery-text'}`}
            >
              Dossier
            </button>
            <button 
              onClick={() => setGameTab('investigate')}
              className={`font-typewriter tracking-widest text-sm uppercase px-4 py-2 rounded transition-colors ${gameTab === 'investigate' ? 'text-mystery-brass bg-[#2a251e]' : 'text-mystery-textSecondary hover:text-mystery-text'}`}
            >
              Investigate
            </button>
            <button 
              onClick={() => setGameTab('accuse')}
              className={`font-typewriter tracking-widest text-sm uppercase px-4 py-2 rounded transition-colors ${gameTab === 'accuse' ? 'text-mystery-red bg-[#3a1010]' : 'text-mystery-red/60 hover:text-mystery-red'}`}
            >
              Accuse
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (view === 'loading') {
    return <LoadingMystery />;
  }

  if (view === 'lobby') {
    return (
      <>
        <LobbyScreen
          players={lobbyPlayers}
          currentUserId={socket.id}
          isHost={socket.id === hostId}
          roomCode={currentRoom}
          minPlayers={MIN_PLAYERS}
          onStartGame={handleStartGame}
          isStarting={isStarting}
          error={error}
          onKickPlayer={handleKick}
        />
        <Suspense fallback={null}>
          <VoiceChat players={players} roomCode={currentRoom} />
        </Suspense>
      </>
    );
  }

  // =====================
  //  HOME SCREEN
  // =====================
=======
  let body;
  if (state.view === 'past-games') {
    body = <PastGames />;
  } else if (state.view === 'home' || !state.roomCode) {
    body = <Home />;
  } else if (state.status === 'lobby') {
    body = <Lobby />;
  } else if (state.status === 'briefing') {
    body = <Briefing />;
  } else if (state.status === 'investigating') {
    body = <Investigation />;
  } else if (state.status === 'revealed') {
    body = <Reveal />;
  } else {
    body = <Home />;
  }

>>>>>>> 0b6d1fa (working)
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand" onClick={() => !state.roomCode && setView('home')}>
          <span className="brand-icon">🗡️</span>
          <span>AI Murder Mystery — Game Master</span>
        </div>
<<<<<<< HEAD

        <section className="home-case-content" aria-label="Murder Mystery game entry">
          <header className="home-case-header">
            <p className="home-case-eyebrow">Case file no. MM-01 · Active investigation</p>
            <h1>Murder<br /><span>Mystery</span></h1>
            <p className="home-case-tagline">Every table holds a secret. Every secret leaves a trace.</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className="text-sm font-semibold opacity-80 text-mystery-brass">
                {isConnected ? '🟢 Backend Connected' : '🔴 Backend Disconnected'}
              </span>
            </div>
          </header>

          <div className="home-case-dossier">
            <div className="home-case-fastener" aria-hidden="true" />
            <p className="home-case-section-label">Player credentials</p>

            <form className="home-case-form">
              <label className="home-case-label" htmlFor="player-name">Your identity</label>
              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="home-case-input"
              />

              {error && (
                <div className="home-case-error" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="home-case-actions">
                <button
                  onClick={handleCreate}
                  type="button"
                  className="home-case-create"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create game</span>
                </button>

                <details className="home-case-join">
                  <summary>
                    <LogIn className="w-4 h-4" />
                    <span>Join game</span>
                  </summary>
                  <div className="home-case-join-panel">
                    <label className="home-case-label" htmlFor="room-code">Room code</label>
                    <div className="home-case-code-row">
                      <input
                        id="room-code"
                        type="text"
                        value={roomCodeInput}
                        onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                        placeholder="CODE"
                        maxLength={5}
                        className="home-case-input home-case-code-input"
                      />
                      <button
                        onClick={handleJoin}
                        type="button"
                        className="home-case-enter"
                        aria-label="Join game"
                      >
                        Enter
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </form>
          </div>

          <p className="home-case-footer">Issued for tonight’s investigation · Trust no alibi</p>
        </section>
      </main>
=======
        <div className="header-controls">
          {!state.connected && <span className="conn-badge conn-bad">reconnecting…</span>}
          <AudioControl />
        </div>
      </header>
      <main className="app-main">{body}</main>
>>>>>>> 0b6d1fa (working)
    </div>
  );
}
