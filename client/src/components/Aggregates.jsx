import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function Aggregates({ repos }) {
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
  // Get the data for the scatter plot
  const scatterStarData = {
    datasets: [
      {
        label: 'Stars per Repo',
        data: repos.map((repo) => ({
          x: new Date(repo.created_at),
          y: repo.stargazers_count,
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
          unit: 'month',
          tooltipFormat: 'yyyy-MM',
          displayFormats: {
            month: 'yyyy-MM',
          },
        },
        title: { display: true, text: 'Created Date (Year-Month)' },
      },
      y: {
        title: { display: true, text: 'Stargazer Count' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='aggregate-charts'>
      <div className='chart'>
        <Scatter data={scatterStarData} options={scatterStarOptions} />
      </div>
      <div className='chart'>
        <Bar data={barLanguageData} options={barLanguageOptions} />
      </div>
    </div>
  );
}

export default Aggregates;
