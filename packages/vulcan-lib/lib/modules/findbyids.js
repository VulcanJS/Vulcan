
/**
 * @summary Find by ids, for DataLoader, inspired by https://github.com/tmeasday/mongo-find-by-ids/blob/master/index.js
 */
const findByIds = async function(collection, ids, context) {
  console.log('// findByIds: '+collection._name+" "+new Date().getMilliseconds())
  
  // get documents
  const cleanedIds = ids.map(id => id.split('|')[0]);
  const documents = await collection.find({ _id: { $in: cleanedIds } }).fetch();

  // order documents in the same order as the ids passed as argument
  const orderedDocuments = cleanedIds.map(id => _.findWhere(documents, {_id: id}));

  return orderedDocuments;
}

export default findByIds;

// class BatchingCollection {
//   constructor(collection) {
//     this.collection = collection;
//     this.loader = new DataLoader(ids => findByIds(collection, ids), { cache: true });
//   }

//   findOne(id, origin) {
//     return this.loader.load(id);
//   }

//   findByIds(ids, origin) {
//     return this.loader.loadMany(ids);
//   }

//   async find(selector, options) {
//     console.log(`// ${this.collection._name}.find`)
//     const docs = await this.collection.find(selector, options).fetch();
//     return docs;
//   }

  // async insert(doc) {
  //   const _id = (await this.collection.insert(doc)).insertedId;

  //   return _id;
  // }

  // async update({ _id }, modifier) {
  //   const ret = await this.collection.update({ _id }, modifier);
  //   this.loader.clear(_id);

  //   return ret;
  // }

  // async remove({ _id }) {
  //   const ret = this.collection.remove({ _id });
  //   this.loader.clear(_id);

  //   return ret;
  // }
// }