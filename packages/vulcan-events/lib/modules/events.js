import { addCallback } from 'meteor/vulcan:core';

export const initFunctions = [];

export const trackFunctions = [];

export const addInitFunction = func => {
  initFunctions.push(func);
  // execute init function as soon as possible
  func();  
};

export const addTrackFunction = func => {
  trackFunctions.push(func);
};

export const track = (eventName, eventProperties) => {
  trackFunctions.forEach(f => {
    f(eventName, eventProperties);
  });
}

export const addIdentifyFunction = func => {
  addCallback('events.identify', func);
};

export const addPageFunction = func => {
  addCallback('router.onUpdate', (empty, route) => func(route));
};
