import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Key, AlertCircle, Copy, UserX } from 'lucide-react';

/**
 * Pre-game lobby — player roster, room code, host-only start + kick controls.
 *
 * @param {Object} props
 * @param {{ id: string, name: string, isHost?: boolean }[]} props.players
 * @param {string} props.currentUserId
 * @param {boolean} props.isHost
 * @param {string} props.roomCode
 * @param {number} props.minPlayers
 * @param {() => void} props.onStartGame
 * @param {boolean} props.isStarting
 * @param {string} [props.error]
 * @param {(id: string) => void} [props.onKickPlayer]
 */
export default function LobbyScreen({
  players = [],
  currentUserId,
  isHost,
  roomCode,
  minPlayers,
  onStartGame,
  isStarting,
  error,
  onKickPlayer,
}) {
  const playersNeeded = Math.max(0, minPlayers - players.length);
  const canStart = isHost && players.length >= minPlayers;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div className="lobby-cinematic min-h-screen bg-mystery-bg flex items-center justify-center p-4 sm:p-8 font-case">
      <div className="lobby-rain" /><div className="lobby-fog" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="lobby-case w-full max-w-4xl bg-mystery-panel rounded-sm shadow-2xl relative border border-mystery-hairline overflow-hidden"
      >
        {/* Stamped folder tab */}
        <div className="absolute top-0 left-8 -translate-y-1/2 bg-mystery-panelLight border border-mystery-hairline px-4 py-1 z-10">
          <span className="font-typewriter text-xs uppercase tracking-widest text-mystery-textSecondary">
            Case #{roomCode}
          </span>
        </div>

        <div className="relative z-10 p-8 sm:p-12 pt-10">

          {/* Header row */}
          <div className="lobby-title flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-mystery-hairline pb-6 mb-8">
            <div>
              <p className="font-typewriter text-xs uppercase tracking-widest text-mystery-textSecondary mb-1">
                Investigation Pending
              </p>
              <h1 className="text-3xl sm:text-4xl font-case text-mystery-text font-semibold">
                The Lobby
              </h1>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col items-end">
              <div className="font-typewriter text-xs uppercase tracking-wider text-mystery-textSecondary mb-1">
                Room Code
              </div>
              <button
                type="button"
                onClick={copyRoomCode}
                className="flex items-center gap-2 bg-mystery-panelLight hover:bg-black/40 px-4 py-2 rounded border border-mystery-hairline transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-mystery-brass focus-visible:ring-offset-2 focus-visible:ring-offset-mystery-panel"
                title="Copy room code"
                aria-label={`Copy room code ${roomCode}`}
              >
                <Key className="w-4 h-4 text-mystery-brass shrink-0" aria-hidden="true" />
                <span className="text-2xl font-typewriter text-mystery-brass tracking-widest">{roomCode}</span>
                <Copy className="w-4 h-4 text-mystery-textSecondary group-hover:text-mystery-text transition-colors opacity-50" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-8 p-4 bg-mystery-red/10 border border-mystery-red/30 rounded flex items-start gap-3 text-mystery-red"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-case text-sm">{error}</span>
            </div>
          )}

          {/* Player roster */}
          <div className="mb-10 lobby-roster">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-mystery-brass font-typewriter tracking-wide uppercase flex items-center gap-2">
                <Users className="w-5 h-5" aria-hidden="true" />
                <span>Players ({players.length})</span>
              </h2>
              {playersNeeded > 0 ? (
                <span className="text-sm text-mystery-red font-typewriter">
                  Need {playersNeeded} more to start
                </span>
              ) : (
                <span className="text-sm text-mystery-brass/80 font-typewriter">
                  Ready to start
                </span>
              )}
            </div>

            <ul className="space-y-2" aria-label="Joined players">
              {players.map((p, index) => {
                const isYou = p.id === currentUserId;
                return (
                  <li
                    key={p.id}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded border transition-all ${
                      isYou
                        ? 'bg-mystery-panelLight border-mystery-brass/30'
                        : 'bg-black/20 border-transparent hover:border-mystery-hairline'
                    }`}
                  >
                    {/* Left: number + name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-typewriter text-sm text-mystery-textSecondary shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-base sm:text-lg truncate ${isYou ? 'text-mystery-brass' : 'text-mystery-text'}`}>
                        {p.name}
                        {isYou && (
                          <span className="text-mystery-textSecondary text-sm ml-1">(you)</span>
                        )}
                      </span>
                    </div>

                    {/* Right: badges + kick */}
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {p.isHost && (
                        <span className="flex items-center gap-1 text-xs bg-mystery-brass/15 text-mystery-brass px-2 py-1 rounded font-typewriter uppercase tracking-wider">
                          <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="sr-only">Host: </span>
                          Host
                        </span>
                      )}
                      {isHost && !isYou && (
                        <button
                          type="button"
                          onClick={() => onKickPlayer?.(p.id)}
                          className="flex items-center gap-1 text-xs bg-mystery-red/10 hover:bg-mystery-red/25 text-mystery-red px-2 py-1 rounded font-typewriter uppercase tracking-wider border border-mystery-red/20 hover:border-mystery-red/50 transition-colors"
                          aria-label={`Kick ${p.name}`}
                          title={`Remove ${p.name} from the room`}
                        >
                          <UserX className="w-3 h-3" />
                          Kick
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}

              {/* Empty slots */}
              {playersNeeded > 0 &&
                Array.from({ length: playersNeeded }).map((_, i) => (
                  <li
                    key={`empty-${i}`}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded border border-dashed border-mystery-hairline bg-black/10 opacity-50"
                  >
                    <span className="font-typewriter text-sm text-mystery-textSecondary">--</span>
                    <span className="text-mystery-textSecondary italic text-sm">Awaiting player…</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Footer actions */}
          <div className="pt-6 border-t border-mystery-hairline flex justify-end">
            {isHost ? (
              <button
                type="button"
                onClick={onStartGame}
                disabled={!canStart || isStarting}
                className={`px-8 py-3 rounded font-typewriter uppercase tracking-widest shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-mystery-brass focus-visible:ring-offset-2 focus-visible:ring-offset-mystery-panel ${
                  !canStart || isStarting
                    ? 'bg-mystery-panelLight text-mystery-textSecondary cursor-not-allowed opacity-60'
                    : 'bg-mystery-red hover:bg-red-900 text-mystery-text hover:-translate-y-0.5'
                }`}
              >
                {isStarting ? 'Opening the case…' : 'Start Game'}
              </button>
            ) : (
              <p className="px-6 py-3 border border-mystery-hairline bg-black/20 text-mystery-textSecondary font-case italic text-sm flex items-center gap-2 rounded">
                <span className="w-2 h-2 rounded-full bg-mystery-brass animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                Waiting for host to start
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
