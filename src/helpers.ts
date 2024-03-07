export function resolveWithDelay<T>(
  dataFn: () => T,
  delayMsLow: number,
  delayMsHigh?: number
): Promise<T> {
  delayMsHigh = delayMsHigh ?? delayMsLow;
  const delayMs =
    Math.floor(Math.random() * (delayMsHigh - delayMsLow + 1)) + delayMsLow;

  return new Promise<T>((resolve, _reject) => {
    setTimeout(() => {
      resolve(dataFn());
    }, delayMs);
  });
}
