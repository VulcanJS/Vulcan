import Posts from './collection.js'

/**
 * @summary Post views are filters used for subscribing to and viewing posts
 * @namespace Posts.views
 */
Posts.views = {};

/**
 * @summary Add a post view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Posts.views.add = function (viewName, viewFunction) {
  Posts.views[viewName] = viewFunction;
};

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
Posts.views.baseParameters = {
  selector: {
    status: Posts.config.STATUS_APPROVED,
    isFuture: {$ne: true} // match both false and undefined
  }
};

/**
 * @summary Top view
 */
Posts.views.add("top", function (terms) {
  return {
    ...Posts.views.baseParameters,
    options: {sort: {sticky: -1, score: -1}}
  };
});

/**
 * @summary New view
 */
Posts.views.add("new", function (terms) {
  return {
    ...Posts.views.baseParameters,
    options: {sort: {sticky: -1, postedAt: -1}}
  };
});

/**
 * @summary Best view
 */
Posts.views.add("best", function (terms) {
  return {
    ...Posts.views.baseParameters,
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});

/**
 * @summary Pending view
 */
Posts.views.add("pending", function (terms) {
  return {
    selector: {
      status: Posts.config.STATUS_PENDING
    },
    options: {sort: {createdAt: -1}}
  };
});

/**
 * @summary Rejected view
 */
Posts.views.add("rejected", function (terms) {
  return {
    selector: {
      status: Posts.config.STATUS_REJECTED
    },
    options: {sort: {createdAt: -1}}
  };
});

/**
 * @summary Scheduled view
 */
Posts.views.add("scheduled", function (terms) {
  return {
    selector: {
      status: Posts.config.STATUS_APPROVED,
      isFuture: true
    },
    options: {sort: {postedAt: -1}}
  };
});

/**
 * @summary User posts view
 */
Posts.views.add("userPosts", function (terms) {
  return {
    selector: {
      userId: terms.userId,
      status: Posts.config.STATUS_APPROVED,
      isFuture: {$ne: true}
    },
    options: {
      limit: 5, 
      sort: {
        postedAt: -1
      }
    }
  };
});

/**
 * @summary User upvoted posts view
 */
Posts.views.add("userUpvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.upvotedPosts, "itemId");
  return {
    selector: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

/**
 * @summary User downvoted posts view
 */
Posts.views.add("userDownvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    selector: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});


Posts.views.add("test", function (terms) {
  return {
    selector: {
      title: {$regex: "newsletter", $options: 'i'}
    },
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});
