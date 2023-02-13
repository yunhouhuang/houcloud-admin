export const safeMobile = (mobile: string): string => {
  if (!mobile) {
    return '';
  }
  if (mobile.length < 11) {
    return mobile;
  }
  return mobile.replace(/(\d{3})\d*(\d{4})/, '$1***$2');
};
