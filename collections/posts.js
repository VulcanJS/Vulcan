
// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Schema ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

postSchemaObject = {
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  postedAt: {
    type: Date,
    optional: true,
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  url: {
    type: String,
    optional: true,
    autoform: {
      editable: true,
      type: "bootstrap-url"
    }
  },
  title: {
    type: String,
    optional: false,
    autoform: {
      editable: true
    }
  },
  body: {
    type: String,
    optional: true,
    autoform: {
      editable: true,
      rows: 5
    }
  },
  htmlBody: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  viewCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  commentCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  commenters: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  lastCommentedAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  clickCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  baseScore: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvotes: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvoters: {
    type: [String], // XXX
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvotes: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvoters: {
    type: [String], // XXX
    optional: true,
    autoform: {
      omit: true
    }
  },
  score: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  status: {
    type: Number,
    optional: true,
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Meteor.users.findOne(this.userId);
      if (this.isInsert && !this.isSet)
        return getDefaultPostStatus(user);
    },
    autoform: {
      noselect: true,
      options: postStatuses,
      group: 'admin'
    }
  },
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  inactive: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  },
  author: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  userId: {
    type: String, // XXX
    optional: true,
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: getDisplayName(user)
          }
        });
      }
    }
  }
};

// add any extra properties to postSchemaObject (provided by packages for example)
_.each(addToPostSchema, function(item){
  postSchemaObject[item.propertyName] = item.propertySchema;
});

Posts = new Meteor.Collection("posts");

postSchema = new SimpleSchema(postSchemaObject);

Posts.attachSchema(postSchema);

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Helpers ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

getPostProperties = function (post) {

  var postAuthor = Meteor.users.findOne(post.userId);
  var p = {
    postAuthorName : getDisplayName(postAuthor),
    postTitle : cleanUp(post.title),
    profileUrl: getProfileUrlBySlugOrId(post.userId),
    postUrl: getPostPageUrl(post),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? getOutgoingUrl(post.url) : getPostPageUrl(post._id)
  };

  if(post.url)
    p.url = post.url;

  if(post.htmlBody)
    p.htmlBody = post.htmlBody;

  return p;
};

// default status for new posts
getDefaultPostStatus = function (user) {
  var hasAdminRights = typeof user === 'undefined' ? false : isAdmin(user);
  if (hasAdminRights || !getSetting('requirePostsApproval', false)) {
    // if user is admin, or else post approval is not required
    return STATUS_APPROVED
  } else {
    // else
    return STATUS_PENDING
  }
}

getPostPageUrl = function(post){
  return getSiteUrl()+'posts/'+post._id;
};

getPostEditUrl = function(id){
  return getSiteUrl()+'posts/'+id+'/edit';
};

// for a given post, return its link if it has one, or else its post page URL
getPostLink = function (post) {
  return !!post.url ? getOutgoingUrl(post.url) : getPostPageUrl(post);
};

// we need the current user so we know who to upvote the existing post as
checkForPostsWithSameUrl = function (url, currentUser) {

  // check that there are no previous posts with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if(typeof postWithSameLink !== 'undefined'){
    upvoteItem(Posts, postWithSameLink, currentUser);

    // note: error.details returns undefined on the client, so add post ID to reason
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_posted') + '|' + postWithSameLink._id, postWithSameLink._id);
  }
}

// when on a post page, return the current post
currentPost = function () {
  return Posts.findOne(Router.current().data()._id);
}

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Hooks ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

Posts.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = sanitize(marked(doc.body));
});

Posts.before.update(function (userId, doc, fieldNames, modifier, options) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = sanitize(marked(modifier.$set.body));
  }
});

postAfterSubmitMethodCallbacks.push(function (post) {

  var userId = post.userId,
      postAuthor = Meteor.users.findOne(userId);

  // increment posts count
  Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});
  upvoteItem(Posts, post, postAuthor);

  return post;

});

// ------------------------------------------------------------------------------------------- //
// --------------------------------------- Submit Post --------------------------------------- //
// ------------------------------------------------------------------------------------------- //

