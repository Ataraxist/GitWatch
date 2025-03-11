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
  // console.log('🚀 Dashboard component mounted.');

  // Use states...
  const [repos, setRepos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [displayedRepos, setDisplayedRepos] = useState(15);
  const [showCharts, setShowCharts] = useState(closed);
  const [showSearch, setShowSearch] = useState(closed);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch GitHub trending data on component mount
  useEffect(() => {
    // console.log('📡 Fetching trending repos from server...');
    axios
      .get('https://gitwatch-api.ataraxi.st/api/github/trending')
      .then((response) => {
        // console.log(`📦 Received ${response.data.getGitHubData.length} repositories.`);
        setRepos(response.data.getGitHubData);
      })
      .catch((error) =>
        console.error('☠️ Error fetching trending repos:', error)
      );

    // Make stars!
    // console.log('✨ Creating star background animation...');
    let starsContainer = createStars();
    let shootingStarInterval = startShootingStars();

    // Cleanup
    return () => {
      // console.log('🧹 Cleaning up star animations...');
      if (shootingStarInterval) clearInterval(shootingStarInterval);
      starsContainer.remove();
    };
  }, []);

  // Dark & Light mode toggle
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    // console.log(`🌗 Toggling theme: ${newTheme}`);
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme change when `isDarkMode` updates
  useEffect(() => {
    // console.log(`🎨 Applying ${isDarkMode ? 'dark' : 'light'} mode...`);
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Restart shooting stars when dark mode is enabled
    let shootingStarInterval;
    if (isDarkMode) {
      // console.log('🌙 Dark mode enabled. Restarting shooting stars...');
      shootingStarInterval = startShootingStars();
    }

    return () => {
      // console.log('🛑 Stopping shooting stars...');
      if (shootingStarInterval) clearInterval(shootingStarInterval);
    };
  }, [isDarkMode]);

  // Lazy Loader logic for infinite scroll
  const loadMoreRef = useRef(null);
  useEffect(() => {
    // console.log('🔍 Setting up infinite scroll observer...');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          // console.log('⬇️ Loading more repositories...');
          setDisplayedRepos((prev) => Math.min(prev + 5));

          setTimeout(() => setLoading(false), 1000);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      // console.log('🛑 Disconnecting infinite scroll observer...');
      if (observer) observer.disconnect();
    };
  }, [loading]);

  // Complex search across selected fields
  // console.log(`🔎 Filtering repositories with search query: "${search}"`);
  const filteredRepos = repos.filter((repo) =>
    [
      repo.name,
      repo.description,
      repo.language,
      repo.created_at, // Creation date
    ].some(
      (field) => field && field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className='dashboard'>
      {/* Search Button (Bar inside here too) */}
      <div className='search-container'>
        <button
          className={`search-button ${showSearch ? 'expanded' : ''}`}
          onClick={() => {
            // console.log(`🔍 Toggling search bar: ${!showSearch}`);
            setShowSearch(!showSearch);
          }}
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
        onClick={() => {
          // console.log(`📊 Toggling chart display: ${!showCharts}`);
          setShowCharts(!showCharts);
        }}
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
