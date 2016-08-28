import Telescope from 'meteor/nova:lib';
import Posts from '../collection.js';
// import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';

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

  /* 
  NOTE: to avoid circular dependencies between nova:posts and nova:comments, 
  use callback hook to get comment authors
  */
  users = Telescope.callbacks.run("posts.single.getUsers", users, post);
  
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
    
    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Posts.parameters.get(terms);
    
    Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});

    options.fields = Posts.publishedFields.list;

    const posts = Posts.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, posts.count(), this.connection.id);

    const users = Tracker.nonreactive(function () {
      return getPostsListUsers(posts);
    });

    return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users] : [];
  
  });

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('posts.single', function (terms) {

  check(terms, Match.OneOf({_id: String}, {_id: String, slug: Match.Any}));

  const currentUser = this.userId && Meteor.users.findOne(this.userId);
  const options = {fields: Posts.publishedFields.single};
  const posts = Posts.find(terms._id, options);
  const post = posts.fetch()[0];

  if (post) {
    const users = getSinglePostUsers(post);
    return Users.canView(currentUser, post) ? [posts, users] : [];
  } else {
    console.log(`// posts.single: no post found for _id “${terms._id}”`)
    return [];
  }

});