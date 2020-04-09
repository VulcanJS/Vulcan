import { createCollection } from 'meteor/vulcan:core';
import schema from './schema';

const Newsletters = createCollection({
  collectionName: 'Newsletters',

  typeName: 'Newsletter',

  schema,
});

export default Newsletters;
