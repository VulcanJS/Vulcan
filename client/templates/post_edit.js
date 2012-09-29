// Template.post_edit.preserve(['#title', '#url', '#editor']);

Template.post_edit.helpers({
  post: function(){
    return Posts.findOne(Session.get('selected_post_id'));
  }
});

Template.post_edit.rendered = function(){
  var post= Posts.findOne(Session.get('selected_post_id'));
  if(post && !this.editor){
    this.editor= new EpicEditor(EpicEditorOptions).load();  
    this.editor.importFile('editor',post.body);
  }
}

Template.post_edit.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var selected_post_id=Session.get("selected_post_id");
    var title= $('#title').val();
    var url = $('#url').val();
    var body = instance.editor.exportFile();

    Posts.update(selected_post_id,
    {
        $set: {
            headline: title
          , url: url
          , body: body
        }
      }
    );
    Router.navigate("posts/"+selected_post_id, {trigger:true});
  }

  , 'click .delete-link': function(e){
    e.preventDefault();
    if(confirm("Are you sure?")){
      var selected_post_id=Session.get("selected_post_id");
      Posts.remove(selected_post_id);
      Router.navigate("posts/deleted", {trigger:true});
    }
  }
};