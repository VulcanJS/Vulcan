// TODO: switch over to Tom's migration package.

// database migrations
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations
Migrations = new Meteor.Collection('migrations');

Meteor.startup(function () {
  allMigrations = Object.keys(migrationsList);
  _.each(allMigrations, function(migrationName){
    runMigration(migrationName);
  });
});

Meteor.methods({
  removeMigration: function (name) {
    if (Users.is.admin(Meteor.user())) {
      console.log('// removing migration: ' + name);
      Migrations.remove({name: name});
    }
  }
});

// wrapper function for all migrations
var runMigration = function (migrationName) {
  var migration = Migrations.findOne({name: migrationName});

  if (migration){
    if(typeof migration.finishedAt === 'undefined'){
      // if migration exists but hasn't finished, remove it and start fresh
      console.log('!!! Found incomplete migration "'+migrationName+'", removing and running again.');
      Migrations.remove({name: migrationName});
    }else{
      // do nothing
      // console.log('Migration "'+migrationName+'" already exists, doing nothing.')
      return;
    }
  }

  console.log("//----------------------------------------------------------------------//");
  console.log("//------------//    Starting "+migrationName+" Migration    //-----------//");
  console.log("//----------------------------------------------------------------------//");
  Migrations.insert({name: migrationName, startedAt: new Date(), completed: false});

  // execute migration function
  var itemsAffected = migrationsList[migrationName]() || 0;

  Migrations.update({name: migrationName}, {$set: {finishedAt: new Date(), completed: true, itemsAffected: itemsAffected}});
  console.log("//----------------------------------------------------------------------//");
  console.log("//------------//     Ending "+migrationName+" Migration     //-----------//");
  console.log("//----------------------------------------------------------------------//");
};

