export function formatNumber(number: number = 0) {
  let absNumber = Math.abs(number);
  const suffixes = ["", "K", "M", "B"];
  let suffixIndex = 0;

  while (absNumber >= 1000 && suffixIndex < suffixes.length - 1) {
    absNumber /= 1000;
    suffixIndex++;
  }
  const formattedNumber =
    (number < 0 ? "-" : "") + absNumber.toFixed(1) + suffixes[suffixIndex];
  return formattedNumber;
}

export function removeDecimals(number: number): number {
  return Number(Number(number).toFixed(0));
}
