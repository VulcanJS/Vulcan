import Telescope from 'meteor/nova:lib';
import Posts from './collection.js';

Telescope.graphQL.addQuery(`
  posts(terms: Terms, offset: Int, limit: Int): [Post]
  postsListTotal(terms: Terms): Int 
  post(_id: String): Post
`);
