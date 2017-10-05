import { getSetting } from './settings.js';

export const debug = function() {
  if (getSetting('debug', false)) {
    console.log.apply(null, arguments);
  }
}