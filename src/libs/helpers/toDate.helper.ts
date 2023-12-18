export default function toDateHelper(date: string | Date): Date {
  let dateObj;
  // We need to check if the date is already a date object
  if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);

    // If the date is invalid, early exit with an error
    if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
  }

  // we need to get the date, excluding the time
  // so we can compare it to the date in the database
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCDate();
  const day = dateObj.getUTCDate();

  // return a new date object with the date, but not the time
  return new Date(year, month, day, 0, 0, 0, 0);
}
