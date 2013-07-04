// Template.post_edit.preserve(['#title', '#url', '#editor', '#sticky']);

// Template.post_edit.preserve({
//   // 'input[id]': function (node) { return node.id; }
//    '[name]': function(node) { return node.getAttribute('name');}
// });

Template.post_edit.helpers({
  post: function(){
    return Posts.findOne(Session.get('selectedPostId'));
  },
  created: function(){
    var post= Posts.findOne(Session.get('selectedPostId'));
    return moment(post.createdAt).format("MMMM Do, h:mm:ss a");
  },
  categories: function(){
    var post = this;
    return Categories.find().map(function(category) {
      category.checked = _.contains(_.pluck(post.categories, '_id'), category._id) ? 'checked' : '';
      return category;
    });
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  },
  isSticky: function(){
    return this.sticky ? 'checked' : '';
  },
  isSelected: function(){
    // console.log('isSelected?')
    var post= Posts.findOne(Session.get('selectedPostId'));
    return post && this._id == post.userId ? 'selected' : '';
  },  
  submittedDate: function(){
    return moment(this.submitted).format("MM/DD/YYYY");
  },
  submittedTime: function(){
    return moment(this.submitted).format("HH:mm");
  },
  users: function(){
    return Meteor.users.find().fetch();
  },
  userName: function(){
    return getDisplayName(this);
  },
  hasStatusPending: function(){
    return this.status == STATUS_PENDING ? 'checked' : '';
  },
  hasStatusApproved: function(){
    return this.status == STATUS_APPROVED ? 'checked' : '';
  },
  hasStatusRejected: function(){
    return this.status == STATUS_REJECTED ? 'checked' : '';
  },
  shorten: function(){
    return !!getSetting('bitlyToken');
  }
});

Template.post_edit.rendered = function(){
  var post= Posts.findOne(Session.get('selectedPostId'));
  if(post && !this.editor){

    this.editor= new EpicEditor(EpicEditorOptions).load();  
    this.editor.importFile('editor',post.body);

    $('#submitted_date').datepicker();

  }
}

Template.post_edit.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    if(!Meteor.user()){
      throwError('You must be logged in.');
      return false;
    }

    var selectedPostId=Session.get('selectedPostId');
    var post = Posts.findOne(selectedPostId);
    var categories = [];
    var url = $('#url').val();
    var shortUrl = $('#short-url').val();
    var status = parseInt($('input[name=status]:checked').val());

    $('input[name=category]:checked').each(function() {
      var categoryId = $(this).val();
      if(category = Categories.findOne(categoryId))
        categories.push(category);
    });
    
    var properties = {
      headline:         $('#title').val(),
      shortUrl:         shortUrl, 
      body:             instance.editor.exportFile(),
      categories:       categories,
    };
    
    if(url){
      properties.url = (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") ? url : "http://"+url;
    }

    if(isAdmin(Meteor.user())){
      if(status == STATUS_APPROVED){
        if(!post.submitted){
          // this is the first time we are approving the post
          properties.submitted = new Date().getTime();
        }else if($('#submitted_date').exists()){
          properties.submitted = parseInt(moment($('#submitted_date').val()+$('#submitted_time').val(), "MM/DD/YYYY HH:mm").valueOf());
        }
      }
      adminProperties = {
        sticky:     !!$('#sticky').attr('checked'),
        userId:     $('#postUser').val(),
        status:     status,
      };
      properties = _.extend(properties, adminProperties);
    }

    Posts.update(selectedPostId,
    {
        $set: properties
      }
    ,function(error){
      if(error){
        console.log(error);
        throwError(error.reason);
      }else{
        trackEvent("edit post", {'postId': selectedPostId});
        Meteor.Router.to("/posts/"+selectedPostId);
      }
    }
    );
  }

  , 'click .delete-link': function(e){
    e.preventDefault();
    if(confirm("Are you sure?")){
      var selectedPostId=Session.get('selectedPostId');
      Posts.remove(selectedPostId);
      Meteor.Router.to("/posts/deleted");
    }
  }
};