import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  const languageData = languageCounts
    .map((language) => ({
      name: language.language,
      value: language.count,
    }))
    .slice(0, 5);
  const forkData = Object.entries(forkDistribution).map(([range, count]) => ({
    name: range,
    value: count,
  }));
  const issueData = Object.entries(issueDistribution).map(([range, count]) => ({
    name: range,
    value: count,
  }));
  const ownerData = ownerCounts
    .map((owner) => ({
      name: owner.owner,
      value: owner.count,
    }))
    .slice(0, 5);
  const ageData = Object.entries(ageDistribution).map(([range, count]) => ({
    name: range,
    value: count,
  }));
  const starData = Object.entries(starDistribution).map(([range, count]) => ({
    name: range,
    value: count,
  }));

  return (
    <div className='aggregate-charts'>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={languageData}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='blue' />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={forkData}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='blue' />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={issueData}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='blue' />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={ageData}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='blue' />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={300} height={200}>
        <BarChart data={starData}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='blue' />
        </BarChart>
      </ResponsiveContainer>
      {/* <div>{JSON.stringify(timestamp, null, 2)}</div> */}
      {/* <div>{JSON.stringify(languageCounts, null, 2)}</div> */}
      {/* <div>{JSON.stringify(forkDistribution, null, 2)}</div> */}
      {/* <div>{JSON.stringify(issueDistribution, null, 2)}</div> */}
      {/* <div>{JSON.stringify(ownerCounts, null, 2)}</div> */}
      {/* <div>{JSON.stringify(ageDistribution, null, 2)}</div> */}
      {/* <div>{JSON.stringify(starDistribution, null, 2)}</div> */}
    </div>
  );
}

export default Aggregates;
