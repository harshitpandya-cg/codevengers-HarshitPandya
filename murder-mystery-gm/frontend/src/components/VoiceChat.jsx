import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { socket } from '../socket';

/**
 * VoiceChat – Full-mesh WebRTC voice chat using Socket.IO for signaling.
 *
 * Props:
 *   players  – array of { id, name } from room state
 *   roomCode – current room code (used as key to reset on room change)
 */
export default function VoiceChat({ players, roomCode }) {
  const [isMuted, setIsMuted] = useState(true);     // local mic muted
  const [isDeafened, setIsDeafened] = useState(false); // deafen all incoming
  const [hasPermission, setHasPermission] = useState(null); // null=unknown, true, false
  const [activePeers, setActivePeers] = useState({}); // peerId → { name, speaking }

  const localStream = useRef(null);   // our MediaStream
  const peers = useRef({});           // peerId → SimplePeer instance
  const audioRefs = useRef({});       // peerId → <audio> DOM element

  // ── Helpers ──────────────────────────────────────────────────────────────

  const destroyPeer = useCallback((peerId) => {
    if (peers.current[peerId]) {
      peers.current[peerId].destroy();
      delete peers.current[peerId];
    }
    if (audioRefs.current[peerId]) {
      audioRefs.current[peerId].srcObject = null;
    }
    setActivePeers(prev => {
      const next = { ...prev };
      delete next[peerId];
      return next;
    });
  }, []);

  const createPeer = useCallback((peerId, initiator) => {
    if (peers.current[peerId]) return; // already connected

    const peer = new SimplePeer({
      initiator,
      stream: localStream.current,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    peer.on('signal', (signal) => {
      socket.emit('voice:signal', { targetId: peerId, signal });
    });

    peer.on('stream', (remoteStream) => {
      const audio = audioRefs.current[peerId];
      if (audio) {
        audio.srcObject = remoteStream;
        audio.play().catch(() => {});
      }
      const player = players.find(p => p.id === peerId);
      setActivePeers(prev => ({
        ...prev,
        [peerId]: { name: player?.name || peerId.slice(0, 6) },
      }));
    });

    peer.on('error', () => destroyPeer(peerId));
    peer.on('close', () => destroyPeer(peerId));

    peers.current[peerId] = peer;
  }, [players, destroyPeer]);

  // ── Acquire microphone ────────────────────────────────────────────────────

  const acquireMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;
      // Start muted by default – keep tracks disabled until user unmutes
      stream.getAudioTracks().forEach(t => { t.enabled = false; });
      setHasPermission(true);

      // Tell the room we are voice-ready
      socket.emit('voice:join');
    } catch {
      setHasPermission(false);
    }
  }, []);

  // ── Mute / Unmute ─────────────────────────────────────────────────────────

  const toggleMute = useCallback(() => {
    if (!localStream.current) {
      acquireMic();
      return;
    }
    const muted = !isMuted;
    localStream.current.getAudioTracks().forEach(t => { t.enabled = muted; });
    // If toggling ON, register with room
    if (muted && hasPermission) socket.emit('voice:join');
    setIsMuted(!muted);
  }, [isMuted, hasPermission, acquireMic]);

  const toggleDeafen = useCallback(() => {
    const next = !isDeafened;
    setIsDeafened(next);
    Object.values(audioRefs.current).forEach(el => { if (el) el.muted = next; });
  }, [isDeafened]);

  // ── Socket signaling listeners ─────────────────────────────────────────────

  useEffect(() => {
    function onPeerJoined({ peerId }) {
      if (!localStream.current) return; // we haven't got mic yet; they'll initiate later
      createPeer(peerId, true); // we are initiator toward the new joiner
    }

    function onSignal({ fromId, signal }) {
      if (!peers.current[fromId]) {
        // Incoming offer from someone who joined before us
        createPeer(fromId, false);
      }
      peers.current[fromId]?.signal(signal);
    }

    socket.on('voice:peer-joined', onPeerJoined);
    socket.on('voice:signal', onSignal);

    return () => {
      socket.off('voice:peer-joined', onPeerJoined);
      socket.off('voice:signal', onSignal);
    };
  }, [createPeer]);

  // ── Cleanup on unmount / room change ──────────────────────────────────────

  useEffect(() => {
    return () => {
      Object.keys(peers.current).forEach(destroyPeer);
      localStream.current?.getTracks().forEach(t => t.stop());
      localStream.current = null;
    };
  }, [roomCode, destroyPeer]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden audio elements – one per remote peer */}
      {players
        .filter(p => p.id !== socket.id)
        .map(p => (
          <audio
            key={p.id}
            ref={el => { if (el) audioRefs.current[p.id] = el; }}
            autoPlay
            playsInline
            muted={isDeafened}
          />
        ))}

      {/* Voice control bar */}
      <div className="voice-bar">
        {/* Mute / Unmute button */}
        <button
          type="button"
          onClick={toggleMute}
          className={`voice-btn ${isMuted ? 'voice-btn--muted' : 'voice-btn--live'}`}
          title={isMuted ? 'Click to speak (unmute)' : 'Click to mute'}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isMuted ? 'Muted' : 'Live'}</span>
        </button>

        {/* Deafen button */}
        <button
          type="button"
          onClick={toggleDeafen}
          className={`voice-btn voice-btn--deafen ${isDeafened ? 'voice-btn--deafened' : ''}`}
          title={isDeafened ? 'Undeafen (hear others)' : 'Deafen (block all audio)'}
          aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Permission error indicator */}
        {hasPermission === false && (
          <span className="voice-error">⚠ Mic blocked</span>
        )}

        {/* Speaking indicator dots */}
        {Object.values(activePeers).map(({ name }) => (
          <span key={name} className="voice-peer-dot" title={`${name} is connected`}>
            <span className="voice-peer-speaking" />
            {name}
          </span>
        ))}
      </div>
    </>
  );
}
