postSchemaObject = {
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  postedAt: {
    type: Date,
    optional: true
  },    
  title: {
    type: String,
    label: "Title"
  },
  url: {
    type: String,
    label: "URL",
    optional: true
  },
  body: {
    type: String,
    optional: true
  },
  htmlBody: {
    type: String,
    optional: true
  },
  commentsCount: {
    type: Number,
    optional: true
  },
  commenters: {
    type: [String],
    optional: true
  },
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  clicks: {
    type: Number,
    optional: true
  },
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  upvotes: {
    type: Number,
    optional: true
  },
  upvoters: {
    type: [String], // XXX
    optional: true
  },
  downvotes: {
    type: Number,
    optional: true
  },
  downvoters: {
    type: [String], // XXX
    optional: true
  },
  score: {
    type: Number,
    decimal: true,
    optional: true
  },
  status: {
    type: Number,
    optional: true
  },
  sticky: {
    type: Boolean,
    optional: true
  },
  inactive: {
    type: Boolean,
    optional: true
  },
  userId: {
    type: String, // XXX
    optional: true
  }
};

// add any extra properties to postSchemaObject (provided by packages for example)
_.each(addToPostSchema, function(item){
  postSchemaObject[item.propertyName] = item.propertySchema;
});

Posts = new Meteor.Collection("posts");

PostSchema = new SimpleSchema(postSchemaObject);
Posts.attachSchema(PostSchema);

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

Posts.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'title', 'url', 'body', 'shortUrl', 'shortTitle', 'categories').length > 0);
  }
});

Posts.allow({
  update: canEditById,
  remove: canEditById
});

clickedPosts = [];

getPostProperties = function(post) {

  var postAuthor = Meteor.users.findOne(post.userId);
  var p = {
    postAuthorName : getDisplayName(postAuthor),
    postTitle : cleanUp(post.title),
    profileUrl: getProfileUrlById(post.userId),
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

Posts.before.insert(function (userId, doc) {
  if(Meteor.isServer && !!doc.body)
    doc.htmlBody = sanitize(marked(doc.body));
});

Posts.before.update(function (userId, doc, fieldNames, modifier, options) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set = modifier.$set || {};
    modifier.$set.htmlBody = sanitize(marked(modifier.$set.body));
  }
});

Meteor.methods({
  post: function(post){
    var title = cleanUp(post.title),
        body = post.body,
        userId = this.userId,
        user = Meteor.users.findOne(userId),
        timeSinceLastPost=timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts),
        postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
        maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 30))),
        postId = '';
    

    // ------------------------------ Checks ------------------------------ //

    // check that user can post
    if (!user || !canPost(user))
      throw new Meteor.Error(601, i18n.t('You need to login or be invited to post new stories.'));

    // check that user provided a title
    if(!post.title)
      throw new Meteor.Error(602, i18n.t('Please fill in a title'));


    if(!!post.url){
      // check that there are no previous posts with the same link in the past 6 months
      var sixMonthsAgo = moment().subtract(6, 'months').toDate();
      var postWithSameLink = Posts.findOne({url: post.url, postedAt: {$gte: sixMonthsAgo}});

      if(typeof postWithSameLink !== 'undefined'){
        Meteor.call('upvotePost', postWithSameLink);
        throw new Meteor.Error(603, i18n.t('This link has already been posted'), postWithSameLink._id);
      }
    }

    if(!isAdmin(Meteor.user())){
      // check that user waits more than X seconds between posts
      if(!this.isSimulation && timeSinceLastPost < postInterval)
        throw new Meteor.Error(604, i18n.t('Please wait ')+(postInterval-timeSinceLastPost)+i18n.t(' seconds before posting again'));

      // check that the user doesn't post more than Y posts per day
      if(!this.isSimulation && numberOfPostsInPast24Hours > maxPostsPer24Hours)
        throw new Meteor.Error(605, i18n.t('Sorry, you cannot submit more than ')+maxPostsPer24Hours+i18n.t(' posts per day'));
    }

    // ------------------------------ Properties ------------------------------ //

    // Basic Properties
    properties = {
      title: title,
      body: body,
      userId: userId,
      author: getDisplayNameById(userId),
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      baseScore: 0,
      score: 0,
      inactive: false
    };

    // UserId    
    if(isAdmin(Meteor.user()) && !!post.userId){ // only let admins post as other users
      properties.userId = post.userId; 
    }

    // Status
    var defaultPostStatus = getSetting('requirePostsApproval') ? STATUS_PENDING : STATUS_APPROVED;
    if(isAdmin(Meteor.user()) && !!post.status){ // if user is admin and a custom status has been set
      properties.status = post.status;
    }else{ // else use default status
      properties.status = defaultPostStatus; 
    }

    // CreatedAt
    properties.createdAt = new Date();

    // PostedAt
    if(properties.status == 2){ // only set postedAt if post is approved
      if(isAdmin(Meteor.user()) && !!post.postedAt){ // if user is admin and a custom postDate has been set
        properties.postedAt = post.postedAt;
      }else{ // else use current time
        properties.postedAt = new Date();
      }
    }

    post = _.extend(post, properties);

    // ------------------------------ Callbacks ------------------------------ //

    // run all post submit server callbacks on post object successively
    post = postSubmitMethodCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(result);
    }, post);

    // ------------------------------ Insert ------------------------------ //

    // console.log(post)
    post._id = Posts.insert(post);

    // ------------------------------ Callbacks ------------------------------ //

    // run all post submit server callbacks on post object successively
    post = postAfterSubmitMethodCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(result);
    }, post);

    // ------------------------------ Post-Insert ------------------------------ //

    // increment posts count
    Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});

    var postAuthor =  Meteor.users.findOne(post.userId);

    Meteor.call('upvotePost', post, postAuthor);

    return post;
  },
  setPostedAt: function(post, customPostedAt){

    var postedAt = new Date(); // default to current date and time
        
    if(isAdmin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;

    Posts.update(post._id, {$set: {postedAt: postedAt}});
  },
  post_edit: function(post){
    // TODO: make post_edit server-side?
  },
  approvePost: function(post){
    if(isAdmin(Meteor.user())){
      var now = new Date();
      Posts.update(post._id, {$set: {status: 2, postedAt: now}});
    }else{
      throwError('You need to be an admin to do that.');
    }
  },
  unapprovePost: function(post){
    if(isAdmin(Meteor.user())){
      Posts.update(post._id, {$set: {status: 1}});
    }else{
      throwError('You need to be an admin to do that.');
    }
  },
  clickedPost: function(post, sessionId){
    // only let clients increment a post's click counter once per session
    var click = {_id: post._id, sessionId: sessionId};
    if(_.where(clickedPosts, click).length == 0){
      clickedPosts.push(click);
      Posts.update(post._id, { $inc: { clicks: 1 }});
    }
  },
  deletePostById: function(postId) {
    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments after all

    // decrement post count
    var post = Posts.findOne({_id: postId});
    if(!Meteor.userId() || !canEditById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');
    
    Meteor.users.update({_id: post.userId}, {$inc: {postCount: -1}});
    Posts.remove(postId);
  }
});
