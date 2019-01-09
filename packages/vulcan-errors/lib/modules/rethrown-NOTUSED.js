import ExtendedError from './extended';

// This is experimental and not actually used by vulcan:errors

/**
 * Rethrow an error that you caught in your code, adding an additional message,
 * and preserving the stack trace
 *
 * Based on https://github.com/deployable/deployable-errors
 * See https://stackoverflow.com/questions/42754270/re-throwing-exception-in-nodejs-and-not-losing-stack-trace
 *
 * @example
 * try {
 *   ... some code
 * } catch (error) {
 *   new RethrownError('new error message', error, { stack: true });
 * }
 */
export default class RethrownError extends ExtendedError {
  /**
   * @param {string} message - An error message
   * @param {Error} error - An Error caught in a catch block
   * @param {Object} [options] - The employee who is responsible for the project.
   * @param {boolean|number} [options.stack] - Enable, disable or set the number of lines of stack output
   * @param {number} [options.remove] - The number of lines to remove from the beginning of the stack trace
   */
  constructor(message, error, options = {}) {
    super(message);
    if (!error) throw new Error(`new ${this.name} requires a message and error`);

    let message_lines = (this.message.match(/\n/g) || []).length + 1;
    let stack_array = this.stack.split('\n');

    if (options.remove) {
      stack_array.splice(message_lines, options.remove);
    }

    if (options.stack !== true) {
      stack_array = stack_array.slice(0, message_lines + (options.stack || 0));
    }

    //this.original = error;
    this.stack = stack_array.join('\n') + '\n' + error.stack;
  }
}
