import { addCallback } from 'meteor/vulcan:core';

export const initFunctions = [];

export const trackFunctions = [];

export const addInitFunction = f => {
  initFunctions.push(f);
  // execute init function as soon as possible
  f();  
};

export const addTrackFunction = f => {
  trackFunctions.push(f);
};

export const track = (eventName, eventProperties) => {
  trackFunctions.forEach(f => {
    f(eventName, eventProperties);
  });
}

export const addIdentifyFunction = f => {
  addCallback('events.identify', f);
};

export const addPageFunction = f => {
  const f2 = (empty, route) => f(route);

  // rename f2 to same name as f
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  const descriptor = Object.create(null); // no inherited properties
  descriptor.value = f.name;
  Object.defineProperty(f2, 'name', descriptor)

  addCallback('router.onUpdate', f2);
};
