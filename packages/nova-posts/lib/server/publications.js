Posts._ensureIndex({"status": 1, "postedAt": 1});

// ------------------------------------- Helpers -------------------------------- //

/**
 * @summary Get all users relevant to a list of posts
 * (authors of the listed posts, and first four commenters of each post)
 * @param {Object} posts
 */
const getPostsListUsers = posts => {

  // add the userIds of each post authors
  let userIds = _.pluck(posts.fetch(), 'userId');

  // for each post, also add first four commenter's userIds to userIds array
  posts.forEach(function (post) {
    userIds = userIds.concat(_.first(post.commenters,4));
  });

  userIds = _.unique(userIds);

  return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.publishedFields.list});
 
};

/**
 * @summary Get all users relevant to a single post
 * (author of the current post, authors of its comments, and upvoters & downvoters of the post)
 * @param {Object} post
 */
const getSinglePostUsers = post => {

  let users = [post.userId]; // publish post author's ID

  if (typeof Comments !== "undefined") {
    // get IDs from all commenters on the post
    const comments = Comments.find({postId: post._id}).fetch();
    if (comments.length) {
      users = users.concat(_.pluck(comments, "userId"));
    }
  }
  
  // add upvoters
  if (post.upvoters && post.upvoters.length) {
    users = users.concat(post.upvoters);
  }

  // add downvoters
  if (post.downvoters && post.downvoters.length) {
    users = users.concat(post.downvoters);
  }

  // remove any duplicate IDs
  users = _.unique(users);

  return Meteor.users.find({_id: {$in: users}}, {fields: Users.publishedFields.list});
};

// ------------------------------------- Publications -------------------------------- //

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('posts.list', function (terms) {

  // this.unblock(); // causes bug where publication returns 0 results  

  this.autorun(function () {
    const currentUser = Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = Posts.parameters.get(terms));
    
    // note: enabling Counts.publish messes up SSR
    // Counts.publish(this, 'posts.list', Posts.find(selector, options));

    options.fields = Posts.publishedFields.list;

    const posts = Posts.find(selector, options);
    const users = getPostsListUsers(posts);

    return Users.can.view(currentUser) ? [posts, users] : [];
  
  });

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('posts.single', function (terms) {

  check(terms, Match.OneOf({_id: String}, {_id: String, slug: Match.Any}));

  const currentUser = Meteor.users.findOne(this.userId);
  const options = {fields: Posts.publishedFields.single};
  const posts = Posts.find(terms._id, options);
  const post = posts.fetch()[0];
  const users = getSinglePostUsers(post);

  return Users.can.viewPost(currentUser, post) ? [posts, users] : [];

});