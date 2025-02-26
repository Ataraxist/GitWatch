import express from 'express';
import apiController from '../controllers/apiController.js';

const apiRouter = express.Router();

apiRouter.get(
  '/github/trending',
  apiController.getGitHubData,
  apiController.getGitHubAggregate,
  (req, res) => {
    console.log('✨ Sending GitHub Trending Data');
    return res.status(200).json(res.locals);
  }
);

apiRouter.get(
  '/github/calculated',
  apiController.getGitHubAggregate,
  (req, res) => {
    console.log('🔢 Sending GitHub Aggregate Data');
    return res.status(200).json(res.locals.getGitHubAggregate);
  }
);

// apiRouter.get(
//   '/stackoverflow/trending',
//   apiController.getStackOverflowData,
//   (req, res, next) => {
//     console.log('🎇 Sending StackOverflow Trending Data');
//     return res.status(200).json(res.locals.data);
//   }
// );

export default apiRouter;
