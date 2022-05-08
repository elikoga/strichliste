import { currencySymbol, currencyIsPrefixed, currencyDecimals } from './config';

export const renderMoney = (value: number): string => {
  const prefix = currencyIsPrefixed ? currencySymbol + ' ' : '';
  const suffix = currencyIsPrefixed ? '' : ' ' + currencySymbol;
  const formatted = (value / Math.pow(10, currencyDecimals)).toFixed(currencyDecimals);
  return prefix + formatted + suffix;
};

export const unknownMoney: string = (() => {
  const prefix = currencyIsPrefixed ? currencySymbol + ' ' : '';
  const suffix = currencyIsPrefixed ? '' : ' ' + currencySymbol;
  return prefix + '?' + suffix;
})();

export default renderMoney;
