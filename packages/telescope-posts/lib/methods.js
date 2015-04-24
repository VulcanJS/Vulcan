/**
 *
 * Post Methods
 *
 */

Posts.submit = function (post) {

  var userId = post.userId, // at this stage, a userId is expected
      user = Meteor.users.findOne(userId);

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
  if (post.status == Posts.config.STATUS_APPROVED && !post.postedAt)
    post.postedAt = new Date();

  // clean up post title
  post.title = Telescope.utils.cleanUp(post.title);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on post object successively
  post = Telescope.callbacks.run("postSubmit", post);

  // -------------------------------- Insert ------------------------------- //

  post._id = Posts.insert(post);

  // --------------------- Server-Side Async Callbacks --------------------- //

  Telescope.callbacks.run("postSubmitAsync", post, true);

  return post;
}

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var postViews = [];

Meteor.methods({

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
        hasAdminRights = Users.isAdmin(user);

    // ------------------------------ Checks ------------------------------ //

    // check that user can post
    if (!user || !Users.can.post(user))
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_post_new_stories'));

    // --------------------------- Rate Limiting -------------------------- //

    if(!hasAdminRights){

      var timeSinceLastPost=timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts),
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

    // if user is not admin, go over each schema property and throw an error if it's not editable
    if (!hasAdminRights) {
      _.keys(post).forEach(function (propertyName) {
        var property = Posts.schema._schema[propertyName];
        if (!property || !property.autoform || !property.autoform.editable) {
          console.log('//' + i18n.t('disallowed_property_detected') + ": " + propertyName);
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + propertyName);
        }
      });
    }

    // if no post status has been set, set it now
    if (!post.status) {
      post.status = Posts.getDefaultStatus(user);
    }

    // if no userId has been set, default to current user id
    if (!post.userId) {
      post.userId = user._id
    }

    return Posts.submit(post);
  },

  editPost: function (modifier, postId) {

    var user = Meteor.user(),
        hasAdminRights = Users.isAdmin(user),
        post = Posts.findOne(postId);

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit
    if (!user || !Users.can.edit(user, Posts.findOne(postId)))
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_post'));

    // if user is not admin, go over each schema property and throw an error if it's not editable
    if (!hasAdminRights) {
      // loop over each operation ($set, $unset, etc.)
      _.each(modifier, function (operation) {
        // loop over each property being operated on
        _.keys(operation).forEach(function (propertyName) {
          var property = Posts.schema._schema[propertyName];
          if (!property || !property.autoform || !property.autoform.editable) {
            console.log('//' + i18n.t('disallowed_property_detected') + ": " + propertyName);
            throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + propertyName);
          }
        });
      });
    }

    // ------------------------------ Callbacks ------------------------------ //

    // run all post submit server callbacks on modifier successively
    modifier = Telescope.callbacks.postEdit.reduce(function(result, currentFunction) {
        return currentFunction(result);
    }, modifier);

    // ------------------------------ Update ------------------------------ //

    Posts.update(postId, modifier);

    // ------------------------------ Callbacks ------------------------------ //

    if (Meteor.isServer) {
      Meteor.defer(function () { // use defer to avoid holding up client
        // run all post after edit method callbacks successively
        Telescope.callbacks.postEditAsync.forEach(function(currentFunction) {
          currentFunction(modifier, post);
        });
      });
    }

    // ------------------------------ After Update ------------------------------ //

    return Posts.findOne(postId);

  },

  setPostedAt: function(post, customPostedAt){

    var postedAt = new Date(); // default to current date and time

    if(Users.isAdmin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;

    Posts.update(post._id, {$set: {postedAt: postedAt}});
  },

  approvePost: function(post){
    if(Users.isAdmin(Meteor.user())){
      var set = {status: 2};

      // unless post is already scheduled and has a postedAt date, set its postedAt date to now
      if (!post.postedAt)
        set.postedAt = new Date();

      var result = Posts.update(post._id, {$set: set}, {validate: false});

      // --------------------- Server-Side Async Callbacks --------------------- //
      Telescope.callbacks.run("postApprovedAsync", post, true);

    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  unapprovePost: function(post){
    if(Users.isAdmin(Meteor.user())){
      Posts.update(post._id, {$set: {status: 1}});
    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  increasePostViews: function(postId, sessionId){
    this.unblock();

    // only let users increment a post's view counter once per session
    var view = {_id: postId, userId: this.userId, sessionId: sessionId};

    if(_.where(postViews, view).length == 0){
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
    Meteor.users.update({_id: post.userId}, {$inc: {postCount: -1}});

    // delete post
    Posts.remove(postId);
  }

});
