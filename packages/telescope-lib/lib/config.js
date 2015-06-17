/**
 * Telescope configuration namespace
 * @namespace Telescope.config
 */
Telescope.config = {};

Telescope.config.customPrefix = "custom_";

 /**
 * Subscriptions namespace
 * @namespace Telescope.subscriptions
 */
Telescope.subscriptions = [];

/**
 * Add a subscription to be preloaded
 * @param {string} subscription - The name of the subscription
 */
Telescope.subscriptions.preload = function (subscription) {
  Telescope.subscriptions.push(subscription);
};

