/**
 *
 * Post Methods
 *
 */

/**
 * Insert a post in the database (note: optional post properties not listed here)
 * @param {Object} post - the post being inserted
 * @param {string} post.userId - the id of the user the post belongs to
 * @param {string} post.title - the post's title
 */
Posts.submit = function (post) {

  var userId = post.userId, // at this stage, a userId is expected
      user = Users.findOne(userId);

  // ------------------------------ Checks ------------------------------ //

  // check that a title was provided
  if(!post.title)
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));

  // check that there are no posts with the same URL
  if(!!post.url)
    Posts.checkForSameUrl(post.url, user);

  // ------------------------------ Properties ------------------------------ //

  var defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(userId),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    inactive: false,
    sticky: false,
    status: Posts.getDefaultStatus()
  };

  post = _.extend(defaultProperties, post);

  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (post.status === Posts.config.STATUS_APPROVED && !post.postedAt)
    post.postedAt = new Date();

  // clean up post title
  post.title = Telescope.utils.cleanUp(post.title);

  // generate slug
  post.slug = Telescope.utils.slugify(post.title);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on post object successively
  post = Telescope.callbacks.run("postSubmit", post);

  // -------------------------------- Insert ------------------------------- //

  post._id = Posts.insert(post);

  // --------------------- Server-Side Async Callbacks --------------------- //

  // note: query for post to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync("postSubmitAsync", Posts.findOne(post._id));

  return post;
};

/**
 * Edit a post in the database
 * @param {string} postId – the ID of the post being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} post - the current post object
 */
Posts.edit = function (postId, modifier, post) {

  if (typeof post === "undefined") {
    post = Posts.findOne(postId);
  }

  // ------------------------------ Callbacks ------------------------------ //

  // run all post edit server callbacks on modifier successively
  modifier = Telescope.callbacks.run("postEdit", modifier, post);

  // ------------------------------ Update ------------------------------ //

  Posts.update(postId, modifier);

  // ------------------------------ Callbacks ------------------------------ //

  Telescope.callbacks.runAsync("postEditAsync", Posts.findOne(postId));

  // ------------------------------ After Update ------------------------------ //
  return Posts.findOne(postId);
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var postViews = [];

Meteor.methods({

  /**
   * Meteor method for submitting a post from the client
   * @memberof Posts
   * @param {Object} post - the post being inserted
   */
  submitPost: function(post){

    // required properties:
    // title

    // optional properties
    // URL
    // body
    // categories
    // thumbnailUrl

    // NOTE: the current user and the post author user might be two different users!
    var user = Meteor.user(),
        hasAdminRights = Users.is.admin(user),
        schema = Posts.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can post
    if (!user || !Users.can.post(user))
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_post_new_stories'));

    // --------------------------- Rate Limiting -------------------------- //

    if(!hasAdminRights){

      var timeSinceLastPost = Users.timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
        postInterval = Math.abs(parseInt(Settings.get('postInterval', 30))),
        maxPostsPer24Hours = Math.abs(parseInt(Settings.get('maxPostsPerDay', 30)));

      // check that user waits more than X seconds between posts
      if(timeSinceLastPost < postInterval)
        throw new Meteor.Error(604, i18n.t('please_wait')+(postInterval-timeSinceLastPost)+i18n.t('seconds_before_posting_again'));

      // check that the user doesn't post more than Y posts per day
      if(numberOfPostsInPast24Hours > maxPostsPer24Hours)
        throw new Meteor.Error(605, i18n.t('sorry_you_cannot_submit_more_than')+maxPostsPer24Hours+i18n.t('posts_per_day'));

    }

    // ------------------------------ Properties ------------------------------ //

    // admin-only properties
    // status
    // postedAt
    // userId
    // sticky (default to false)

    // go over each schema field and throw an error if it's not editable
    _.keys(post).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.submitField(user, field)) {
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
      }

    });

    // if no post status has been set, set it now
    if (!post.status) {
      post.status = Posts.getDefaultStatus(user);
    }

    // if no userId has been set, default to current user id
    if (!post.userId) {
      post.userId = user._id;
    }

    return Posts.submit(post);
  },

  /**
   * Meteor method for editing a post from the client
   * @memberof Posts
   * @param {Object} modifier - the update modifier
   * @param {Object} postId - the id of the post being updated
   */
  editPost: function (modifier, postId) {

    var user = Meteor.user(),
        post = Posts.findOne(postId),
        schema = Posts.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(user, post)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_post'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {

        var field = schema[fieldName];
        if (!Users.can.editField(user, field, post)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    return Posts.edit(postId, modifier, post);

  },

  setPostedAt: function(post, customPostedAt){

    var postedAt = new Date(); // default to current date and time

    if(Users.is.admin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;

    Posts.update(post._id, {$set: {postedAt: postedAt}});
  },

  approvePost: function(post){
    if(Users.is.admin(Meteor.user())){
      var set = {status: 2};

      // unless post is already scheduled and has a postedAt date, set its postedAt date to now
      if (!post.postedAt)
        set.postedAt = new Date();

      Posts.update(post._id, {$set: set}, {validate: false});

      Telescope.callbacks.runAsync("postApprovedAsync", post);

    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  unapprovePost: function(post){
    if(Users.is.admin(Meteor.user())){
      Posts.update(post._id, {$set: {status: 1}});
    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  increasePostViews: function(postId, sessionId){
    this.unblock();

    // only let users increment a post's view counter once per session
    var view = {_id: postId, userId: this.userId, sessionId: sessionId};

    if(_.where(postViews, view).length === 0){
      postViews.push(view);
      Posts.update(postId, { $inc: { viewCount: 1 }});
    }
  },

  deletePostById: function(postId) {
    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments after all

    var post = Posts.findOne({_id: postId});

    if(!Meteor.userId() || !Users.can.editById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');

    // decrement post count
    Users.update({_id: post.userId}, {$inc: {"telescope.postCount": -1}});

    // delete post
    Posts.remove(postId);
  }

});
