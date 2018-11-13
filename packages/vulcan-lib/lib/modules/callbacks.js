import { debug } from './debug.js';
import { Utils } from './utils';

/**
 * @summary A list of all registered callback hooks
 */
export const CallbackHooks = [];

/**
 * @summary Callback hooks provide an easy way to add extra steps to common operations.
 * @namespace Callbacks
 */
export const Callbacks = {};


/**
 * @summary Register a callback
 * @param {String} hook - The name of the hook
 * @param {Function} callback - The callback function
 */
export const registerCallback = function (callback) {
  CallbackHooks.push(callback);
};

/**
 * @summary Add a callback function to a hook
 * @param {String} hook - The name of the hook
 * @param {Function} callback - The callback function
 */
export const addCallback = function (hook, callback) {

  if (!callback.name) {
    // eslint-disable-next-line no-console
    console.log(`// Warning! You are adding an unnamed callback to ${hook}. Please use the function foo () {} syntax.`);
  }

  // if callback array doesn't exist yet, initialize it
  if (typeof Callbacks[hook] === 'undefined') {
    Callbacks[hook] = [];
  }

  Callbacks[hook].push(callback);
};

/**
 * @summary Remove a callback from a hook
 * @param {string} hook - The name of the hook
 * @param {string} functionName - The name of the function to remove
 */
export const removeCallback = function (hookName, callbackName) {
  Callbacks[hookName] = _.reject(Callbacks[hookName], function (callback) {
    return callback.name === callbackName;
  });
};

/**
 * @summary Successively run all of a hook's callbacks on an item
 * @param {String} hook - First argument: the name of the hook
 * @param {Object} item - Second argument: the post, comment, modifier, etc. on which to run the callbacks
 * @param {Any} args - Other arguments will be passed to each successive iteration
 * @returns {Object} Returns the item after it's been through all the callbacks for this hook
 */
export const runCallbacks = function () {

  let hook, item, args;
  if (typeof arguments[0] === 'object' && arguments.length === 1) {
    const singleArgument = arguments[0];
    hook = singleArgument.name;
    item = singleArgument.iterator;
    args = singleArgument.properties;
  } else {
    // OpenCRUD backwards compatibility
    // the first argument is the name of the hook or an array of functions
    hook = arguments[0];
    // the second argument is the item on which to iterate
    item = arguments[1];
    // successive arguments are passed to each iteration
    args = Array.prototype.slice.call(arguments).slice(2);
  }

  // flag used to detect the callback that initiated the async context
  let asyncContext = false;

  const callbacks = Array.isArray(hook) ? hook : Callbacks[hook];

  if (typeof callbacks !== 'undefined' && !!callbacks.length) { // if the hook exists, and contains callbacks to run

    const runCallback = (accumulator, callback) => {
      debug(`\x1b[32m>> Running callback [${callback.name}] on hook [${hook}]\x1b[0m`);
      const newArguments = [accumulator].concat(args);

      try {
        const result = callback.apply(this, newArguments);

        // if callback is only supposed to run once, remove it
        if (callback.runOnce) {
          removeCallback(hook, callback.name);
        }

        if (typeof result === 'undefined') {
          // if result of current iteration is undefined, don't pass it on
          // debug(`// Warning: Sync callback [${callback.name}] in hook [${hook}] didn't return a result!`)
          return accumulator;
        } else {
          return result;
        }

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`\x1b[31m// error at callback [${callback.name}] in hook [${hook}]\x1b[0m`);
        // eslint-disable-next-line no-console
        console.log(error);
        if (error.break || error.data && error.data.break) {
          throw error;
        }
        // pass the unchanged accumulator to the next iteration of the loop
        return accumulator;
      }
    };

    return callbacks.reduce(function (accumulator, callback, index) {
      if (Utils.isPromise(accumulator)) {
        if (!asyncContext) {
          debug(`\x1b[32m>> Started async context in hook [${hook}] by [${callbacks[index-1] && callbacks[index-1].name}]\x1b[0m`);
          asyncContext = true;
        }
        return new Promise((resolve, reject) => {
          accumulator
            .then(result => {
              try {
                // run this callback once we have the previous value
                resolve(runCallback(result, callback));
              } catch (error) {
                // error will be thrown only for breaking errors, so throw it up in the promise chain
                reject(error);
              }
            })
            .catch(reject);
        });
      } else {
        return runCallback(accumulator, callback);
      }
    }, item);

  } else { // else, just return the item unchanged
    return item;
  }
};

/**
 * @summary Successively run all of a hook's callbacks on an item, in async mode (only works on server)
 * @param {String} hook - First argument: the name of the hook
 * @param {Any} args - Other arguments will be passed to each successive iteration
 */
export const runCallbacksAsync = function () {

  let hook, args;
  if (typeof arguments[0] === 'object' && arguments.length === 1) {
    const singleArgument = arguments[0];
    hook = singleArgument.name;
    args = [singleArgument.properties]; // wrap in array for apply
  } else {
    // OpenCRUD backwards compatibility
    // the first argument is the name of the hook or an array of functions
    hook = arguments[0];
    // successive arguments are passed to each iteration
    args = Array.prototype.slice.call(arguments).slice(1);
  }

  const callbacks = Array.isArray(hook) ? hook : Callbacks[hook];

  if (Meteor.isServer && typeof callbacks !== 'undefined' && !!callbacks.length) {

    // use defer to avoid holding up client
    Meteor.defer(function () {
      // run all post submit server callbacks on post object successively
      callbacks.forEach(function (callback) {
        debug(`\x1b[32m>> Running async callback [${callback.name}] on hook [${hook}]\x1b[0m`);
        callback.apply(this, args);
      });
    });

  }

};