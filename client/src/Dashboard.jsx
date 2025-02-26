import { useEffect, useState } from 'react';
import axios from 'axios';
import TrendingRepos from './components/TrendingRepos';
import Aggregates from './components/Aggregates';

function Dashboard() {
  // Setup a use state for the repos
  const [repos, setRepos] = useState([]);
  // Setup a use state for the aggregates
  const [aggregates, setAggregates] = useState(null);

  // Setup a use effect to get data from the server on component mount
  useEffect(() => {
    axios
      .get('http://localhost:9001/api/github/trending')
      .then((response) => {
        setRepos(response.data.getGitHubData);
        setAggregates(response.data.getGitHubAggregate);
      })
      .catch((error) => console.error('Error fetching trending repos:', error));
  }, []);

  return (
    <div>
      <TrendingRepos repos={repos} />
      <Aggregates aggregates={aggregates} />
    </div>
  );
}

export default Dashboard;
