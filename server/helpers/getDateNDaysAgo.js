// Utility function to get the date N days ago in YYYY-MM-DD format
export function getDateNDaysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
}

// Utility function to get the Unix timestamp for N days ago
// export function getUnixTimestampNDaysAgo(n) {
//   const date = new Date();
//   date.setDate(date.getDate() - n);
//   return Math.floor(date.getTime() / 1000);
// }