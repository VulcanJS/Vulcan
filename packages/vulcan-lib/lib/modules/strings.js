export const Strings = {};

export const Domains = {};

export const addStrings = (language, strings) => {
  if (typeof Strings[language] === 'undefined') {
    Strings[language] = {};
  }
  Strings[language] = {
    ...Strings[language],
    ...strings
  };
};

export const registerDomain = (locale, domain) => {
  Domains[domain] = locale;
}