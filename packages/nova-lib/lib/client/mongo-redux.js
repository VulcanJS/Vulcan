import { store } from './store.js';
import Mingo from 'mingo';

Mongo.Collection.prototype.findRedux = function (selector = {}, options = {}) {
  const typeName = this.options && this.options.typeName;
  const docs = _.where(store.getState().apollo.data, {__typename: typeName})
  
  const mingoQuery = Mingo.Query(selector);

  const cursor = mingoQuery.find(docs);
  const sortedDocs = cursor.sort(options.sort).all();

  // console.log('// findRedux')
  // console.log("typeName: ", typeName)
  // console.log("selector: ", selector)
  // console.log("options: ", options)
  // console.log("all docs: ", docs)
  // console.log("selected docs: ", cursor.all())
  // console.log("sorted docs: ", cursor.sort(options.sort).all())

  return {fetch: () => sortedDocs};
}

Mongo.Collection.prototype.findOneRedux = function (_id) {
  return this.findRedux({_id});
}