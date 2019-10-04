import { getSetting } from './settings.js';

export const debug = function () {
  if (getSetting('debug', false)) {
    // eslint-disable-next-line no-console
    console.log.apply(null, arguments);
  }
};

export const debugGroup = function () {
  if (getSetting('debug', false)) {
    // eslint-disable-next-line no-console
    console.groupCollapsed.apply(null, arguments);
  }
};
export const debugGroupEnd = function () {
  if (getSetting('debug', false)) {
    // eslint-disable-next-line no-console
    console.groupEnd.apply(null, arguments);
  }
};

// Show a deprecation message, with a version so we keep track of deprecated features
export const deprecate = (nextVulcanVersion, message) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`DEPRECATED (${nextVulcanVersion}):`, message);
  }
};