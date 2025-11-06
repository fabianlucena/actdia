let l10n = {};
let language;

export function _(text, ...args) {
  return format(l10n[text] || text, ...args);
}

export function format(formatString, ...args) {
  return formatString.replace(/%s/g, () => args.shift());
}

export function addL10n(newL10n) {
  Object.assign(l10n, newL10n);
}

export async function loadLocale(url = '.') {
  if (!language) {
    language = navigator.language || navigator.userLanguage || 'en';
    language = language.toLowerCase().split('-')[0];
  }

  try {
    const l10n = (await import(`${url}/locale/${language}.js`)).default;
    addL10n(l10n);
  } catch {}
}