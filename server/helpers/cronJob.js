import cron from 'node-cron';
import { updateGitHubAggregate } from './updateGitHubAggregate.js';
import { fetchGitHubTrendingData } from './fetchGitHubTrendingData.js';

// Run new trending data fetch daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('⏳ Running scheduled GitHub API Fetch update...');
    await fetchGitHubTrendingData(7);
    await updateGitHubAggregate();
});
