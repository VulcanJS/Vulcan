/**
 * @summary Request a forgot password email.
 * @locus Client
 * @param {Object} options
 * @param {String} options.email The email address to send a password reset link.
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */
Accounts.loginWithoutPassword = function(options, callback) {
  if (!options.email)
    throw new Error("Must pass options.email");
  Accounts.connection.call("loginWithoutPassword", options, callback);
};
