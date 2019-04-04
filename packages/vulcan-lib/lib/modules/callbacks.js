import { Meteor } from 'meteor/meteor';

import { debug } from './debug.js';
import { Utils } from './utils';

/**
 * @summary Format callback hook names
 */
export const formatHookName = hook => typeof hook === 'string' && hook.toLowerCase();

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

  const formattedHook = formatHookName(hook);

  if (!callback.name) {
    // eslint-disable-next-line no-console
    console.log(`// Warning! You are adding an unnamed callback to ${formattedHook}. Please use the function foo () {} syntax.`);
  }

  // if callback array doesn't exist yet, initialize it
  if (typeof Callbacks[formattedHook] === 'undefined') {
    Callbacks[formattedHook] = [];
  }

  Callbacks[formattedHook].push(callback);
};

/**
 * @summary Remove a callback from a hook
 * @param {string} hookName - The name of the hook
 * @param {string} callbackName - The name of the function to remove
 */
export const removeCallback = function (hookName, callbackName) {
  const formattedHook = formatHookName(hookName);
  Callbacks[formattedHook] = _.reject(Callbacks[formattedHook], function (callback) {
    return callback.name === callbackName;
  });
};


/**
 * @summary Remove all callbacks from a hook (mostly for testing purposes)
 * @param {string} hookName - The name of the hook
 */
export const removeAllCallbacks = function(hookName) {
  const formattedHook = formatHookName(hookName);
  Callbacks[formattedHook] = [];
};

/**
 * @summary Successively run all of a hook's callbacks on an item
 * @param {String} hook - First argument: the name of the hook, or an array
 * @param {Object} item - Second argument: the post, comment, modifier, etc. on which to run the callbacks
 * @param {Any} args - Other arguments will be passed to each successive iteration
 * @param {Array} callbacks - Optionally, pass an array of callback functions instead of passing a hook name
 * @returns {Object} Returns the item after it's been through all the callbacks for this hook
 */
export const runCallbacks = function () {

  let hook, item, args, callbacks, formattedHook;
  if (typeof arguments[0] === 'object' && arguments.length === 1) {
    const singleArgument = arguments[0];
    hook = singleArgument.name;
    formattedHook = formatHookName(hook);
    item = singleArgument.iterator;
    args = singleArgument.properties;
    // if callbacks option is passed used that, else use formatted hook name
    callbacks = singleArgument.callbacks ? singleArgument.callbacks : Callbacks[formattedHook];
  } else {
    // OpenCRUD backwards compatibility
    // the first argument is the name of the hook or an array of functions
    hook = arguments[0];
    formattedHook = formatHookName(hook);
    // the second argument is the item on which to iterate
    item = arguments[1];
    // successive arguments are passed to each iteration
    args = Array.prototype.slice.call(arguments).slice(2);
    // if first argument is an array, use that as callbacks array; else use formatted hook name
    callbacks = Array.isArray(hook) ? hook : Callbacks[formattedHook];
  }

  // flag used to detect the callback that initiated the async context
  let asyncContext = false;
  
  if (typeof callbacks !== 'undefined' && !!callbacks.length) { // if the hook exists, and contains callbacks to run

    const runCallback = (accumulator, callback) => {
      debug(`\x1b[32m>> Running callback [${callback.name}] on hook [${formattedHook}]\x1b[0m`);
      const newArguments = [accumulator].concat(args);

      try {
        const result = callback.apply(this, newArguments);

        // if callback is only supposed to run once, remove it
        if (callback.runOnce) {
          removeCallback(formattedHook, callback.name);
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
        console.log(`\x1b[31m// error at callback [${callback.name}] in hook [${formattedHook}]\x1b[0m`);
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
          debug(`\x1b[32m>> Started async context in hook [${formattedHook}] by [${callbacks[index-1] && callbacks[index-1].name}]\x1b[0m`);
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

  if (typeof callbacks !== 'undefined' && !!callbacks.length) {
    const _runCallbacksAsync = () =>
        Promise.all(
            callbacks.map(callback => {
                debug(`\x1b[32m>> Running async callback [${callback.name}] on hook [${hook}]\x1b[0m`);
                return callback.apply(this, args);
            }),
        );

    if (Meteor.isServer) {
      // TODO: find out if we can safely use promises on the server, too - https://github.com/VulcanJS/Vulcan/pull/2065
      return new Promise(async (resolve, reject) => {
          Meteor.defer(function() {
            _runCallbacksAsync().then(resolve).catch(reject);
          });
      });
    }
    return _runCallbacksAsync();
  }
  return [];
};
