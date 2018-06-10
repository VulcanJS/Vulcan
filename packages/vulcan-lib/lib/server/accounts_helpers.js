const crypto = Npm.require('crypto');

export const _hashLoginToken = (loginToken) => {
  var hash = crypto.createHash('sha256');
  hash.update(loginToken);
  return hash.digest('base64');
};

export const _tokenExpiration = (when) => {
  // We pass when through the Date constructor for backwards compatibility;
  // `when` used to be a number.
  return new Date((new Date(when)).getTime() + _getTokenLifetimeMs());
}

// A large number of expiration days (approximately 100 years worth) that is
// used when creating unexpiring tokens.
const LOGIN_UNEXPIRING_TOKEN_DAYS = 365 * 100;

// how long (in days) until a login token expires
const DEFAULT_LOGIN_EXPIRATION_DAYS = 90;

export const _getTokenLifetimeMs = () => {
  // When loginExpirationInDays is set to null, we'll use a really high
  // number of days (LOGIN_UNEXPIRABLE_TOKEN_DAYS) to simulate an
  // unexpiring token.
  const loginExpirationInDays = LOGIN_UNEXPIRING_TOKEN_DAYS;
  return (loginExpirationInDays|| DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;
}