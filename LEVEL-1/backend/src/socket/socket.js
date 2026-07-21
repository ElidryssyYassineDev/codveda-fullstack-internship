// backend/src/socket/socket.js
// Purpose: Attaches Socket.io to the shared HTTP server. Verifies the
// JWT once at connection time — same trust model as `protect`, just
// running at handshake instead of on every request (Phase 2, Section C).

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function initSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: {
      origin: 'process.env.FRONTEND_URL' || 'http://localhost:5173', // dev only — same permissiveness as app.use(cors()) in app.js
    },
  });

  app.set('io', io);

  // ── Auth middleware — runs ONCE per connection attempt, before
  // 'connection' fires. This is the Phase 2 handshake diagram in code.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      // socket.handshake.auth is where the client's io(url, { auth: { token } })
      // option lands server-side. Optional chaining guards against a client
      // that connects without ever passing an auth object at all.

      if (!token) {
        return next(new Error('Not authenticated'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Same call, same secret, same decoded shape as protect. Throws
      // for a missing/invalid/expired token — caught below.

      const user = await User.findById(decoded.userId);
      // Same re-fetch-from-database principle as protect (Phase 6 review,
      // Task 2): don't trust the token's embedded role blindly — confirm
      // the account still exists right now.

      if (!user) {
        return next(new Error('User no longer exists'));
      }

      socket.user = user;
      // Attached directly to the socket object — available in every
      // handler for the life of THIS connection, no repeated lookups.

      next(); // handshake accepted

    } catch (err) {
      next(new Error('Invalid or expired token'));
      // Covers jwt.verify throwing — malformed token, bad signature,
      // or expired exp claim, same three cases protect handles.
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user.name})`);
    // Admins get room-targeted notifications (low-stock alerts, below);
    // regular users are never added to this room, so io.to('admins')
    // reaches only sockets that passed this exact check at connect time.

    if (socket.user.role === 'admin') {
      socket.join('admins');
    }
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initSocket;