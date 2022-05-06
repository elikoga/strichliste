export const renderMoney = (value: number): string => {
  return `${(value / 100).toFixed(2)} €`;
};

export default renderMoney;
