import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useRef } from 'react';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);

function Aggregates({ repos, onSearchChange }) {
  // References for the charts to access elements on click
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  // PROCESSING LANGUAGE DATA FOR BAR CHART
  // Get a count of each programming language
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  // Convert object to sorted array and take top 10 languages
  const sortedLanguages = Object.entries(languageCounts)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  // Format data for the bar chart
  const barLanguageData = {
    labels: sortedLanguages.map((language) => language.language),
    datasets: [
      {
        label: 'Count by Language',
        data: sortedLanguages.map((language) => language.count),
      },
    ],
  };
  // Configuration options for the bar chart
  const barLanguageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Language' },
      },
      y: {
        title: { display: true, text: 'Repo Count' },
        beginAtZero: true,
      },
    },
  };
  // Handle clicks on the bar chart to trigger a search by language
  const handleBarClick = (event) => {
    if (!barChartRef.current) return;
    const chart = barChartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      true
    );
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedLanguage = barLanguageData.labels[index];
      onSearchChange(selectedLanguage);
    }
  };
  // PROCESSING REPO STAR DATA FOR SCATTER PLOT
  // Format repository data for the scatter plot
  const scatterStarData = {
    datasets: [
      {
        label: 'Stars per Repo',
        data: repos.map((repo) => ({
          x: new Date(repo.created_at), // X-axis: Repo creation date
          y: repo.stargazers_count, // Y-axis: Number of stars
          fullDate: repo.created_at, // Store full date for filtering on click
        })),
      },
    ],
  };
  // Configuration options for the scatter plot
  const scatterStarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd',
          displayFormats: {
            day: 'MMM d',
          },
        },
        title: { display: true, text: 'Created Date (Last 7 Days)' },
      },
      y: {
        title: { display: true, text: 'Stargazer Count' },
        beginAtZero: true,
      },
    },
  };
  // Handle clicks on the scatter plot to trigger a search by creation date
  const handleStarClick = (event) => {
    if (!scatterChartRef.current) return;
    const chart = scatterChartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      true
    );
    if (elements.length > 0) {
      const index = elements[0].index;
      const datasetIndex = elements[0].datasetIndex;
      const selectedRepo = scatterStarData.datasets[datasetIndex].data[index];
      onSearchChange(selectedRepo.fullDate);
    }
  };
  // RENDER CHART COMPONENTS
  return (
    <div className='aggregate-charts'>
      {/* Scatter plot of repo stars over time */}
      <div className='chart'>
        <Scatter
          ref={scatterChartRef}
          data={scatterStarData}
          options={scatterStarOptions}
          onClick={handleStarClick}
        />
      </div>

      {/* Bar chart of top programming languages */}
      <div className='chart'>
        <Bar
          ref={barChartRef}
          data={barLanguageData}
          options={barLanguageOptions}
          onClick={handleBarClick}
        />
      </div>
    </div>
  );
}

export default Aggregates;
