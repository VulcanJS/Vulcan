
/**
 * @summary Find by ids, for DataLoader, inspired by https://github.com/tmeasday/mongo-find-by-ids/blob/master/index.js
 */
const findByIds = async function(collection, ids, context) {
  
  // get documents
  const cleanedIds = ids.map(id => id.split('|')[0]);
  const documents = await collection.find({ _id: { $in: cleanedIds } }).fetch();

  // order documents in the same order as the ids passed as argument
  const orderedDocuments = cleanedIds.map(id => _.findWhere(documents, {_id: id}));

  return orderedDocuments;
}

export default findByIds;