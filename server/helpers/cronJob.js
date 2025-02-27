import cron from 'node-cron';
import { fetchGitHubTrendingData } from './fetchGitHubTrendingData.js';

console.log('⏰ Initializing cron job for GitHub trending data fetch...');

// Run new trending data fetch daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('⏳ Running scheduled GitHub API Fetch update...');

  try {
    await fetchGitHubTrendingData(7);
    console.log('✅ GitHub API Fetch completed successfully.');
  } catch (error) {
    console.error('☠️ Error during scheduled GitHub API Fetch:', error);
  }

  console.log('🕒 Finished Running Cron Task...');
  process.exit(0); // Exiting process after task completion
});

console.log('✅ Cron job scheduled: Runs daily at midnight.');
