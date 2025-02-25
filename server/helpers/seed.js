import { fetchGitHubTrendingData } from './fetchGitHubTrendingData.js';
import { updateGitHubAggregate } from './updateGitHubAggregate.js';

(async () => {
  try {
    console.log('🌱 Seeding the database with historical GitHub data...');
    await fetchGitHubTrendingData(7);
    console.log('⛈️ Database seeding completed successfully.');
    console.log('🧑‍🌾 Asking aggregate function to do stuff...');
    await updateGitHubAggregate();
    console.log('🌻 Seeding process completed successfully.');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  }
})();
