import { initFunctions } from '../modules/index.js';

export const addInitFunction = fn => {
  initFunctions.push(fn); // on server, this does nothing
  // on server, execute init function as soon as possible
  fn();
};