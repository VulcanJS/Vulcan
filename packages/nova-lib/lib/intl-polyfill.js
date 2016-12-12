/*

intl polyfill. See https://github.com/andyearnshaw/Intl.js/

*/

import { getSetting } from './settings.js';

var areIntlLocalesSupported = require('intl-locales-supported');

var localesMyAppSupports = [
  getSetting("locale", "en")
];

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.
    var IntlPolyfill = require('intl');
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}