export const getCookie = (cookieString: string, key: string): string | null => {
  if(!cookieString) {
    return null;
  }

  const cookie = cookieString.split(';')
    .map(s => s.trim().split('='))
    .find(([keyName, _value]) => key === keyName);

  return cookie ? cookie[1] : null;
};
