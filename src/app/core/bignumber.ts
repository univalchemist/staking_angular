import BigNumber from 'bignumber.js';

export function valueToBigNumber(amount: BigNumber.Value): BigNumber {
  BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

  return new BigNumber(amount);
}

const bn10PowLookupMap: Map<number, BigNumber> = new Map<number, BigNumber>([]);

export function pow10(decimals: number): BigNumber {
  if (!bn10PowLookupMap.has(decimals)) {
    bn10PowLookupMap.set(decimals, new BigNumber(10).pow(decimals));
  }

  return bn10PowLookupMap.get(decimals) as BigNumber;
}

export function normalizeValue(
  value: BigNumber.Value,
  decimals: number = 18
): string {
  return normalizeBN(value, decimals).toString(10);
}

export function normalizeBN(
  value: BigNumber.Value,
  decimals: number = 18
): BigNumber {
  return valueToBigNumber(value).dividedBy(pow10(decimals));
}

export function convertToDecimals(
  value: BigNumber.Value,
  decimals: number = 18
): string {
  return valueToBigNumber(value || 0)
    .multipliedBy(valueToBigNumber(10).pow(decimals))
    .dp(0)
    .toString(10);
}
