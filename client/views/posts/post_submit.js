Template.post_submit.helpers({
  categories: function(){
    return Categories.find();
  },
  users: function(){
    return Meteor.users.find();
  },
  userName: function(){
    return getDisplayName(this);
  },
  isSelected: function(){
    var post=Posts.findOne(Session.get('selectedPostId'));
    return post && this._id == post.userId;
  }
});

Template.post_submit.rendered = function(){
  Session.set('selectedPostId', null);
}

Template.post_submit.rendered = function(){
  this.editor= new EpicEditor(EpicEditorOptions).load();
  $('#submitted').datepicker().on('changeDate', function(ev){
    $('#submitted_hidden').val(moment(ev.date).valueOf());
  });
}


Template.post_submit.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();

    $(e.target).addClass('disabled');

    if(!Meteor.user()){
      throwError('You must be logged in.');
      return false;
    }

    var title= $('#title').val();
    var url = $('#url').val();
    var body = instance.editor.exportFile();
    var categories=[];
    var sticky=!!$('#sticky').attr('checked');
    var submitted = $('#submitted_hidden').val();
    var userId = $('#postUser').val();
    var status = parseInt($('input[name=status]:checked').val());

    $('input[name=category]:checked').each(function() {
       categories.push($(this).val());
     });

    Meteor.call('post', {
        headline: title
      , body: body
      , url: url
      , categories: categories
      , sticky: sticky
      , submitted: submitted
      , userId: userId
      , status: status
    }, function(error, post) {
      if(error){
        console.log(error);
        throwError(error.reason);
        clearSeenErrors();
        $(e.target).removeClass('disabled');
        if(error.error == 603)
          Router.navigate('/posts/'+error.details, {trigger:true});
      }else{
        trackEvent("new post", {'postId': post.postId});
        if(post.status === STATUS_PENDING)
          throwError('Thanks, your post is awaiting approval.')
        Router.navigate('posts/'+post.postId, {trigger: true});
      }
    });
  }

  ,'click .get-title-link': function(e){
    e.preventDefault();
    var url=$("#url").val();
    $(".get-title-link").addClass("loading");
    if(url){
      $.get(url, function(response){
          if ((suggestedTitle=((/<title>(.*?)<\/title>/m).exec(response.responseText))) != null){
              $("#title").val(suggestedTitle[1]);
          }else{
              alert("Sorry, couldn't find a title...");
          } 
          $(".get-title-link").removeClass("loading");
       });  
    }else{
      alert("Please fill in an URL first!");
    }
  }
};