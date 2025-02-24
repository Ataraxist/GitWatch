import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.get(
  '/github/trending',
  apiController.getGitHubData,
  (req, res, next) => {
    console.log('✨ Sending GitHub Trending Data');
    return res.status(200).json(res.locals.data);
  }
);

apiRouter.get(
  '/stackoverflow/trending',
  apiController.getStackOverflowData,
  (req, res, next) => {
    console.log('🎇 Sending StackOverflow Trending Data');
    return res.status(200).json(res.locals.data);
  }
);

export default apiRouter;
