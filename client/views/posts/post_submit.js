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
    
    Meteor.call('post', {
      headline: title,
      body: body,
      url: url
    }, function(error, postId) {
      if(error){
        console.log(error);
        throwError(error.reason);
      }else{
        trackEvent("new post", {'postId': postId});
        Router.navigate('posts/'+postId, {trigger: true});
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

Template.post_submit.rendered = function(){
  this.editor= new EpicEditor(EpicEditorOptions).load();
}