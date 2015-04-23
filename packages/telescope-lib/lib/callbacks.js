
Telescope.callbacks = [];

/**
 * Add a callback function to a hook
 * @param {String} hook - The name of the hook
 * @param {Function} callback - The callback function
 */
Telescope.registerCallback = function (hook, callback) {

  // if callback array doesn't exist yet, initialize it
  if (typeof Telescope.callbacks[hook] === "undefined") {
    Telescope.callbacks[hook] = [];
  }

  Telescope.callbacks[hook].push(callback);
}

/**
 * Successively run all of a hook's callbacks on an item
 * @param {String} hook - The name of the hook
 * @param {Object} item - The post, comment, modifier, etc. on which to run the callbacks
 * @param {Boolean} async - Whether to run the callback in async mode or not
 */
Telescope.runCallbacks = function (hook, item, async) {

  var async = typeof async === "undefined" ? false : async; // default to sync
  var callbacks = Telescope.callbacks[hook];

  if (typeof callbacks !== "undefined" && !!callbacks.length) { // if the hook exists, and contains callbacks to run

    if (async) { // run callbacks in async mode, without returning anything
      
      if (Meteor.isServer) {
        // use defer to avoid holding up client
        Meteor.defer(function () {
          // run all post submit server callbacks on post object successively
          callbacks.forEach(function(callback) {
            callback(item);
          });
        });
      }

    } else { // else run callbacks in sync mode, and return the modified item

      return callbacks.reduce(function(result, callback) {
        return callback(result);
      }, item);

    }

  }
}