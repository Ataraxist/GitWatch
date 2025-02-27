// Utility function to get the date N days ago in YYYY-MM-DD format
export function getDateNDaysAgo(n) {
  console.log(`📅 Calculating date ${n} days ago...`);
  
  const date = new Date();
  date.setDate(date.getDate() - n);

  const formattedDate = date.toISOString().split('T')[0];
  console.log(`✅ Computed date: ${formattedDate}`);

  return formattedDate;
}
