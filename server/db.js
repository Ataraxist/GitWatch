// import mongoose to enforce schema requirements
import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/trendingDB';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define a schema for GitHub repository data
const RepoSchema = new mongoose.Schema({
  id: Number,
  name: String,
  full_name: String,
  html_url: String,
  owner: {
    login: String,
    avatar_url: String,
    html_url: String,
  },
  stargazers_count: Number,
  forks_count: Number,
  open_issues_count: Number,
  language: String,
  created_at: Date,
  updated_at: Date,
  description: String,
});
const Repo = mongoose.model('Repo', RepoSchema);

// Define a schema for GitHub Aggregate data
// const GitHubAggregateSchema = new mongoose.Schema({
//   timestamp: { type: Date, default: Date.now },
//   languageCounts: [{ language: String, count: Number }],
//   forkDistribution: {
//     '1-10': Number,
//     '11-50': Number,
//     '51-200': Number,
//     '201+': Number,
//   },
//   issueDistribution: {
//     0: Number,
//     '1-10': Number,
//     '11-50': Number,
//     '51-200': Number,
//     '201+': Number,
//   },
//   ownerCounts: [{ owner: String, count: Number }],
//   ageDistribution: {
//     '<1 Year Old': Number,
//     '1 Year Old': Number,
//     '2 Years Old': Number,
//     '3 Years Old': Number,
//     '4 Years Old': Number,
//     '5+ Years Old': Number,
//   },
//   starDistribution: {
//     '1-10': Number,
//     '11-50': Number,
//     '51-200': Number,
//     '201-1000': Number,
//     '1001+': Number,
//   },
// });
// const GitHubAggregate = mongoose.model(
//   'GitHubAggregate',
//   GitHubAggregateSchema
// );

export default Repo;
