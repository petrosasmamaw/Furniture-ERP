// Simple converter to get the current Ethiopian date string.
// This uses the Gregorian date and calculates Ethiopian year/month/day
// based on the Ethiopian new year starting on September 11 (Gregorian),
// with leap adjustments handled implicitly.

export function ethiopianNow() {
  const g = new Date();
  const gYear = g.getFullYear();

  // Ethiopian new year usually falls on Sep 11 (Gregorian), or Sep 12 in Gregorian leap years.
  // For our simple conversion we'll use Sep 11 as the epoch reference.
  let start = new Date(gYear, 8, 11); // months are 0-based; 8 == September
  let ethYear;
  let dayOfYear;

  if (g >= start) {
    ethYear = gYear - 7;
    dayOfYear = Math.floor((g - start) / (24 * 60 * 60 * 1000));
  } else {
    start = new Date(gYear - 1, 8, 11);
    ethYear = gYear - 8;
    dayOfYear = Math.floor((g - start) / (24 * 60 * 60 * 1000));
  }

  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  const monthNames = ['Meskerem','Tikimt','Hidar','Tahsas','Tir','Yekatit','Megabit','Miazia','Ginbot','Sene','Hamle','Nehasse','Pagume'];
  const monthName = monthNames[(month - 1) % monthNames.length] || 'Pagume';

  return {
    year: ethYear,
    month,
    day,
    monthName,
    toString() {
      return `${day} ${monthName} ${ethYear}`;
    }
  };
}

export default ethiopianNow;
