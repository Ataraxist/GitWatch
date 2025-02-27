import React, { Suspense, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Switch from 'react-switch';
import { ArrowDownFromLine, ArrowUpToLine, Moon, Sun } from 'lucide-react';
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

  return (
    <div className='dashboard'>
      <button
        className='chart-button'
        onClick={() => setShowCharts(!showCharts)}
      >
        {showCharts ? (
          <ArrowUpToLine size={40} className='stat-badge' />
        ) : (
          <ArrowDownFromLine size={40} className='stat-badge' />
        )}
      </button>
      <div className={`charts-container ${showCharts ? 'open' : 'closed'}`}>
        <Aggregates repos={repos} />
      </div>
      <h1>Top GitHub Repos</h1>
      <div className='darkMode-toggle'>
        <Switch
          onChange={toggleTheme}
          checked={isDarkMode}
          onColor='#222'
          offColor='#ccc'
          uncheckedIcon={<Sun size={16} style={{ marginLeft: '6px' }} />}
          checkedIcon={<Moon size={16} style={{ marginLeft: '6px' }} />}
          height={24}
          width={48}
        />
      </div>
      <Suspense fallback='Loading...'>
        {repos.length > 0 ? (
          <LazyRepo repos={repos.slice(0, displayedRepos)}></LazyRepo>
        ) : (
          <p>Server came back empty. ¯\_(ツ)_/¯ </p>
        )}
      </Suspense>
      <div ref={loadMoreRef} style={{ height: '20px', textAlign: 'center' }}>
        {displayedRepos < repos.length && <p>Loading more...</p>}
      </div>
    </div>
  );
}

export default Dashboard;
