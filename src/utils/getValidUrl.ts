export const getValidUrl = (url: string = ""): string => {
  let newUrl = window.decodeURIComponent(url);
  newUrl = newUrl.trim().replace(/\s/g, "");

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
};
