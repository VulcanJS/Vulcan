import { addCallback } from 'meteor/vulcan:core';
import { initFunctions } from '../modules/index.js';

// on client, init function will be executed once App is ready
export const addInitFunction = fn => {
  initFunctions.push(fn);
};

function runInitFunctions(props) {
  initFunctions.forEach(f => {
    f(props);
  });
}
addCallback('app.mounted', runInitFunctions);
