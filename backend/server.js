// server.js
// Entry point — loads env, connects DB, starts Express server

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 KatoShort Backend running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
