// database migrations
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations
Migrations = new Meteor.Collection('migrations');

Meteor.startup(function () {
  allMigrations = Object.keys(migrationsList);
  console.log(allMigrations)
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
    Migrations.insert({name: migrationName, startedAt: new Date(), finished: false});

    // execute migration function
    migrationsList[migrationName]();

    Migrations.update({name: migrationName}, {$set: {finishedAt: new Date(), finished: true}});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending "+migrationName+" Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }
}

var migrationsList = {
  updatePostStatus: function () {
    Posts.find({status: {$exists : false}}).forEach(function (post) {
      Posts.update(post._id, {$set: {status: 2}});
      console.log("---------------------");
      console.log("Post: "+post.title);
      console.log("Updating status to approved");  
    });
  },
  updateCategories: function () {
    Categories.find().forEach(function (category) {
      if(typeof category.slug === "undefined"){
        var slug = slugify(category.name);
        Categories.update(category._id, {$set: {slug: slug}});
        console.log("---------------------");
        console.log("Category: "+category.name);
        console.log("Updating category with new slug: "+slug);
      }
    });
  },
  updatePostCategories: function () {
    Posts.find().forEach(function (post) {
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
  },
  updateUserProfiles: function () {
    var allUsers = Meteor.users.find();
    console.log('> Found '+allUsers.count()+' users.\n');

    allUsers.forEach(function(user){
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
  },
  resetUpvotesDownvotes: function () {
    Posts.find().forEach(function (post) {
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
  },
  resetCommentsUpvotesDownvotes: function () {
    Comments.find().forEach(function (comment) {
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
  },
  headlineToTitle: function () {
    Posts.find().forEach(function (post) {
      console.log("Post: "+post.headline+" "+post.title);
      Posts.update(post._id, { $rename: { 'headline': 'title'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
  },
  commentsSubmittedToCreatedAt: function () {
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'submitted': 'createdAt'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
  },
  commentsPostToPostId: function () {
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'post': 'postId'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
  },
  createdAtSubmittedToDate: function () {
    Posts.find().forEach(function (post) {
      console.log("Posts: "+post.title);
      var createdAt = new Date(post.createdAt);
      var submitted = new Date(post.submitted);
      console.log(createdAt)
      Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
      console.log("---------------------");
    });
  },
  commentsCreatedAtToDate: function () {
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      var createdAt = new Date(comment.createdAt);
      console.log(createdAt)
      Comments.update(comment._id, { $set: { 'createdAt': createdAt}}, {multi: true, validate: false});
      console.log("---------------------");
    });
  }
}