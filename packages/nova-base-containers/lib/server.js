import './fragments.js';

import withApp from './containers/withApp.js';
import withPostsList from './containers/withPostsList.js';
import withPostsSingle from './containers/withPostsSingle.js';
import withCommentsList from './containers/withCommentsList.js';
import withUsersSingle from './containers/withUsersSingle.js';
import withCategoriesList from './containers/withCategoriesList.js';

import withVoteMutation from './mutations/withVoteMutation.js';

export {
  // query containers
  withApp,
  withPostsList,
  withPostsSingle,
  withCommentsList,
  withUsersSingle,
  withCategoriesList,

  // mutation containers
  withVoteMutation,
}
