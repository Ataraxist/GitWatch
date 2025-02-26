/*
TODO Aggregating the Data
I need to change my package.json to launch both the client and the server.

TODO For Stack Overflow:
* Demoted to Stretch Goal
The query works, but there is no logic for pushing to the database
Some things to think about:
Need to make a new schema for stack overflow results
Need to also make this scheduled
Need to also change the date range
Need to also auto purge=
*/
import { GitHubAggregate, Repo } from '../db.js';

const apiController = {};

apiController.getGitHubData = async (req, res, next) => {
  console.log('🦄 Getting Trending Github Data!');
  const number = req.query.days || 7; // Use 7 Days unless called with a value in params
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - number);

    const repos = await Repo.find({ updated_at: { $gte: fromDate } }).sort({
      stargazers_count: -1, // Sort by stars (trending)
    });

    res.locals.getGitHubData = repos;
    return next();
  } catch (error) {
    return next({
      log: ('GitHub API Error:', error.message),
      status: 500,
      message: { error: 'Failed to fetch GitHub trending repositories' },
    });
  }
};

apiController.getGitHubAggregate = async (req, res, next) => {
  console.log('🐠 Getting Aggregates Github Data!');
  try {
    const latestAggregate = await GitHubAggregate.findOne().sort({
      timestamp: -1,
    });

    if (!latestAggregate) {
      return res.status(404).json({ error: 'No aggregate data available.' });
    }

    res.locals.getGitHubAggregate = latestAggregate;
    return next();
  } catch (error) {
    return next({
      log: `GitHub Aggregate Fetch Error: ${error.message}`,
      status: 500,
      message: { error: 'Failed to retrieve GitHub aggregate data' },
    });
  }
};

// apiController.getStackOverflowData = async (req, res, next) => {
//   console.log('📊 Getting Trending StackOverflow Data!');
//   const fromDate = getUnixTimestampNDaysAgo(7);
//   const toDate = Math.floor(Date.now() / 1000);
//   const url = `https://api.stackexchange.com/2.3/questions?fromdate=${fromDate}&todate=${toDate}&order=desc&sort=activity&site=stackoverflow`;

//   try {
//     const response = await axios.get(url);
//     res.locals.data = response.data;
//     return next();
//   } catch (error) {
//     return next({
//       log: ('StackOverflow API Error:', error.message),
//       status: 500,
//       message: { error: 'Failed to fetch StackOverflow trending repositories' },
//     });
//   }
// };

export default apiController;
