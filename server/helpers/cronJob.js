import cron from 'node-cron';
import { fetchGitHubTrendingData } from './fetchGitHubTrendingData.js';

console.log('⏰ Initializing cron job for GitHub trending data fetch...');

// Run new trending data fetch daily at midnight
cron.schedule('0 0,12 * * *', async () => {
  console.log('⏳ Running scheduled GitHub API Fetch update...');

  try {
    await fetchGitHubTrendingData(7);
    console.log('✅ GitHub API Fetch completed successfully.');
    console.log('🕒 Finished Running Cron Task...');
  } catch (error) {
    console.error('☠️ Error during scheduled GitHub API Fetch:', error);
  }

});

console.log('✅ Cron job scheduled: Runs twice daily at noon & midnight.');
