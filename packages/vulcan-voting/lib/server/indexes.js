import Votes from '../modules/votes/collection.js';

Votes._ensureIndex({ 'userId': 1, 'documentId': 1 });
