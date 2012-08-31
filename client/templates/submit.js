Template.submit.events = {
  'click input[type=submit]': function(){
    if(!Meteor.user()) throw 'You must be logged in.';

    var title= $('#title input').val();
    var url = $('#url input').val();

    var postId = Posts.insert({
        headline: title
      , url: url
      , submitter: Meteor.user().username
      , submitted: new Date().getTime()
      , votes: 0
      , comments: 0
    });
    var post = Posts.findOne(postId);

    Meteor.call('voteForPost', post);

    Session.set('selected_post', post);
    Session.set('state', 'view_post');
  }
};

Template.submit.show = function(){
  return Session.equals('state', 'submit');
};
