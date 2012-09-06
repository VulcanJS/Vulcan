Template.post_submit.events = {
  'click input[type=submit]': function(event){
    event.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var title= $('#title').val();
    var url = $('#url').val();
    var body = $('#body').val();

    var postId = Posts.insert({
        headline: title
      , url: url
      , body: body
      , user_id: Meteor.user()._id
      , submitted: new Date().getTime()
      , votes: 0
      , comments: 0
    });
    var post = Posts.findOne(postId);

    Meteor.call('voteForPost', post);

    Session.set('selected_post', post);
    // Session.set('state', 'view_post');
    Router.navigate('posts/'+postId, {trigger: true});
  }
};