submitPost = function (post) {

  var userId = post.userId, // at this stage, a userId is expected
      user = Meteor.users.findOne(userId);

  // ------------------------------ Checks ------------------------------ //

  // check that a title was provided
  if(!post.title)
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));

  // check that there are no posts with the same URL
  if(!!post.url)
    checkForPostsWithSameUrl(post.url, user);

  // ------------------------------ Properties ------------------------------ //

  defaultProperties = {
    createdAt: new Date(),
    author: getDisplayNameById(userId),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    inactive: false,
    sticky: false,
    status: getDefaultPostStatus(),
    postedAt: new Date()
  };

  post = _.extend(defaultProperties, post);

  // clean up post title
  post.title = cleanUp(post.title);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on post object successively
  post = postSubmitMethodCallbacks.reduce(function(result, currentFunction) {
      return currentFunction(result);
  }, post);

  // -------------------------------- Insert ------------------------------- //

  post._id = Posts.insert(post);

  // --------------------- Server-Side Async Callbacks --------------------- //

  if (Meteor.isServer) {
    Meteor.defer(function () { // use defer to avoid holding up client
      // run all post submit server callbacks on post object successively
      post = postAfterSubmitMethodCallbacks.reduce(function(result, currentFunction) {
          return currentFunction(result);
      }, post);
    });
  }

  return post;
}

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

postClicks = [];
postViews = [];

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
        hasAdminRights = isAdmin(user);

    // ------------------------------ Checks ------------------------------ //

    // check that user can post
    if (!user || !can.post(user))
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_post_new_stories'));

    // --------------------------- Rate Limiting -------------------------- //

    if(!hasAdminRights){

      var timeSinceLastPost=timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts),
        postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
        maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 30)));

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

    // if user is not admin, go over each schema property and clear it if it's not editable
    if (!hasAdminRights) {
      _.keys(post).forEach(function (propertyName) {
        var property = postSchemaObject[propertyName];
        if (!property || !property.autoform || !property.autoform.editable) {
          console.log("// Disallowed property detected: "+propertyName+" (nice try!)");
          delete post[propertyName]
        }
      });
    }

    // if no post status has been set, set it now
    if (!post.status) {
      post.status = getDefaultPostStatus(user);
    }

    // if no userId has been set, default to current user id
    if (!post.userId) {
      post.userId = user._id
    }

    return submitPost(post);
  },

  editPost: function (post, modifier, postId) {

    var user = Meteor.user();

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit
    if (!user || !can.edit(user, Posts.findOne(postId)))
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_post'));

    // ------------------------------ Callbacks ------------------------------ //

    // run all post submit server callbacks on modifier successively
    modifier = postEditMethodCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(result);
    }, modifier);

    // ------------------------------ Update ------------------------------ //

    Posts.update(postId, modifier);

    // ------------------------------ Callbacks ------------------------------ //

    // run all post submit server callbacks on modifier object successively
    modifier = postAfterEditMethodCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(result);
    }, modifier);

    // ------------------------------ After Update ------------------------------ //

    return Posts.findOne(postId);

  },

  setPostedAt: function(post, customPostedAt){

    var postedAt = new Date(); // default to current date and time

    if(isAdmin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;

    Posts.update(post._id, {$set: {postedAt: postedAt}});
  },

  approvePost: function(post){
    if(isAdmin(Meteor.user())){
      var set = {status: 2};

      // unless post is already scheduled and has a postedAt date, set its postedAt date to now
      if (!post.postedAt)
        set.postedAt = new Date();

      var result = Posts.update(post._id, {$set: set}, {validate: false});

      // --------------------- Server-Side Async Callbacks --------------------- //
      if (Meteor.isServer) {
        Meteor.defer(function () { // use defer to avoid holding up client
          // run all post submit server callbacks on post object successively
          post = postApproveCallbacks.reduce(function(result, currentFunction) {
              return currentFunction(result);
          }, post);
        });
      }

    }else{
      flashMessage('You need to be an admin to do that.', "error");
    }
  },

  unapprovePost: function(post){
    if(isAdmin(Meteor.user())){
      Posts.update(post._id, {$set: {status: 1}});
    }else{
      flashMessage('You need to be an admin to do that.', "error");
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

  increasePostClicks: function(postId, sessionId){
    this.unblock();

    // only let clients increment a post's click counter once per session
    var click = {_id: postId, userId: this.userId, sessionId: sessionId};

    if(_.where(postClicks, click).length == 0){
      postClicks.push(click);
      Posts.update(postId, { $inc: { clickCount: 1 }});
    }
  },

  deletePostById: function(postId) {
    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments after all

    var post = Posts.findOne({_id: postId});

    if(!Meteor.userId() || !can.editById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');

    // decrement post count
    Meteor.users.update({_id: post.userId}, {$inc: {postCount: -1}});

    // delete post
    Posts.remove(postId);
  }

});
