/**
 * Telescope config namespace
 * @type {Object}
 */
Telescope.config = {};


/**
 * Array containing subscriptions to be preloaded
 * @type {Array}
 */
Telescope.subscriptions = [];

/**
 * Add a subscription to be preloaded
 * @param {string} subscription - The name of the subscription
 */
Telescope.subscriptions.preload = function (subscription) {
  Telescope.subscriptions.push(subscription);
};

