Template.post_edit.helpers({
  created: function(){
    return moment(this.createdAt).format("MMMM Do, h:mm:ss a");
  },
  categories: function(){
    var post = this;
    return Categories.find({}, {sort: {order: 1, name: 1}}).map(function(category) {
      category.checked = _.contains(_.pluck(post.categories, '_id'), category._id) ? 'checked' : '';
      return category;
    });
  },
  categoriesEnabled: function(){
    return Categories.find().count();
  },
  showPostedAt: function () {
    if((Session.get('currentPostStatus') || this.status) == STATUS_APPROVED){
      return 'visible'
    }else{
      return 'hidden'
    }
  },
  isSticky: function(){
    return this.sticky ? 'checked' : '';
  },
  isSelected: function(parentPost){
    return parentPost && this._id == parentPost.userId ? 'selected' : '';
  },
  postedAtDate: function(){
    return !!this.postedAt ? moment(this.postedAt).format("MM/DD/YYYY") : null;
  },
  postedAtTime: function(){
    return !!this.postedAt ? moment(this.postedAt).format("HH:mm") : null;
  },
  users: function(){
    return Meteor.users.find({}, {sort: {'profile.name': 1}});
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
  Session.set('currentPostStatus', this.status);

  var post = this.data.post;
  if(post && !this.editor){
    this.editor= new EpicEditor(EpicEditorOptions).load();
    this.editor.importFile('editor', post.body);

    $('#postedAtDate').datepicker();

  }


  // $("#postUser").selectToAutocomplete(); // XXX

}

Template.post_edit.events({
  'change input[name=status]': function (e, i) {
    Session.set('currentPostStatus', e.currentTarget.value);
  },
  'click input[type=submit]': function(e, instance){
    var post = this;

    e.preventDefault();
    if(!Meteor.user()){
      throwError('You must be logged in.');
      return false;
    }

    // ------------------------------ Properties ------------------------------ //

    // Basic Properties

    var properties = {
      title:         $('#title').val(),
      body:          instance.editor.exportFile()
    };

    // Categories

    var categoriesArray = [];
    $('input[name=category]:checked').each(function() {
      var categoryId = $(this).val();
      if(category = Categories.findOne(categoryId)){
        categoriesArray.push(category);
      }
    });
    properties.categoriesArray = categoriesArray;

    // URL

    var url = $('#url').val();
    if(!!url){
      properties.url = (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") ? url : "http://"+url;
    }

    // ShortURL

    var shortUrl = $('#short-url').val();
    if(!!shortUrl)
        properties.shortUrl = shortUrl;

    // ------------------------------ Admin Properties ------------------------------ //


    if(isAdmin(Meteor.user())){

      // Basic Properties

      adminProperties = {
        sticky:     $('#sticky').is(':checked'),
        userId:     $('#postUser').val(),
      };

      // Status

      adminProperties.status = parseInt($('input[name=status]:checked').val());

      properties = _.extend(properties, adminProperties);

      // PostedAt

      if(adminProperties.status == STATUS_APPROVED){  

        var setPostedAt = false;
        var postedAt = new Date(); // default to current browser date and time
        var postedAtDate = $('#postedAtDate').datepicker('getDate');
        var postedAtTime = $('#postedAtTime').val();

        if($('#postedAtDate').exists() && postedAtDate != "Invalid Date"){ // if custom date is set, use it
          postedAt = postedAtDate;
          setPostedAt = true;
        }

        if($('#postedAtTime').exists() && postedAtTime.split(':').length==2){ // if custom time is set, use it
          var hours = postedAtTime.split(':')[0];
          var minutes = postedAtTime.split(':')[1];
          postedAt = moment(postedAt).hour(hours).minute(minutes).toDate();
          setPostedAt = true;
        }

        if(setPostedAt){ // if either custom date or time has been set, pass result to method
          Meteor.call('setPostedAt', post, postedAt); // use a method to guarantee timestamp integrity
        }else{
          Meteor.call('setPostedAt', post);
        }
      }
    }
    // console.log(properties)

    // ------------------------------ Update ------------------------------ //

    Posts.update(post._id,{
      $set: properties
    }, function(error){
      if(error){
        console.log(error);
        throwError(error.reason);
      }else{
        trackEvent("edit post", {'postId': post._id});
        Router.go("/posts/"+post._id);
      }
    });
  },
  'click .delete-link': function(e){
    var post = this;

    e.preventDefault();
    
    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deletePostById", post._id, function(error) {
        if (error) {
          console.log(error);
          throwError(error.reason);
        } else {
          throwError('Your post has been deleted.');
        }
      });
    }
  }
});