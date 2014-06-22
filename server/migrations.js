// database migrations
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations
Migrations = new Meteor.Collection('migrations');

Meteor.startup(function () {


 // migration updatePostStatus: make sure posts have a status
  if (!Migrations.findOne({name: "updatePostStatus"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//    Starting updatePostStatus Migration    //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Posts.find({status: {$exists : false}}).forEach(function (post) {
        Posts.update(post._id, {$set: {status: 2}});

        // START CONSOLE LOGS
        console.log("---------------------");
        console.log("Post: "+post.title);
        console.log("Updating status to approved");
        // END CONSOLE LOGS
      
    });
    Migrations.insert({name: "updatePostStatus"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending updatePostStatus Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }




 // migration updateCategories: make sure categories have slugs
  if (!Migrations.findOne({name: "updateCategories"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//    Starting updateCategories Migration    //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Categories.find().forEach(function (category) {
      if(typeof category.slug === "undefined"){
        var slug = slugify(category.name);
        Categories.update(category._id, {$set: {slug: slug}});

        // START CONSOLE LOGS
        console.log("---------------------");
        console.log("Category: "+category.name);
        console.log("Updating category with new slug: "+slug);
        // END CONSOLE LOGS
      }
    });
    Migrations.insert({name: "updateCategories"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending updateCategories Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }




  // migration updateCategories: store full category object in post instead of just the name
  if (!Migrations.findOne({name: "updatePostCategories"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting updatePostCategories Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
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
    Migrations.insert({name: "updatePostCategories"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending updateCategories Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration updateUserProfiles: update user profiles with slugs and a few other properties
  if (!Migrations.findOne({name: "updateUserProfiles"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting updateUserProfiles Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");

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
    Migrations.insert({name: "updateUserProfiles"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending updateUserProfiles Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration resetUpvotesDownvotes: reset upvotes and downvotes properties on each post
  if (!Migrations.findOne({name: "resetUpvotesDownvotes"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting resetUpvotesDownvotes Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
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
    Migrations.insert({name: "resetUpvotesDownvotes"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending resetUpvotesDownvotes Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration resetUpvotesDownvotes: reset upvotes and downvotes properties on each comment
  if (!Migrations.findOne({name: "resetCommentsUpvotesDownvotes"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting resetCommentsUpvotesDownvotes Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
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
    Migrations.insert({name: "resetCommentsUpvotesDownvotes"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending resetCommentsUpvotesDownvotes Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration headlineToTitle: change "headline" property to "title"
  if (!Migrations.findOne({name: "headlineToTitle"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting headlineToTitle Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Posts.find().forEach(function (post) {
      console.log("Post: "+post.headline+" "+post.title);
      Posts.update(post._id, { $rename: { 'headline': 'title'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    Migrations.insert({name: "headlineToTitle"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending headlineToTitle Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration commentsSubmittedToCreatedAt: change "submitted" property to "createdAt"
  if (!Migrations.findOne({name: "commentsSubmittedToCreatedAt"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting commentsSubmittedToCreatedAt Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'submitted': 'createdAt'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    Migrations.insert({name: "commentsSubmittedToCreatedAt"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending commentsSubmittedToCreatedAt Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration commentsPostToPostId: change "post" property to "postId"
  if (!Migrations.findOne({name: "commentsPostToPostId"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting commentsPostToPostId Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      Comments.update(comment._id, { $rename: { 'post': 'postId'}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    Migrations.insert({name: "commentsPostToPostId"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending commentsPostToPostId Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration createdAtSubmittedToDate: change posts' createdAt and submitted properties 
  // from unix timestamps to Date() objects
  if (!Migrations.findOne({name: "createdAtSubmittedToDate"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting createdAtSubmittedToDate Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Posts.find().forEach(function (post) {
      console.log("Posts: "+post.title);
      var createdAt = new Date(post.createdAt);
      var submitted = new Date(post.submitted);
      console.log(createdAt)
      Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    Migrations.insert({name: "createdAtSubmittedToDate"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending createdAtSubmittedToDate Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }

  // migration commentsCreatedAtToDate: change comments' createdAt property
  // from unix timestamps to Date() objects
  if (!Migrations.findOne({name: "commentsCreatedAtToDate"})) {
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//  Starting commentsCreatedAtToDate Migration  //-----------//");
    console.log("//----------------------------------------------------------------------//");
    Comments.find().forEach(function (comment) {
      console.log("Comment: "+comment._id);
      var createdAt = new Date(comment.createdAt);
      console.log(createdAt)
      Comments.update(comment._id, { $set: { 'createdAt': createdAt}}, {multi: true, validate: false});
      console.log("---------------------");
    });
    Migrations.insert({name: "commentsCreatedAtToDate"});
    console.log("//----------------------------------------------------------------------//");
    console.log("//------------//     Ending createdAtSubmittedToDate Migration     //-----------//");
    console.log("//----------------------------------------------------------------------//");
  }
});