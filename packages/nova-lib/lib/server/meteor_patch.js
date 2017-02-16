import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import { Utils } from '../modules/index.js';

// our bindEnvironment keep the original function and auto rename the return function
export const bindEnvironment = (fn) => {
  const newfn = Meteor.bindEnvironment(fn);
  newfn.fn = fn;
  if (newfn.fn.name) {
    Utils.defineName(newfn, `${newfn.fn.name}_bindEnvironment`);
  }
  return newfn;
};

// clever webAppConnectHandlersUse
export const webAppConnectHandlersUse = (name, route, fn, options) => {
  // init
  if (typeof name === 'function') {
    options = route;
    fn = name;
    route = '/';
    name = undefined;
  } else if (name[0] === '/') {
    options = fn;
    fn = route;
    route = name;
    name = undefined;
  } else if (typeof route === 'function') {
    options = fn;
    fn = route;
    route = '/';
  }
  options = options || {};
  route = options.route ? options.route : route;

  // newfn
  let done = false;
  const newfn = (req, res, next) => {
    if (!fn.stack && !fn._router && done && options.once) {
      next();
      return;
    }
    done = true;

    fn(req, res, next);

    if (!fn.stack && !fn._router && options.autoNext) {
      next();
    }
  };

  // use it
  let connectHandlers;
  if (options.raw) {
    connectHandlers = WebApp.rawConnectHandlers;
  } else {
    connectHandlers = WebApp.connectHandlers;
  }
  connectHandlers.use(route, newfn);

  // get handle
  let handle;
  if (options.unshift) {
    const item = connectHandlers.stack.pop();
    connectHandlers.stack.unshift(item);
    handle = connectHandlers.stack[0].handle;
  } else {
    handle = connectHandlers.stack[connectHandlers.stack.length - 1].handle;
  }

  // copy options to handle
  Object.keys(options).forEach((key) => {
    handle[key] = options[key];
  });

  // get original fn
  handle.fn = options.fn || fn;

  // rename
  name = options.name || name || (options.fn && options.fn.name) || fn.name;
  Utils.defineName(handle, name || '__webAppConnectHandlersUse_newfn__');
};

webAppConnectHandlersUse(function sortConnectHandlersMiddleware(req, res, next) {
  WebApp.rawConnectHandlers.stack.forEach((item) => {
    if (isNaN(item.handle.order)) {
      item.handle.order = 100;
    }
  });
  WebApp.connectHandlers.stack.forEach((item) => {
    if (isNaN(item.handle.order)) {
      item.handle.order = 100;
    }
  });
  WebApp.rawConnectHandlers.stack.sort((a, b) => a.handle.order - b.handle.order);
  WebApp.connectHandlers.stack.sort((a, b) => a.handle.order - b.handle.order);
}, { order: 0, autoNext: true, once: true, unshift: true });
