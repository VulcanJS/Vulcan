import { store } from './store.js';

// use global store
Mongo.Collection.prototype.findRedux = function (selector = {}, options = {}) {
  return this.findInStore(store, selector, options);
}

Mongo.Collection.prototype.findOneRedux = function (_idOrObject) {
  return this.findOneInStore(store, _idOrObject);
}