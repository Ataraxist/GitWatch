// import mongoose to enforce schema requirements
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

console.log('🛠️ Initializing MongoDB connection...');

const mongoURI = process.env.MONGO_URI;
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
console.log("🔍 GITHUB_TOKEN:", process.env.GITHUB_TOKEN);


// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Define a schema for GitHub repository data
const RepoSchema = new mongoose.Schema({
  id: Number, // Unique identifier for the repo
  rank: Number, // Rank of the repo in trending lists
  name: String, // Repo name
  full_name: String, // Full repo name (e.g., user/repo)
  html_url: String, // Link to the repo on GitHub
  owner: {
    login: String, // GitHub username of the repo owner
    avatar_url: String, // Profile picture URL
    html_url: String, // GitHub profile link
  },
  stargazers_count: Number, // Number of stars the repo has
  forks_count: Number, // Number of forks
  open_issues_count: Number, // Number of open issues
  language: String, // Primary programming language used
  created_at: Date, // Date repo was created
  description: String, // Repo description
  updated_at: { 
    type: Date, 
    default: Date.now, 
    expires: 691200 // 8 days in seconds (8 * 24 * 60 * 60)
  },
});

console.log('📜 Repo schema defined.');

const Repo = mongoose.model('Repo', RepoSchema);
console.log('✅ Repo model created.');

export default Repo;
