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
        console.log("Post: "+post.headline);
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
      console.log("Post: "+post.headline);
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

});