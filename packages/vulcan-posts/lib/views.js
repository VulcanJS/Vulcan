import Users from 'meteor/vulcan:users';
import Posts from './collection.js'

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
Posts.addDefaultView(terms => ({
  selector: {
    status: Posts.config.STATUS_APPROVED,
    isFuture: {$ne: true} // match both false and undefined
  }
}));

/**
 * @summary Top view
 */
Posts.addView("top", terms => ({
  options: {
    sort: {sticky: -1, score: -1}
  }
}));

/**
 * @summary New view
 */
Posts.addView("new", terms => ({
  options: {
    sort: {sticky: -1, postedAt: -1}
  }
}));

/**
 * @summary Best view
 */
Posts.addView("best", terms => ({
  options: {
    sort: {sticky: -1, baseScore: -1}
  }
}));

/**
 * @summary Pending view
 */
Posts.addView("pending", terms => ({
  selector: {
    status: Posts.config.STATUS_PENDING
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Rejected view
 */
Posts.addView("rejected", terms => ({
  selector: {
    status: Posts.config.STATUS_REJECTED
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Scheduled view
 */
Posts.addView("scheduled", terms => ({
  selector: {
    status: Posts.config.STATUS_APPROVED,
    isFuture: true
  },
  options: {
    sort: {postedAt: -1}
  }
}));

/**
 * @summary User posts view
 */
Posts.addView("userPosts", terms => ({
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
}));

/**
 * @summary User upvoted posts view
 */
Posts.addView("userUpvotedPosts", (terms, apolloClient) => {
  var user = apolloClient ? Users.findOneInStore(apolloClient.store, terms.userId) : Users.findOne(terms.userId);

  var postsIds = _.pluck(user.upvotedPosts, "itemId");
  return {
    selector: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

/**
 * @summary User downvoted posts view
 */
Posts.addView("userDownvotedPosts", (terms, apolloClient) => {
  var user = apolloClient ? Users.findOneInStore(apolloClient.store, terms.userId) : Users.findOne(terms.userId);

  var postsIds = _.pluck(user.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    selector: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});
