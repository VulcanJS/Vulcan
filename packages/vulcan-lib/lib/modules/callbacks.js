/**
 * @summary Callback hooks provide an easy way to add extra steps to common operations.
 * @namespace Callbacks
 */
export const Callbacks = {};

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

  // the first argument is the name of the hook
  const hook = arguments[0];
  // the second argument is the item on which to iterate
  const item = arguments[1];
  // successive arguments are passed to each iteration
  const args = Array.prototype.slice.call(arguments).slice(2);

  const callbacks = Callbacks[hook];

  if (typeof callbacks !== "undefined" && !!callbacks.length) { // if the hook exists, and contains callbacks to run

    return callbacks.reduce(function(accumulator, callback) {
      // console.log(callback.name);
      // return callback(result, constant);
      const newArguments = [accumulator].concat(args);
      // return callback.apply(this, newArguments);
      // uncomment for debugging
      try {
        return callback.apply(this, newArguments);
      } catch (error) {
        console.log(`// error at callback [${callback.name}] in hook [${hook}]`);
        console.log(error);
        // throw error;
        // passed the unchanged accumulator to the next iteration of the loop
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

  // the first argument is the name of the hook
  var hook = arguments[0];
  // successive arguments are passed to each iteration
  var args = Array.prototype.slice.call(arguments).slice(1);
  var callbacks = Callbacks[hook];

  if (Meteor.isServer && typeof callbacks !== "undefined" && !!callbacks.length) {

    // use defer to avoid holding up client
    Meteor.defer(function () {
      // run all post submit server callbacks on post object successively
      callbacks.forEach(function(callback) {
        // console.log("// "+hook+": running callback ["+callback.name+"] at "+moment().format("hh:mm:ss"))
        callback.apply(this, args);
      });
    });

  }

};