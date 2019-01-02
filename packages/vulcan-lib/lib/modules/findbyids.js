import { Connectors } from '../server/connectors.js';

/**
 * @summary Find by ids, for DataLoader, inspired by https://github.com/tmeasday/mongo-find-by-ids/blob/master/index.js
 */
const findByIds = async function(collection, ids, context) {
  
  // get documents
  const documents = await Connectors.find(collection, { _id: { $in: ids } });

  // order documents in the same order as the ids passed as argument
  const orderedDocuments = ids.map(id => _.findWhere(documents, {_id: id}));

  return orderedDocuments;
};

export default findByIds;