export function getPath(urlString) {
  return urlString.replace(/\/[^\/]*$/, '');
}
