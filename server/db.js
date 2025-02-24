// import mongoose to enforce schema requirements
import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/trendingDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection error:', error));

// Define a schema for GitHub repository data
const RepoSchema = new mongoose.Schema({
  id: Number,
  name: String,
  full_name: String,
  html_url: String,
  owner: {
    login: String,
    avatar_url: String,
    html_url: String
  },
  stargazers_count: Number,
  forks_count: Number,
  open_issues_count: Number,
  language: String,
  created_at: Date,
  updated_at: Date,
  description: String
});

const Repo = mongoose.model('Repo', RepoSchema);

// Create a model using the schema
export const Repository = mongoose.model('Repository', repositorySchema);
