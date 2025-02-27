import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useRef } from 'react';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);

function Aggregates({ repos, onSearchChange }) {
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);

  // Get a count of each language
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  // Sort the languages by making it an array, then sorting, then slicing
  const sortedLanguages = Object.entries(languageCounts)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  // Convert the array into a bar chart (top 50 only)
  const barLanguageData = {
    labels: sortedLanguages.map((language) => language.language),
    datasets: [
      {
        label: 'Count by Language',
        data: sortedLanguages.map((language) => language.count),
      },
    ],
  };
  // Set bar chart options
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
  // Get the data for the scatter plot
  const scatterStarData = {
    datasets: [
      {
        label: 'Stars per Repo',
        data: repos.map((repo) => ({
          x: new Date(repo.created_at),
          y: repo.stargazers_count,
          fullDate: repo.created_at,
        })),
        // backgroundColor: 'blue',
      },
    ],
  };
  // Set the options for the scatter plot
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

  return (
    <div className='aggregate-charts'>
      <div className='chart'>
        <Scatter
          ref={scatterChartRef}
          data={scatterStarData}
          options={scatterStarOptions}
          onClick={handleStarClick}
        />
      </div>
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
