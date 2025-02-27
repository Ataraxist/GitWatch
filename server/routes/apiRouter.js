import express from 'express';
import apiController from '../controllers/apiController.js';

console.log('🔗 Initializing API Router...');

const apiRouter = express.Router();

// Route to fetch GitHub trending repositories
apiRouter.get(
  '/github/trending',
  (req, res, next) => {
    console.log('📡 Incoming request: GET /github/trending');
    next();
  },
  apiController.getGitHubData, // Middleware to fetch GitHub data
  (req, res) => {
    console.log('✨ Sending GitHub Trending Data');
    return res.status(200).json(res.locals);
  }
);

console.log('✅ API Router setup complete.');

export default apiRouter;
