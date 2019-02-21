import { WebApp } from 'meteor/webapp';

// NOTE: simplified version of webAppConnectHandlersUse that doesn't do anything
// export const webAppConnectHandlersUse = (app, options) => {
//   WebApp.connectHandlers.use(app);
// };

// TODO: figure out if still needed?
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
};

// NOTE: breaks /graphql endpoint in production
// TODO: figure out what this does and if it's still needed?
// webAppConnectHandlersUse(function sortConnectHandlersMiddleware(req, res, next) {
//   WebApp.rawConnectHandlers.stack.forEach((item) => {
//     if (isNaN(item.handle.order)) {
//       item.handle.order = 100;
//     }
//   });
//   WebApp.connectHandlers.stack.forEach((item) => {
//     if (isNaN(item.handle.order)) {
//       item.handle.order = 100;
//     }
//   });
//   WebApp.rawConnectHandlers.stack.sort((a, b) => a.handle.order - b.handle.order);
//   WebApp.connectHandlers.stack.sort((a, b) => a.handle.order - b.handle.order);
// }, { order: 0, autoNext: true, once: true, unshift: true });
