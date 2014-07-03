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

// wrapper function for all migrations
var runMigration = function (migrationName) {
  // migration updatePostStatus: make sure posts have a status
  if (!Migrations.findOne({name: migrationName})) {
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
  }
}

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
    var i = 0;
    Categories.find({slug: {$exists : false}}).forEach(function (category) {
        i++;
        var slug = slugify(category.name);
        Categories.update(category._id, {$set: {slug: slug}});
        console.log("---------------------");
        console.log("Category: "+category.name);
        console.log("Updating category with new slug: "+slug);
    
    });
    return i;
  },
  updatePostCategories: function () {
    var i = 0;
    Posts.find().forEach(function (post) {
      i++;
      var oldCategories = post.categories;
      var newCategories = [];
      var category = {};
      var updating = false; // by default, assume we're not going to do anything

      // iterate over the post.categories array
      // if the post has no categories then nothing will happen
      _.each(oldCategories, function(value, key, list){
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

      // update user slug
      if(getUserName(user))
        Meteor.users.update(user._id, {$set:{slug: slugify(getUserName(user))}});

      // update user isAdmin flag
      if(typeof user.isAdmin === 'undefined')
        Meteor.users.update(user._id, {$set: {isAdmin: false}});

      // update postCount
      var postsByUser = Posts.find({userId: user._id});
      Meteor.users.update(user._id, {$set: {postCount: postsByUser.count()}});
      
      // update commentCount
      var commentsByUser = Comments.find({userId: user._id});
      Meteor.users.update(user._id, {$set: {commentCount: commentsByUser.count()}});

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
        console.log("Found "+upvotes+" upvotes.")
      }
      if(post.downvoters){
        downvotes = post.downvoters.length;
        console.log("Found "+downvotes+" downvotes.")
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
        console.log("Found "+upvotes+" upvotes.")
      }
      if(comment.downvoters){
        downvotes = comment.downvoters.length;
        console.log("Found "+downvotes+" downvotes.")
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
    Comments.find().forEach(function (comment) {
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
      if(typeof post.submitted == "number" || typeof post.createdAt == "number"){
        i++;
        console.log("Posts: "+post.title);
        var createdAt = new Date(post.createdAt);
        var submitted = new Date(post.submitted);
        console.log(createdAt)
        Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
        console.log("---------------------");
      }
    });
    return i;
  },
  commentsCreatedAtToDate: function () {
    var i = 0;
    Comments.find().forEach(function (comment) {
      if(typeof comment.createdAt == "number"){
        i++;
        console.log("Comment: "+comment._id);
        var createdAt = new Date(comment.createdAt);
        console.log(createdAt)
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
  }
}