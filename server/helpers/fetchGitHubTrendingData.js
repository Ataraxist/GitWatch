import dotenv from 'dotenv'; // Load API token
import path from 'path';
dotenv.config({ path: path.resolve('../server', '.env') });

import axios from 'axios'; // API requests
import Bottleneck from 'bottleneck'; // Rate limiting
import Repo from '../db.js'; // Database connection
import { getDateNDaysAgo } from './getDateNDaysAgo.js';

// Bottleneck rate limiter setup
console.log('⏳ Initializing rate limiter...');
const limiter = new Bottleneck({
  reservoir: 5000, // Available tokens
  reservoirRefreshAmount: 5000, // Tokens per reset
  reservoirRefreshInterval: 3600000, // Refresh interval (1 hour)
  minTime: 1000, // Min time between requests
  maxConcurrent: 1, // One request at a time
});
console.log('✅ Rate limiter configured.');

// Helper function for exponential backoff
function sleep(ms) {
  console.log(`⏸️ Sleeping for ${ms / 1000} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to update the limiter settings based on rate limit headers
function updateLimiterSettings(response) {
  console.log('🔄 Updating rate limiter settings based on API headers...');

  const remaining = parseInt(response.headers['x-ratelimit-remaining'], 10); // Extracts the number of remaining API calls
  const reset = parseInt(response.headers['x-ratelimit-reset'], 10) * 1000; // Retrieves the Unix timestamp (in seconds) when the rate limit resets
  const retryAfter = parseInt(response.headers['retry-after'], 10) * 1000 || 0; // Checks if GitHub enforces a temporary block due
  const now = Date.now();
  const timeUntilReset = reset - now; // Determines how long (in milliseconds) until GitHub resets

  console.log(
    `🛑 Remaining API calls: ${remaining}, Time until reset: ${
      timeUntilReset / 1000
    }s, Retry-After: ${retryAfter / 1000}s`
  );

  limiter.updateSettings({
    reservoir: remaining, // Limits the number of available API requests to whatever is remaining
    reservoirRefreshAmount: 5000, // We get 5k back on refresh
    reservoirRefreshInterval: timeUntilReset, // Resume after refresh
    minTime: retryAfter > 0 ? retryAfter : limiter.minTime, // Adjust minTime dynamically
  });
}

export async function fetchGitHubTrendingData(number) {
  console.log(
    `🚀 Fetching GitHub trending data from the past ${number} days...`
  );

  const startDate = getDateNDaysAgo(number);
  let page = 1;
  let rank = 1;

  while (true) {
    const url = `https://api.github.com/search/repositories?q=created:>${startDate}&sort=stars&order=desc&per_page=100&page=${page}`;
    console.log(`📡 Fetching data from: ${url}`);

    try {
      // Make request with rate limiting
      const response = await limiter.schedule(() =>
        axios.get(url, {
          headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        })
      );

      // Update the limiter settings based on rate limit headers
      updateLimiterSettings(response);

      // Process data
      console.log(`📊 Processing page ${page}...`);
      const parsedGitHubData = response.data.items.map((repo, index) => ({
        id: repo.id,
        rank: rank + index,
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

      // Increment rank for next batch
      rank += parsedGitHubData.length;

      console.log(
        `📦 Page ${page}: Processed ${parsedGitHubData.length} repositories.`
      );

      // Save to database
      console.log(
        `🏪 Page ${page}: Updating database with ${parsedGitHubData.length} results.`
      );

      // TODO we are only writing to the database, at some point we need to clear old data
      await Repo.bulkWrite(
        parsedGitHubData.map((repo) => ({
          updateOne: {
            filter: { id: repo.id },
            update: { $set: repo },
            upsert: true,
          },
        }))
      );

      // Stop if fewer than 100 results
      if (parsedGitHubData.length < 100 || page === 10) {
        console.log(
          '🔚 Fewer than 100 results returned OR page 10 reached. Stopping pagination.'
        );
        break;
      }
      page++;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error('⏳ Rate limit exceeded. Retrying...');
        const retryAfter =
          parseInt(error.response.headers['retry-after'], 10) * 1000 || 60000; // Default to 60s
        await sleep(retryAfter);
      } else {
        console.error('☠️ API Error:', {
          Status: error.response?.status || 'Unknown',
          Code: error.code || 'Unknown',
        });
        break; // Exit if it's not a rate limit error
      }
    }
  }

  console.log('✅ GitHub trending data fetch complete.');
}
