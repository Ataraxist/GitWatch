import { GitHubAggregate, Repo } from '../db.js';

export async function updateGitHubAggregate() {
  console.log('📊 Updating GitHub Aggregate Data...');

  try {
    // Fetch trending GitHub repositories from Mongo
    const repos = await Repo.find();
    console.log('📂 Repositories fetched for aggregation:', repos.length);
    console.log('🔍 Sample Repo:', repos[0]); // Check structure of retrieved repo
    // Initialize empty objects for various counts
    const languageCounts = {};
    const forkDistribution = {
      '1-10': 0,
      '11-50': 0,
      '51-200': 0,
      '201+': 0,
    };
    const issueDistribution = {
      0: 0,
      '1-10': 0,
      '11-50': 0,
      '51-200': 0,
      '201+': 0,
    };
    const repoOwners = {};
    const ageDistribution = {
      '<1 Year Old': 0,
      '1 Year Old': 0,
      '2 Years Old': 0,
      '3 Years Old': 0,
      '4 Years Old': 0,
      '5+ Years Old': 0,
    };
    const starDistribution = {
      '1-10': 0,
      '11-50': 0,
      '51-200': 0,
      '201-1000': 0,
      '1001+': 0,
    };
    // Get current Year for the Age Distribution
    const currentYear = new Date().getFullYear();
    // Loop through each repository and update counts

    repos.forEach((repo) => {
      // Handle when the repo has no language
      if (repo.language) {
        // Count Languages
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
      // Count Fork Distribution
      if (repo.forks_count <= 10) forkDistribution['1-10']++;
      else if (repo.forks_count <= 50) forkDistribution['11-50']++;
      else if (repo.forks_count <= 200) forkDistribution['51-200']++;
      else forkDistribution['201+']++;
      // Count Issue Distribution
      if (repo.open_issues_count === 0) issueDistribution['0']++;
      else if (repo.open_issues_count <= 10) issueDistribution['1-10']++;
      else if (repo.open_issues_count <= 50) issueDistribution['11-50']++;
      else if (repo.open_issues_count <= 200) issueDistribution['51-200']++;
      else issueDistribution['201+']++;
      // Count Repos by Owner
      repoOwners[repo.owner.login] = (repoOwners[repo.owner.login] || 0) + 1;
      // Calculate repository age
      const repoYear = new Date(repo.created_at).getFullYear();
      const repoAge = currentYear - repoYear;
      // Assign repository to an age bin
      if (!isNaN(repoAge)) {
        if (repoAge < 1) ageDistribution['<1 Year Old']++;
        else if (repoAge === 1) ageDistribution['1 Year Old']++;
        else if (repoAge === 2) ageDistribution['2 Years Old']++;
        else if (repoAge === 3) ageDistribution['3 Years Old']++;
        else if (repoAge === 4) ageDistribution['4 Years Old']++;
        else ageDistribution['5+ Years Old']++;
      }
      // Count Star Distribution
      if (repo.stargazers_count <= 10) starDistribution['1-10']++;
      else if (repo.stargazers_count <= 50) starDistribution['11-50']++;
      else if (repo.stargazers_count <= 200) starDistribution['51-200']++;
      else if (repo.stargazers_count <= 1000) starDistribution['201-1000']++;
      else starDistribution['1001+']++;
    });
    // Convert the language count object into an array of arrays
    // { JavaScript: 10, Python: 5 } >>> [ ['JavaScript', 10], ['Python', 5] ]
    const sortedLanguages = Object.entries(languageCounts)
      // Compare the  count. If the count of b is greater, it moves b before a in the sorted array.
      .sort((a, b) => b[1] - a[1])
      // Convert the array or arrays into an array of objects
      // [['JavaScript', 10], ['TypeScript', 7]] >>> [{ language: 'JavaScript', count: 10 }, { language: 'TypeScript', count: 7 }]
      .map(([language, count]) => ({ language, count }));

    // Sort repository owners by count (client will handle slicing)
    const sortedRepoOwners = Object.entries(repoOwners)
      .sort((a, b) => b[1] - a[1])
      .map(([owner, count]) => ({ owner, count }));

    await GitHubAggregate.deleteMany({}); // Clear previous data
    await GitHubAggregate.create({
      languageCounts: sortedLanguages,
      forkDistribution,
      issueDistribution,
      ownerCounts: sortedRepoOwners,
      ageDistribution,
      starDistribution,
    });

    console.log('🌽 GitHub Aggregate Data Updated!');
  } catch (error) {
    console.error('❌ Error updating GitHub Aggregate:', error);
  }
}
