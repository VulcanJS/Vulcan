// This is experimental and not actually used by vulcan:errors

// ### ExtendedError
// From https://github.com/deployable/deployable-errors

// Custom errors can extend this

export default class ExtendedError extends Error {
  constructor(message, options = {}) {
    // Make it an error
    super(message);

    // Standard Error things
    this.name = this.constructor.name;
    this.message = message;

    // Get a stack trace where we can
    /* istanbul ignore else */
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }

    // A standard place to store a more human readable error message
    if (options.simple) this.simple = options.simple;
  }

  // Support `.statusCode` for express
  get statusCode() {
    return this.status;
  }

  set statusCode(val) {
    this.status = val;
  }

  // Fix Errors `.toJSON` for our errors
  toJSON() {
    let o = {};
    Object.getOwnPropertyNames(this).forEach(key => (o[key] = this[key]), this);
    return o;
  }

  toResponse() {
    let o = this.toJSON();
    if (process && process.env && process.env.NODE_ENV !== 'development') delete o.stack;
    return o;
  }
}
