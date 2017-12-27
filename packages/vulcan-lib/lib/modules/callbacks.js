import { debug } from './debug.js';

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
    console.log(`// Warning! You are adding an unnamed callback to ${hook}. Please use the function foo () {} syntax.`);
  }

  // if callback array doesn't exist yet, initialize it
  if (typeof Callbacks[hook] === "undefined") {
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

  // the first argument is the name of the hook or an array of functions
  const hook = arguments[0];
  // the second argument is the item on which to iterate
  const item = arguments[1];
  // successive arguments are passed to each iteration
  const args = Array.prototype.slice.call(arguments).slice(2);

  const callbacks = Array.isArray(hook) ? hook : Callbacks[hook];

  if (typeof callbacks !== "undefined" && !!callbacks.length) { // if the hook exists, and contains callbacks to run

    return callbacks.reduce(function(accumulator, callback) {

      debug(`// Running callback [${callback.name}] on hook [${hook}]`);

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
          return accumulator
        } else {
          return result;
        }

      } catch (error) {
        console.log(`// error at callback [${callback.name}] in hook [${hook}]`);
        console.log(error);
        if (error.break || error.data && error.data.break) {
          throw error;
        }
        // pass the unchanged accumulator to the next iteration of the loop
        return accumulator;
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

  // the first argument is the name of the hook or an array of functions
  var hook = arguments[0];
  // successive arguments are passed to each iteration
  var args = Array.prototype.slice.call(arguments).slice(1);

  const callbacks = Array.isArray(hook) ? hook : Callbacks[hook];

  if (Meteor.isServer && typeof callbacks !== "undefined" && !!callbacks.length) {

    // use defer to avoid holding up client
    Meteor.defer(function () {
      // run all post submit server callbacks on post object successively
      callbacks.forEach(function(callback) {
        debug(`// Running async callback [${callback.name}] on hook [${hook}]`);
        callback.apply(this, args);
      });
    });

  }

};