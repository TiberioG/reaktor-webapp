export const capitalizeFirst = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getColumnWidth = (rows, accessor, headerText) => {
  const maxWidth = 400;
  const magicSpacing = 10;
  const cellLength = Math.max(...rows.map(row => (`${row[accessor]}` || '').length), headerText.length);
  return Math.min(maxWidth, cellLength * magicSpacing);
};

export const addCurrencySymbol = price => {
  return price + ' $';
};
