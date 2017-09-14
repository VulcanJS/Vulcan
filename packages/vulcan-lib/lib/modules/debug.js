import { getSetting } from './settings.js';

export const debug = s => {
  if (getSetting('debug', false)) {
    console.log(s);
  }
}