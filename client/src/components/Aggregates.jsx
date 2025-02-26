function Aggregates({ aggregates }) {
  return (
    <div style={{ flex: 1 }}>
      <h2>GitHub Data Aggregates</h2>
      {aggregates ? (
        <pre>{JSON.stringify(aggregates, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Aggregates;
