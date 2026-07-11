import { io } from 'socket.io-client';

<<<<<<< HEAD
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Single shared socket instance for the whole app.
// Import this wherever you need to emit/listen instead of creating new connections.
export const socket = io(BACKEND_URL, {
  autoConnect: false,
  // Required for ngrok free-tier: bypasses the interstitial warning page
  // that otherwise intercepts requests and strips CORS headers.
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
=======
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 800,
  reconnectionDelayMax: 4000,
>>>>>>> 0b6d1fa (working)
});

export { SERVER_URL };
