require('dotenv').config();

// Windows + recent Node versions can fail to resolve MongoDB's SRV DNS
// records via the system resolver. Forcing public DNS bypasses that.
require('dns').setServers(['1.1.1.1', '8.8.8.8']);

const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const initSocket = require('./src/socket/socket')

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server, app)

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});