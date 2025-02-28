// Im saving the API token in an env file
import dotenv from 'dotenv';
dotenv.config();

// import the other stuff
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter.js';
import './helpers/cronJob.js';

const app = express();
const PORT = process.env.PORT || 9001;

console.log('📦 Initializing server setup...');

app.use(express.json()); // Parse JSON request bodies
console.log('🛠️ JSON parser middleware added.');

app.use(cors()); // Allow cross-origin requests (useful for React frontend)
console.log('🔓 CORS middleware enabled.');

app.use(express.urlencoded({ extended: true })); // allows for URL encoded data parsing
console.log('📝 URL-encoded parser middleware added.');

// github/stackoverflow API route
app.use('/api', (req, res, next) => {
  console.log('🔎 API accessed:', req.method, req.originalUrl);
  apiRouter(req, res, next);
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  console.log(`😖 404 Response Sent! (${req.method} ${req.originalUrl})`);
  res.status(404).send('404 Page Not Found');
});

// global error handler
app.use((err, req, res, next) => {
  console.log('❌ Error triggered:', err.message || 'Unknown error');
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultError, err);
  console.log('🚨 Error log:', errorObj.log);
  return res.status(errorObj.status).send(errorObj.message);
});

// port listening to start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

cronJob();
