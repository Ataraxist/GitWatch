import Repo from '../db.js';

const apiController = {};

apiController.getGitHubData = async (req, res, next) => {
  console.log('🦄 Getting Trending GitHub Data!');

  const number = req.query.days || 7; // Use 7 Days unless called with a value in params
  console.log(`📅 Fetching data from the last ${number} days...`);

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - number);
    console.log(`🗓️ Filtering repos updated after: ${fromDate.toISOString()}`);

    const repos = await Repo.find({ updated_at: { $gte: fromDate } }).sort({
      stargazers_count: -1, // Sort by stars (trending)
    });

    console.log(`📦 Retrieved ${repos.length} trending repositories.`);

    res.locals.getGitHubData = repos;
    return next();
  } catch (error) {
    console.error('☠️ GitHub API Error:', error.message);
    return next({
      log: `GitHub API Error: ${error.message}`,
      status: 500,
      message: { error: 'Failed to fetch GitHub trending repositories' },
    });
  }
};

export default apiController;
