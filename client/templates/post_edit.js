// Template.post_edit.preserve(['#title', '#url', '#editor']);

Template.post_edit.helpers({
  post: function(){
    return Posts.findOne(Session.get('selectedPostId'));
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

    Posts.update(selectedPostId,
    {
        $set: {
            headline: title
          , url: url
          , body: body
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