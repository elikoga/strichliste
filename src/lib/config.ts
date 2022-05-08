export const currencySymbol: string = import.meta.env.VITE_CURRENCY_SYMBOL || '€';
export const currencyIsPrefixed: boolean = import.meta.env.VITE_CURRENCY_IS_PREFIXED === 'true';
export const currencyDecimals: number = import.meta.env.VITE_CURRENCY_DECIMALS || 2;
export const currencyDenominations: number[] = (() => {
  const denominations = import.meta.env.VITE_CURRENCY_DENOMINATIONS || '50,100,200,500';
  return denominations.split(',').map(Number);
})();
export const language: string = import.meta.env.VITE_LANGUAGE || 'de';
