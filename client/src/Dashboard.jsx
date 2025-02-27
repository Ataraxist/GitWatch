import React, { Suspense, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Switch from 'react-switch';
import {
  ArrowDownFromLine,
  ArrowUpToLine,
  ChartLine,
  Filter,
  FilterX,
  Moon,
  Sun,
} from 'lucide-react';
import Aggregates from './components/Aggregates';
import { startShootingStars } from './helpers/shootingStar.js';
import { createStars } from './helpers/createStars.js';

const LazyRepo = React.lazy(() => import('./components/TrendingRepos.jsx'));

function Dashboard() {
  // Use states...
  const [repos, setRepos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [displayedRepos, setDisplayedRepos] = useState(1);
  const [showCharts, setShowCharts] = useState(closed);
  const [showSearch, setShowSearch] = useState(closed);
  const [search, setSearch] = useState('');

  // Use effect to get data from the server on component mount
  useEffect(() => {
    axios
      .get('http://localhost:9001/api/github/trending')
      .then((response) => {
        setRepos(response.data.getGitHubData);
      })
      .catch((error) => console.error('Error fetching trending repos:', error));
    // Make stars!
    let starsContainer = createStars();
    let shootingStarInterval = startShootingStars();
    // Cleanup
    return () => {
      if (shootingStarInterval) clearInterval(shootingStarInterval);
      starsContainer.remove();
    };
  }, []);
  // Dark & Light mode on click handler
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };
  // Use effect to toggle modes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);
  // Lazy Loader show next 20 logic
  const loadMoreRef = useRef(null);
  useEffect(() => {
    // Lazy Loading Logic
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedRepos((prev) => Math.min(prev + 5));
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [repos, displayedRepos]);
  // ! WHAT DOES THIS DO??? We are searching all fields simultaneously, but like... how?
  const filteredRepos = repos.filter((repo) =>
    [
      repo.name,
      // repo.owner?.login,
      repo.description,
      repo.language,
      // repo.html_url, // URL of the repository
      // repo.owner?.html_url, // URL of the owner
      // repo.stargazers_count?.toString(), // Number of stars (convert to string for search)
      // repo.forks_count?.toString(), // Number of forks
      // repo.open_issues_count?.toString(), // Open issues count
      repo.created_at, // Creation date
      // repo.updated_at, // Last updated date
    ].some(
      (field) => field && field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className='dashboard'>
      {/* Search Button (Bar inside here too) */}
      <div className="search-container">
        <button
          className={`search-button ${showSearch ? 'expanded' : ''}`}
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? (
            <FilterX size={40} className='stat-badge' />
          ) : (
            <Filter size={40} className='stat-badge' />
          )}
        </button>
        {showSearch && (
          <input
            type='text'
            className='search-input'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search...'
            autoFocus
          />
        )}
      </div>

      {/* Chart Toggle Button */}
      <button
        className='chart-button'
        onClick={() => setShowCharts(!showCharts)}
      >
        {showCharts ? (
          <ArrowUpToLine size={40} className='stat-badge' />
        ) : (
          <ChartLine size={40} className='stat-badge' />
        )}
      </button>

      {/* Chart Container */}
      <div className={`charts-container ${showCharts ? 'open' : 'closed'}`}>
        <Aggregates repos={repos} onSearchChange={setSearch} />
      </div>

      <h1 className='title'>New Git Repos</h1>
      <p>From the last 7 days</p>

      {/* Dark Mode Toggle */}
      <div className='darkMode-toggle'>
        <Switch
          onChange={toggleTheme}
          checked={isDarkMode}
          onColor='#222'
          offColor='#ccc'
          uncheckedIcon={<Sun size={16} style={{ marginLeft: '6px' }} />}
          checkedIcon={<Moon size={16} style={{ marginLeft: '6px' }} />}
          height={29}
          width={53}
        />
      </div>

      {/* Lazy Loaded Repos */}
      <Suspense fallback='Loading...'>
        {repos.length > 0 ? (
          <LazyRepo repos={filteredRepos.slice(0, displayedRepos)} />
        ) : (
          <p>Server came back empty. ¯\_(ツ)_/¯ </p>
        )}
      </Suspense>

      {/* Infinite Scroll Loader */}
      <div ref={loadMoreRef} style={{ height: '20px', textAlign: 'center' }}>
        {displayedRepos < repos.length && (
          <p>Searching for extraterrestrials...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
