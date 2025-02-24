import axios from 'axios';
import Repo from '../models/repo.js';
import { getDateNDaysAgo } from '../helpers/getDateNDaysAgo.js';
import { getUnixTimestampNDaysAgo } from '../helpers/getUnixTimestampNDaysAgo.js';

const apiController = {};

apiController.getGitHubData = async (req, res, next) => {
  console.log('📈 Getting Trending Github Data!');
  const lastWeek = getDateNDaysAgo(7);
  const query = `created:>${lastWeek}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    // Make an array out of all the items from the query
    const parsedGitHubData = response.data.items.map((thing) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        html_url: repo.owner.html_url,
      },
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      language: repo.language,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      description: repo.description,
    }));
    // Add each item to the database
    console.log('🏪 Updating Database with Results.')
    await Repo.bulkWrite(
      parsedGitHubData.map((thing) => ({
        updateOne: {
          filter: { id: repo.id },
          update: { $Set: repo },
          upsert: true,
        },
      }))
    );
    res.locals.data = parsedGitHubData

    /*
TODO Aggregating the Data
For GitHub:
Ok, so i have created the push to the database, but its firing for the last 7 days.
Some things to think about:
    I need to switch this to a scheduled task that runs daily, and updates the database
    I need to change the date range so that it pulls the last year of data
    I need to auto purge anything that is older than a year to prevent storage bloat
    Is there a way to visualize the database? Mongo stand alone thingy?
    

For Stack Overflow:
The query works, but there is no logic for pushing to the database
Some things to think about:
    Need to make a new schema for stack overflow results
    Need to also make this scheduled
    Need to also change the date range
    Need to also auto purge

For both:
I need to change my package.json to launch both the client and the server.
I need to generate some aggregate data to report against. 
  Maybe that is done client side on render?
  Or maybe that is better to make a 3rd schema for them 
    store the values and then just send them to the client 
    when there is a get request for it.
*/

    return next();
  } catch (error) {
    return next({
      log: ('GitHub API Error:', error.message),
      status: 500,
      message: { error: 'Failed to fetch GitHub trending repositories' },
    });
  }
};

apiController.getStackOverflowData = async (req, res, next) => {
  console.log('📊 Getting Trending StackOverflow Data!');
  const fromDate = getUnixTimestampNDaysAgo(7);
  const toDate = Math.floor(Date.now() / 1000);
  const url = `https://api.stackexchange.com/2.3/questions?fromdate=${fromDate}&todate=${toDate}&order=desc&sort=activity&site=stackoverflow`;

  try {
    const response = await axios.get(url);
    res.locals.data = response.data;
    return next();
  } catch (error) {
    return next({
      log: ('StackOverflow API Error:', error.message),
      status: 500,
      message: { error: 'Failed to fetch StackOverflow trending repositories' },
    });
  }
};

export default apiController;

/*




Dynamic Time Ranges
Backend Filtering:
Fetch data for a longer period (e.g., 12 months) and then process it on the backend to group and filter by different time spans (year, quarter, month, week). This gives you flexibility, but be mindful of potential performance and API rate limit issues.
*/
