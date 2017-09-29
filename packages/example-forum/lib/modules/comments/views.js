/*

Comments views

*/

import { Comments } from './index.js';

Comments.addView('postComments', function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {postedAt: -1}}
  };
});

Comments.addView('userComments', function (terms) {
  return {
    selector: {userId: terms.userId},
    options: {sort: {postedAt: -1}}
  };
});