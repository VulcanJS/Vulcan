Meteor.startup(function(){
  Posts.allow({
      insert: function(){ return true; }
    , update: function(userId, post){
        return true;
    }
  });
});
