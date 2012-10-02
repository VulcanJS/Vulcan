// Template.post_edit.preserve(['#title', '#url', '#editor', '#sticky']);

// Template.post_edit.preserve({
//   // 'input[id]': function (node) { return node.id; }
//    '[name]': function(node) { return node.getAttribute('name');}
// });

Template.post_edit.helpers({
  post: function(){
    // The idea here is to isolate the call to findOne() so that it stops
    // being reactive once data is found. The reason being that server scoring
    // updates will 'change' the post, and meteor will overwrite the user's
    // input, even if preserve is set. 
    // Kind of like {{#constant}}, except it waits for data.
    // 
    // XXX: either figure out a different approach, or factor this out and
    // use everywhere.
    var outerContext = Meteor.deps.Context.current;
    var innerContext = new Meteor.deps.Context;
    var post;
    
    innerContext.onInvalidate(function() {
      // we don't need to send the invalidate through anymore if post is set
      post || outerContext.invalidate();
    });
    
    innerContext.run(function() {
      post = Posts.findOne(Session.get('selectedPostId'));
    })
    
    return post;
  }
});

Template.post_edit.rendered = function(){
  var post= Posts.findOne(Session.get('selectedPostId'));
  if(post && !this.editor){
    this.editor= new EpicEditor(EpicEditorOptions).load();  
    this.editor.importFile('editor',post.body);
  }
}

Template.post_edit.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var selectedPostId=Session.get('selectedPostId');
    var title= $('#title').val();
    var url = $('#url').val();
    var body = instance.editor.exportFile();
    var sticky=!!$('#sticky').attr('checked');
    console.log('sticky:', sticky);

    Posts.update(selectedPostId,
    {
        $set: {
            headline: title
          , url: url
          , body: body
          , sticky: sticky
        }
      }
    );

    trackEvent("edit post", {'postId': selectedPostId});

    Router.navigate("posts/"+selectedPostId, {trigger:true});
  }

  , 'click .delete-link': function(e){
    e.preventDefault();
    if(confirm("Are you sure?")){
      var selectedPostId=Session.get('selectedPostId');
      Posts.remove(selectedPostId);
      Router.navigate("posts/deleted", {trigger:true});
    }
  }
};