var migrationsList = {
  updatePostStatus: function () {
    var i = 0;
    Posts.find({status: {$exists : false}}).forEach(function (post) {
      i++;
      Posts.update(post._id, {$set: {status: 2}});
      console.log("---------------------");
      console.log("Post: "+post.title);
      console.log("Updating status to approved");
    });
    return i;
  },
  updateCategories: function () {
    if (typeof Categories === "undefined" || Categories === null) return;
    var i = 0;
    Categories.find({slug: {$exists : false}}).forEach(function (category) {
        i++;
        var slug = Telescope.utils.slugify(category.name);
        Categories.update(category._id, {$set: {slug: slug}});
        console.log("---------------------");
        console.log("Category: "+category.name);
        console.log("Updating category with new slug: "+slug);
    });
    return i;
  },
  updatePostCategories: function () {
    if (typeof Categories === "undefined" || Categories === null) return;
    var i = 0;
    Posts.find().forEach(function (post) {
      i++;
      var oldCategories = post.categories;
      var newCategories = [];
      var category = {};
      var updating = false; // by default, assume we're not going to do anything

      // iterate over the post.categories array
      // if the post has no categories then nothing will happen
      _.each(oldCategories, function(value){
        // make sure the categories are strings
        if((typeof value === "string") && (category = Categories.findOne({name: value}))){
          // if value is a string, then look for the matching category object
          // and if it exists push it to the newCategories array
          updating = true; // we're updating at least one category for this post
          newCategories.push(category);
        }else{
          // if category A) is already an object, or B) it's a string but a matching category object doesn't exist
          // just keep the current value
          newCategories.push(value);
        }
      });

      if(updating){
        // update categories property on post
        Posts.update(post._id, {$set: {categories: newCategories}});
      }

      // START CONSOLE LOGS
      console.log("---------------------");
      console.log("Post: "+post.title);
      if(updating){
        console.log(oldCategories.length+" categories: "+oldCategories);
        console.log("Updating categories array to: ");
        console.log(newCategories);
      }else{
        console.log("No updates");
      }
      // END CONSOLE LOGS
    });
    return i;
  },
  updateUserProfiles: function () {
    var i = 0;
    var allUsers = Meteor.users.find();
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;
      console.log('> Updating user '+user._id+' ('+user.username+')');

      var properties = {};
      properties.telescope = {};
      // update user slug
      if(Users.getUserName(user))
        properties.slug = Telescope.utils.slugify(Users.getUserName(user));

      // update user isAdmin flag
      if(typeof user.isAdmin === 'undefined')
        properties.isAdmin = false;

      // update postCount
      var postsByUser = Posts.find({userId: user._id});
      properties.telescope.postCount = postsByUser.count();

      // update commentCount
      var commentsByUser = Comments.find({userId: user._id});
      properties.telescope.commentCount = commentsByUser.count();

      Meteor.users.update(user._id, {$set:properties});

    });
    return i;
  },
  resetUpvotesDownvotes: function () {
    var i = 0;
    Posts.find().forEach(function (post) {
      i++;
      var upvotes = 0,
          downvotes = 0;
      console.log("Post: "+post.title);
      if(post.upvoters){
        upvotes = post.upvoters.length;
        console.log("Found "+upvotes+" upvotes.");
      }
      if(post.downvoters){
        downvotes = post.downvoters.length;
        console.log("Found "+downvotes+" downvotes.");
      }
      Posts.update(post._id, {$set: {upvotes: upvotes, downvotes: downvotes}});
      console.log("---------------------");
    });
    return i;
  },
  resetCommentsUpvotesDownvotes: function () {
    var i = 0;
    Comments.find().forEach(function (comment) {
      i++;
      var upvotes = 0,
          downvotes = 0;
      console.log("Comment: "+comment._id);
      if(comment.upvoters){
        upvotes = comment.upvoters.length;
        console.log("Found "+upvotes+" upvotes.");
      }
      if(comment.downvoters){
        downvotes = comment.downvoters.length;
        console.log("Found "+downvotes+" downvotes.");
      }
      Comments.update(comment._id, {$set: {upvotes: upvotes, downvotes: downvotes}});
      console.log("---------------------");
    });
    return i;
  },
  headlineToTitle: function () {
    var i = 0;
    Posts.find({title: {$exists : false}}).forEach(function (post) {
      i++;
      console.log("Post: "+post.headline+" "+post.title);
      Posts.update(post._id, { $rename: { 'headline': 'title'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  commentsSubmittedToCreatedAt: function () {
    var i = 0;
    Comments.find({createdAt: {$exists: false}}).forEach(function (comment) {
      i++;
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'submitted': 'createdAt'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  commentsPostToPostId: function () {
    var i = 0;
    Comments.find({postId: {$exists : false}}).forEach(function (comment) {
      i++;
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'post': 'postId'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  createdAtSubmittedToDate: function () {
    var i = 0;
    Posts.find().forEach(function (post) {
      if(typeof post.submitted === "number" || typeof post.createdAt === "number"){
        i++;
        console.log("Posts: "+post.title);
        var createdAt = new Date(post.createdAt);
        var submitted = new Date(post.submitted);
        console.log(createdAt);
        Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
        console.log("---------------------");
      }
    });
    return i;
  },
  commentsCreatedAtToDate: function () {
    var i = 0;
    Comments.find().forEach(function (comment) {
      if(typeof comment.createdAt === "number"){
        i++;
        console.log("Comment: "+comment._id);
        var createdAt = new Date(comment.createdAt);
        console.log(createdAt);
        Comments.update(comment._id, { $set: { 'createdAt': createdAt}}, {multi: true, validate: false});
        console.log("---------------------");
      }
    });
    return i;
  },
  submittedToPostedAt: function () {
    var i = 0;
    Posts.find({postedAt: {$exists : false}}).forEach(function (post) {
      i++;
      console.log("Post: "+post._id);
      Posts.update(post._id, { $rename: { 'submitted': 'postedAt'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  addPostedAtToComments: function () {
    var i = 0;
    Comments.find({postedAt: {$exists : false}}).forEach(function (comment) {
      i++;
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $set: { 'postedAt': comment.createdAt}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  parentToParentCommentId: function () {
    var i = 0;
    Comments.find({parent: {$exists: true}, parentCommentId: {$exists : false}}).forEach(function (comment) {
      i++;
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $set: { 'parentCommentId': comment.parent}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  addLastCommentedAt: function () {
    var i = 0;
    Posts.find({$and: [
      {$or: [{comments: {$gt: 0}}, {commentCount: {$gt: 0}}]},
      {lastCommentedAt: {$exists : false}}
    ]}).forEach(function (post) {
      i++;
      console.log("Post: "+post._id);
      var postComments = Comments.find({$or: [{postId: post._id}, {post: post._id}]}, {sort: {postedAt: -1}}).fetch();
      var lastComment;
      if (_.isEmpty(postComments)) {
        console.log('postComments from post '+post._id+' is empty. Skipping.');
        return;
      }
      lastComment = postComments[0];
      Posts.update(post._id, { $set: { lastCommentedAt: lastComment.postedAt}}, {multi: false, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  commentsToCommentCount: function () {
    var i = 0;
    Posts.find({comments: {$exists : true}, commentCount: {$exists : false}}).forEach(function (post) {
      i++;
      console.log("Post: "+post._id);
      Posts.update(post._id, { $set: { 'commentCount': post.comments}, $unset: { 'comments': ''}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  addCommentersToPosts: function () {
    var i = 0;
    Comments.find().forEach(function (comment) {
      i++;
      console.log("Comment: "+comment._id);
      console.log("Post: "+comment.postId);
      Posts.update(comment.postId, { $addToSet: { 'commenters': comment.userId}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  moveVotesFromProfile: function () {
    var i = 0;
    Meteor.users.find().forEach(function (user) {
      i++;
      console.log("User: "+user._id);
      Meteor.users.update(user._id, {
        $rename: {
          'profile.upvotedPosts': 'telescope.upvotedPosts',
          'profile.downvotedPosts': 'telescope.downvotedPosts',
          'profile.upvotedComments': 'telescope.upvotedComments',
          'profile.downvotedComments': 'telescope.downvotedComments'
        }
      }, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  addHTMLBody: function () {
    var i = 0;
    Posts.find({body: {$exists : true}}).forEach(function (post) {
      i++;
      var htmlBody = Telescope.utils.sanitize(marked(post.body));
      console.log("Post: "+post._id);
      Posts.update(post._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  addHTMLComment: function () {
    var i = 0;
    Comments.find({body: {$exists : true}}).forEach(function (comment) {
      i++;
      var htmlBody = Telescope.utils.sanitize(marked(comment.body));
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  clicksToClickCount: function () {
    var i = 0;
    Posts.find({"clicks": {$exists: true}, "clickCount": {$exists : false}}).forEach(function (post) {
      i++;
      console.log("Post: " + post._id);
      Posts.update(post._id, { $set: { 'clickCount': post.clicks}, $unset: { 'clicks': ''}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  commentsCountToCommentCount: function () {
    var i = 0;
    Posts.find({"commentCount": {$exists : false}}).forEach(function (post) {
      i++;
      console.log("Post: " + post._id);
      Posts.update({_id: post._id}, { $set: { 'commentCount': post.commentsCount}, $unset: {'commentsCount': ""}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  userDataCommentsCountToCommentCount: function(){
    var i = 0;
    Meteor.users.find({'commentCount': {$exists: false}}).forEach(function(user){
      i++;
      var commentCount = Comments.find({userId: user._id}).count();
      console.log("User: " + user._id);
      Meteor.users.update(user._id, {$set: { telescope : {'commentCount': commentCount}}});
      console.log("---------------------");
    });
    return i;
   },
  clicksToClickCountForRealThisTime: function () { // since both fields might be co-existing, add to clickCount instead of overwriting it
    var i = 0;
    Posts.find({'clicks': {$exists: true}}).forEach(function (post) {
      i++;
      console.log("Post: " + post._id);
      Posts.update(post._id, { $inc: { 'clickCount': post.clicks}, $unset: {'clicks': ""}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  normalizeCategories: function () {
    var i = 0;
    Posts.find({'categories': {$exists: true}}).forEach(function (post) {
      i++;
      console.log("Post: " + post._id);
      var justCategoryIds = post.categories.map(function (category){
        return category._id;
      });
      Posts.update(post._id, {$set: {categories: justCategoryIds, oldCategories: post.categories}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  cleanUpStickyProperty: function () {
    var i = 0;
    Posts.find({'sticky': {$exists: false}}).forEach(function (post) {
      i++;
      console.log("Post: " + post._id);
      Posts.update(post._id, {$set: {sticky: false}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  show0112ReleaseNotes: function () {
    var i = 0;
    // if this is the 0.11.2 update, the first run event will not exist yet.
    // if that's the case, make sure to still show release notes
    if (!Events.findOne({name: 'firstRun'})) {
      Releases.update({number:'0.11.2'}, {$set: {read:false}});
    }
    return i;
  },
  removeThumbnailHTTP: function () {
    var i = 0;
    Posts.find({thumbnailUrl: {$exists : true}}).forEach(function (post) {
      i++;
      var newThumbnailUrl = post.thumbnailUrl.replace("http:", "");
      console.log("Post: "+post._id);
      Posts.update(post._id, { $set: { 'thumbnailUrl': newThumbnailUrl}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    return i;
  },
  updateUserNames: function () {
    var i = 0;
    var allUsers = Meteor.users.find({username: {$exists: true}, profile: {$exists: true}, 'profile.isDummy': {$ne: true}});

    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;

      // Perform the same transforms done by useraccounts with `lowercaseUsernames` set to `true`
      var oldUsername = user.username;
      var username = user.username;
      username = username.trim().replace(/\s+/gm, ' ');
      user.profile.username = user.profile.name || username;
      delete user.profile.name;
      username = username.toLowerCase().replace(/\s+/gm, '');
      user.username = username;

      if (user.emails && user.emails.length > 0) {
        _.each(user.emails, function(email){
          email.address = email.address.toLowerCase().replace(/\s+/gm, '');
        });
      }

      console.log('> Updating user '+user._id+' ('+oldUsername+' -> ' + user.username + ')');

      try {
        Meteor.users.update(user._id, {
          $set: {
            emails: user.emails,
            profile: user.profile,
            username: user.username,
          },
        });
      }
      catch (err) {
        console.warn('> Unable to convert username ' + user.username + ' to lowercase!');
        console.warn('> Please try to fix it by hand!! :(');
      }
    });
    return i;
  },
  changeColorNames: function () {
    var i = 0;
    var settings = Settings.findOne();
    var set = {};

    if (!!settings) {

      if (!!settings.buttonColor)
        set.accentColor = settings.buttonColor;

      if (!!settings.buttonTextColor)
        set.accentContrastColor = settings.buttonTextColor;

      if (!!settings.buttonColor)
        set.secondaryColor = settings.headerColor;

      if (!!settings.buttonColor)
        set.secondaryContrastColor = settings.headerTextColor;

      if (!_.isEmpty(set)) {
        Settings.update(settings._id, {$set: set}, {validate: false});
      }

    }
    return i;
  },
  migrateUserProfiles: function () {
    var i = 0;
    var allUsers = Meteor.users.find({telescope: {$exists: false}});
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;

      console.log('> Updating user '+user._id+' (' + user.username + ')');

      var telescopeUserData = {};

      // loop over user data schema
      _.each(Telescope.schemas.userData._schema, function (property, key) {

        if (!!user[key]) { // look for property on root of user object
          telescopeUserData[key] = user[key];
        } else if (user.votes && !!user.votes[key]) { // look for it in user.votes object
          telescopeUserData[key] = user.votes[key];
        } else if (user.profile && user.profile[key]) { // look for it in user.profile object
          telescopeUserData[key] = user.profile[key];
        }
        
      });

      // console.log(telescopeUserData);

      try {
        Meteor.users.update(user._id, {
          $set: {
            telescope: telescopeUserData
          }
        });
      } catch (err) {
        console.log(err);
        console.warn('> Unable to migrate profile for user ' + user.username);
      }
    });
    return i;
  },
  migrateEmailHash: function () {
    var i = 0;
    var allUsers = Meteor.users.find({$and: [{"email_hash": {$exists: true}}, {"telescope.emailHash": {$exists: false}}]});
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;

      console.log('> Updating user '+user._id+' (' + user.username + ')');

      var emailHash = user.email_hash;
      if (!!emailHash) {
        Meteor.users.update(user._id, {$set: {"telescope.emailHash": emailHash}});
      }
    });
    return i;
  },
  // addTopLevelCommentIdToComments: function() {
  //   var i = 0;

  //   // find all root comments and set topLevelCommentId on their root children
  //   Comments.find({parentCommentId: {$exists : false}}).forEach(function (comment) {
      
  //     // topLevelCommentId is the root comment._id
  //     var topLevelCommentId = comment._id;
  //     console.log("Root Comment found: " + topLevelCommentId);
      
  //     // find childComments that have this root comment as parentCommentId
  //     Comments.find({parentCommentId: comment._id}).forEach(function (childComment) {
  //       i++;
  //       updateParentAndChild(topLevelCommentId, childComment._id);
  //     });
    
  //   });
    
  //   function updateParentAndChild(topLevelCommentId, parentId) {
    
  //     i++;
  //     console.log("Parent Comment: " + parentId, " top level comment " + topLevelCommentId);
     
  //     Comments.update(parentId, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false});
    
  //     var childComments = Comments.find({topLevelCommentId: {$exists : false}, parentCommentId: parentId});
    
  //     console.log('> Found '+childComments.count()+' child comments.\n');
    
  //     childComments.forEach(function(childComment){
  //       i++;
    
  //       // find all nested childComments and set topLevelCommentId
  //       console.log("Child Comment: " + childComment._id, " top level comment " + topLevelCommentId);
    
  //       // set nested childComment to use parent's topLevelCommentId
  //       Comments.update(childComment._id, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false});
  //       updateParentAndChild(topLevelCommentId, childComment._id, true);
  //     });
    
  //   }
  //   console.log("---------------------");
  //   return i;
  // },
  migrateDisplayName: function () {
    var i = 0;
    var displayName;
    var allUsers = Meteor.users.find({"telescope.displayName": {$exists: false}});
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;

      console.log('> Updating user '+user._id+' (' + user.username + ')');
      if (!!user.profile) {
        displayName = user.profile.name || user.profile.username;
      } else {
        displayName = user.username;
      }

      console.log('name: ', displayName);
      if (!!displayName) {
        Meteor.users.update(user._id, {$set: {"telescope.displayName": displayName}});
      } else {
        console.log("displayName not found :(");
      }
    });
    return i;
  },  
  migrateNewsletterSettings: function () {
    var i = 0;
    var allUsers = Meteor.users.find({
      $or: [
        {"profile.showBanner": {$exists: true}},
        {"profile.subscribedToNewsletter": {$exists: true}}
      ]
    });
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
      i++;
      var displayName;

      if (!!user.profile) {
        displayName = user.profile.name || user.profile.username;
      } else {
        displayName = user.username;
      }

      console.log('> Updating user '+user._id+' (' + displayName + ')');

      if (user.profile) {

        var set = {};

        var showBanner = user.profile.showBanner;
        if (typeof showBanner !== "undefined") {
          set["telescope.newsletter.showBanner"] = showBanner;
        }

        var subscribeToNewsletter = user.profile.subscribedToNewsletter;
        if (typeof subscribeToNewsletter !== "undefined") {
          set["telescope.newsletter.subscribeToNewsletter"] = subscribeToNewsletter;
        }
        console.log(set)
        if (!_.isEmpty(set)) {
          Meteor.users.update(user._id, {$set: set});
        }

      }

    });
    return i;
  },
  addSlugsToPosts: function () {
    var i = 0;
    Posts.find({slug: {$exists : false}}).forEach(function (post) {
      i++;
      var slug = Telescope.utils.slugify(post.title);
      console.log("Post: "+post._id + " | "+slug);
      Posts.update(post._id, { $set: { 'slug': slug}});
      console.log("---------------------");
    });
    return i;
  }
};

// TODO: normalize categories?
