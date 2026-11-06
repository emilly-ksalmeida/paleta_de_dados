export function isValidBirthDateInput(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || year > 2099) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
