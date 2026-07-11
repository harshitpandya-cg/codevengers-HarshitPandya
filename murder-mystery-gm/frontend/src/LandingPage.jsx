import { useRef } from 'react';
import {
  Skull,
  LogIn,
  AlertCircle,
  FileText,
  Search,
  MessageSquare,
  Gavel,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

const CAST = [
  {
    name: 'Eleanor Ravenswood',
    role: 'Lady of the Manor',
    background:
      'Inherited Ravenswood after her brother’s death. She arranged tonight’s gathering to settle old accounts — or so she claims.',
    secretHint: 'Knows more about the study’s locked drawer than she admits.',
    sheetLabel: 'Dossier A',
  },
  {
    name: 'Dr. Julian Ashford',
    role: 'Family Physician',
    background:
      'Twenty years tending to the Ravenswood line. Present when the body was discovered, calm to a fault.',
    secretHint: 'His medical bag held something besides instruments.',
    sheetLabel: 'Dossier B',
  },
  {
    name: 'Clara Whitmore',
    role: 'Estate Solicitor',
    background:
      'Drafted a revised will weeks before tonight. She insists the changes were routine — the family disagrees.',
    secretHint: 'Received a letter she never filed.',
    sheetLabel: 'Dossier C',
  },
  {
    name: 'Thomas Hale',
    role: 'Former Business Partner',
    background:
      'A bitter dissolution left him outside the family fortune. He arrived uninvited and stayed anyway.',
    secretHint: 'His alibi depends on a witness who hasn’t spoken yet.',
    sheetLabel: 'Dossier D',
  },
  {
    name: 'Margot Chen',
    role: 'Investigative Journalist',
    background:
      'Writing a profile on the Ravenswood fortune. She came for quotes and found a crime scene instead.',
    secretHint: 'Recorded a conversation she hasn’t shared.',
    sheetLabel: 'Dossier E',
  },
];

const COMPARISON_ROWS = [
  {
    typical: 'Same roles and backstories every session',
    ours: 'Every dossier is generated — no two sheets match',
  },
  {
    typical: 'Clues appear on a fixed timer',
    ours: 'Clues surface when the room actually needs them',
  },
  {
    typical: 'One scripted path to the reveal',
    ours: 'A live AI Game Master adapts to what players notice and discuss',
  },
];

const STEPS = [
  {
    icon: FileText,
    title: 'Receive your dossier',
    description: 'Each player gets a private character sheet with secrets only they know.',
  },
  {
    icon: Search,
    title: 'Investigate together',
    description: 'Question suspects, compare alibis, and press for details around the table.',
  },
  {
    icon: MessageSquare,
    title: 'The GM adapts live',
    description: 'The AI watches the conversation and nudges, reveals, or redirects in real time.',
  },
  {
    icon: Gavel,
    title: 'Accuse the killer',
    description: 'When you are ready, submit your theory. The truth — and your score — is revealed.',
  },
];

const GM_TRANSCRIPT = [
  {
    speaker: 'GM',
    text: 'You have spent twenty minutes circling Mr. Hale’s argument with the victim. Fair — but no one has asked about the conservatory yet.',
  },
  {
    speaker: 'GM',
    text: 'While you debate, a guest recalls something: a decanter, shattered on the flagstones, still wet when they passed through earlier. It was not there at dinner.',
  },
  {
    speaker: 'GM',
    text: 'Dr. Ashford — you were seen near that wing around nine. You need not answer now. But someone should, before you lock in an accusation.',
  },
];

export default function LandingPage({
  playerName,
  setPlayerName,
  roomCodeInput,
  setRoomCodeInput,
  error,
  onCreate,
  onJoin,
}) {
  const entryRef = useRef(null);

  const scrollToEntry = () => {
    entryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 400);
    }
  };

  return (
    <div className="home-case-page min-h-screen text-mystery-text font-case">
      <div className="home-case-grain" aria-hidden="true" />

      <div className="home-case-folder" aria-hidden="true">
        <div className="home-case-tab">CONFIDENTIAL</div>
        <div className="home-case-cover">
          <Skull className="home-case-cover-mark" />
          <p>Case file no. RM-47</p>
          <strong>Ravenswood Manor</strong>
        </div>
      </div>

      <main className="landing-shell">
        {/* Hero */}
        <section className="landing-hero" aria-labelledby="hero-heading">
          <p className="home-case-eyebrow">Ravenswood Manor · AI Game Master</p>
          <h1 id="hero-heading" className="landing-hero-title">
            The mystery rewrites itself around how you play.
          </h1>
          <p className="landing-hero-sub">
            A live AI Game Master watches your table, adapts clues to your theories, and
            ensures no two investigations unfold the same way.
          </p>
          <button
            type="button"
            onClick={scrollToEntry}
            className="landing-cta-primary"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Start Your Investigation</span>
          </button>
        </section>

        {/* Comparison */}
        <section className="landing-section" aria-labelledby="compare-heading">
          <header className="landing-section-header">
            <p className="home-case-section-label">Why this is different</p>
            <h2 id="compare-heading" className="landing-section-title">
              Static scripts vs. a living investigation
            </h2>
          </header>
          <div className="landing-compare" role="table" aria-label="Feature comparison">
            <div className="landing-compare-head" role="row">
              <span role="columnheader">Typical mystery party games</span>
              <span role="columnheader">This game</span>
            </div>
            {COMPARISON_ROWS.map((row) => (
              <div key={row.typical} className="landing-compare-row" role="row">
                <div className="landing-compare-cell landing-compare-typical" role="cell">
                  <X className="landing-compare-icon landing-compare-icon-no" aria-hidden="true" />
                  <span>{row.typical}</span>
                </div>
                <div className="landing-compare-cell landing-compare-ours" role="cell">
                  <Check className="landing-compare-icon landing-compare-icon-yes" aria-hidden="true" />
                  <span>{row.ours}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proof — GM transcript */}
        <section className="landing-section" aria-labelledby="proof-heading">
          <header className="landing-section-header">
            <p className="home-case-section-label">In the room</p>
            <h2 id="proof-heading" className="landing-section-title">
              The GM adapts mid-game
            </h2>
            <p className="landing-section-lead">
              Not a system log — actual Game Master dialogue when players fixate on the wrong lead.
            </p>
          </header>
          <blockquote className="landing-transcript">
            {GM_TRANSCRIPT.map((line, i) => (
              <p key={i} className="landing-transcript-line">
                <span className="landing-transcript-speaker">{line.speaker}</span>
                {line.text}
              </p>
            ))}
          </blockquote>
        </section>

        {/* Cast teaser */}
        <section className="landing-section" aria-labelledby="cast-heading">
          <header className="landing-section-header">
            <p className="home-case-section-label">The suspects</p>
            <h2 id="cast-heading" className="landing-section-title">
              Five guests. Five private dossiers.
            </h2>
            <p className="landing-section-lead">
              Every player receives a unique sheet — backgrounds, secrets, and objectives differ
              each session. Guilt is never printed on the cover.
            </p>
          </header>
          <ul className="landing-cast-grid">
            {CAST.map((character) => (
              <li key={character.name} className="landing-cast-card">
                <div className="landing-cast-sheet-tag">{character.sheetLabel}</div>
                <h3 className="landing-cast-name">{character.name}</h3>
                <p className="landing-cast-role">{character.role}</p>
                <p className="landing-cast-bg">{character.background}</p>
                <div className="landing-cast-secret">
                  <span className="landing-cast-secret-label">Classified</span>
                  <p>{character.secretHint}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* How it plays */}
        <section className="landing-section" aria-labelledby="how-heading">
          <header className="landing-section-header">
            <p className="home-case-section-label">One evening</p>
            <h2 id="how-heading" className="landing-section-title">
              How it plays
            </h2>
          </header>
          <ol className="landing-steps">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="landing-step">
                  <div className="landing-step-marker" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                    <span>{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="landing-step-title">{step.title}</h3>
                    <p className="landing-step-desc">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Final CTA + entry form */}
        <section
          id="start-investigation"
          ref={entryRef}
          className="landing-section landing-section-final"
          aria-labelledby="final-heading"
        >
          <header className="landing-section-header landing-section-header-center">
            <h2 id="final-heading" className="landing-hero-title landing-hero-title-sm">
              The mystery rewrites itself around how you play.
            </h2>
            <p className="landing-final-note">Best with 5–6 players around one table.</p>
          </header>

          <div className="home-case-dossier landing-entry-dossier">
            <div className="home-case-fastener" aria-hidden="true" />
            <p className="home-case-section-label">Begin tonight&apos;s investigation</p>

            <form className="home-case-form" onSubmit={(e) => e.preventDefault()}>
              <label className="home-case-label" htmlFor="player-name">
                Your identity
              </label>
              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="home-case-input"
                autoComplete="nickname"
              />

              {error && (
                <div className="home-case-error" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="home-case-actions landing-entry-actions">
                <button
                  onClick={onCreate}
                  type="button"
                  className="home-case-create landing-entry-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Your Investigation</span>
                </button>

                <details className="home-case-join">
                  <summary>
                    <LogIn className="w-4 h-4" />
                    <span>Join game</span>
                  </summary>
                  <div className="home-case-join-panel">
                    <label className="home-case-label" htmlFor="room-code">
                      Room code
                    </label>
                    <div className="home-case-code-row">
                      <input
                        id="room-code"
                        type="text"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                        placeholder="CODE"
                        maxLength={5}
                        className="home-case-input home-case-code-input"
                        autoComplete="off"
                      />
                      <button
                        onClick={onJoin}
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

          <p className="home-case-footer">Issued for tonight&apos;s investigation · Trust no alibi</p>
        </section>
      </main>
    </div>
  );
}
