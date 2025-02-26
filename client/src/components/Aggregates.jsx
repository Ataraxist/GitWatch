import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Aggregates({ aggregates }) {
  const {
    timestamp = null,
    languageCounts = [],
    forkDistribution = {},
    issueDistribution = {},
    ownerCounts = [],
    ageDistribution = {},
    starDistribution = {},
  } = aggregates || {};

  const languageData = {
    labels: languageCounts.slice(0, 5).map((lang) => lang.language),
    datasets: [
      {
        label: 'Top 5 Languages',
        data: languageCounts.slice(0, 5).map((lang) => lang.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  const forkData = {
    labels: Object.keys(forkDistribution),
    datasets: [
      {
        label: 'Fork Distribution',
        data: Object.values(forkDistribution),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  const issueData = {
    labels: Object.keys(issueDistribution),
    datasets: [
      {
        label: 'Issue Distribution',
        data: Object.values(issueDistribution),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const ownerData = {
    labels: ownerCounts.slice(0, 5).map((owner) => owner.owner),
    datasets: [
      {
        label: 'Top 5 Owners',
        data: languageCounts.slice(0, 5).map((owner) => owner.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  const ageData = {
    labels: Object.keys(ageDistribution),
    datasets: [
      {
        label: 'Age Distribution',
        data: Object.values(ageDistribution),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  const starData = {
    labels: Object.keys(starDistribution),
    datasets: [
      {
        label: 'Star Distribution',
        data: Object.values(starDistribution),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='aggregate-charts'>
        {/* <div className='chart'>
        <Bar data={languageData} options={{ responsive: true }} />
        </div> */}
        <div className='chart'>
          <Bar data={forkData} options={{ responsive: true }} />
        </div>
        <div className='chart'>
          <Bar data={issueData} options={{ responsive: true }} />
        </div>
        <div className='chart'>
          <Bar data={ageData} options={{ responsive: true }} />
        </div>
        <div className='chart'>
          <Bar data={starData} options={{ responsive: true }} />
        </div>
        {/* <div className='chart'>
        <Bar data={ownerData} options={{ responsive: true }} />
        </div> */}
    </div>
  );
}

export default Aggregates;
