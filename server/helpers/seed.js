import { fetchGitHubTrendingData } from './fetchGitHubTrendingData.js';

(async () => {
  try {
    console.log('🌱 Seeding the database with historical GitHub data...');
    await fetchGitHubTrendingData(7);
    console.log('⛈️ Database seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  }
})();
