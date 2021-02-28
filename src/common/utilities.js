export const capitalizeFirst = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const addCurrencySymbol = price => {
  return price + ' $';
};
