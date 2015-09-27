/*
** Telescope.feedHandlers
**
** Register of feed handlers.
** Feed handlers need to be registered in order to be instantiated.
*/

Telescope.feedHandlers = {
  _handlers: {},
  add: function(className, klass) {
    this._handlers[className] = klass;
  },

  get: function(className) {
    return className ? this._handlers[className] : null;
  },

  remove: function(className) {
    delete this._handlers[className];
  }
};
