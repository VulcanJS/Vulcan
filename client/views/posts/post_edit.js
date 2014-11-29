AutoForm.hooks({
  editPostForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

      var updateObject = updateDoc;
      var submit = this;

      // ------------------------------ Checks ------------------------------ //

      if (!Meteor.user()) {
        throwError(i18n.t('you_must_be_logged_in'));
        return false;
      }

      // ------------------------------ Callbacks ------------------------------ //

      // run all post edit client callbacks on updateObject object successively
      updateObject = postEditClientCallbacks.reduce(function(result, currentFunction) {
          return currentFunction(result);
      }, updateObject);

      // ------------------------------ Update ------------------------------ //
      Meteor.call('editPost', currentDoc._id, updateObject, function(error, post) {
        if(error){
          submit.done(error);
        }else{
          // note: find a way to do this in onSuccess instead?
          trackEvent("edit post", {'postId': post._id});
          Router.go('/posts/'+post._id);
          submit.done();
        }
      });

      return false
    },

    onSuccess: function(operation, result, template) {
      // not used right now because I can't find a way to pass the "post" object to this callback
      // console.log(result)
      // trackEvent("new post", {'postId': post._id});
      // if(post.status === STATUS_PENDING)
      //   throwError('Thanks, your post is awaiting approval.');
      // Router.go('/posts/'+post._id);
    }, 

    onError: function(operation, error, template) {
      console.log(error)
      throwError(error.reason.split('|')[0]); // workaround because error.details returns undefined
      clearSeenErrors();
    }

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    // beginSubmit: function(formId, template) {},
    // endSubmit: function(formId, template) {}
  }
});

// Template[getTemplate('post_edit')].helpers({
//   created: function(){
//     return moment(this.createdAt).format("MMMM Do, h:mm:ss a");
//   },
//   categories: function(){
//     var post = this;
//     return Categories.find({}, {sort: {order: 1, name: 1}}).map(function(category) {
//       category.checked = _.contains(_.pluck(post.categories, '_id'), category._id) ? 'checked' : '';
//       return category;
//     });
//   },
//   categoriesEnabled: function(){
//     return Categories.find().count();
//   },
//   showPostedAt: function () {
//     if((Session.get('currentPostStatus') || this.status) == STATUS_APPROVED){
//       return 'visible'
//     }else{
//       return 'hidden'
//     }
//   },
//   isSticky: function(){
//     return this.sticky ? 'checked' : '';
//   },
//   isSelected: function(parentPost){
//     return parentPost && this._id == parentPost.userId ? 'selected' : '';
//   },
//   postedAtDate: function(){
//     return !!this.postedAt ? moment(this.postedAt).format("MM/DD/YYYY") : null;
//   },
//   postedAtTime: function(){
//     return !!this.postedAt ? moment(this.postedAt).format("HH:mm") : null;
//   },
//   users: function(){
//     return Meteor.users.find({}, {sort: {'profile.name': 1}});
//   },
//   userName: function(){
//     return getDisplayName(this);
//   },
//   hasStatusPending: function(){
//     return this.status == STATUS_PENDING ? 'checked' : '';
//   },
//   hasStatusApproved: function(){
//     return this.status == STATUS_APPROVED ? 'checked' : '';
//   },
//   hasStatusRejected: function(){
//     return this.status == STATUS_REJECTED ? 'checked' : '';
//   },
//   shorten: function(){
//     return !!getSetting('bitlyToken');
//   }
// });

// Template[getTemplate('post_edit')].rendered = function(){
//   // run all post edit rendered callbacks
//   var instance = this;
//   postEditRenderedCallbacks.forEach(function(callback) {
//     callback(instance);
//   });

//   Session.set('currentPostStatus', this.status);

//   var post = this.data.post;
//   if(post && !this.editor){
//     this.editor= new EpicEditor(EpicEditorOptions).load();
//     this.editor.importFile('editor', post.body);
//   }


//   // $("#postUser").selectToAutocomplete(); // XXX

// };

// Template[getTemplate('post_edit')].events({
//   'change input[name=status]': function (e, i) {
//     Session.set('currentPostStatus', e.currentTarget.value);
//   },
//   'click input[type=submit]': function(e, instance){
//     var post = this;
//     var updateObject = {};

//     e.preventDefault();

//     $(e.target).addClass('disabled');

//     if(!Meteor.user()){
//       throwError('You must be logged in.');
//       return false;
//     }

//     // ------------------------------ Properties ------------------------------ //

//     // Basic Properties

//     var body = instance.editor.exportFile();

//     var properties = {
//       title:            $('#title').val(),
//       body:             body,
//       categories:       []
//     };

//     // URL

//     var url = $('#url').val();
//     if(!!url){
//       properties.url = (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") ? url : "http://"+url;
//     } else {
//       // if URL is empty, unset it
//       updateObject.$unset = {url: ""};
//     }

//     // ShortURL

//     var shortUrl = $('#short-url').val();
//     if(!!shortUrl)
//         properties.shortUrl = shortUrl;

//     // ------------------------------ Admin Properties ------------------------------ //


//     if(isAdmin(Meteor.user())){

//       // Basic Properties

//       adminProperties = {
//         sticky:     $('#sticky').is(':checked'),
//         userId:     $('#postUser').val()
//       };

//       // Status

//       adminProperties.status = parseInt($('input[name=status]:checked').val());

//       properties = _.extend(properties, adminProperties);

//       // PostedAt

//       if(adminProperties.status == STATUS_APPROVED){  

//         var $postedAtDate = $('#postedAtDate');
//         var $postedAtTime = $('#postedAtTime');
//         var setPostedAt = false;
//         var postedAt = new Date(); // default to current browser date and time
//         var postedAtDate = $postedAtDate.datepicker('getDate');
//         var postedAtTime = $postedAtTime.val();

//         if($postedAtDate.exists() && postedAtDate != "Invalid Date"){ // if custom date is set, use it
//           postedAt = postedAtDate;
//           setPostedAt = true;
//         }

//         if($postedAtTime.exists() && postedAtTime.split(':').length==2){ // if custom time is set, use it
//           var hours = postedAtTime.split(':')[0];
//           var minutes = postedAtTime.split(':')[1];
//           postedAt = moment(postedAt).hour(hours).minute(minutes).toDate();
//           setPostedAt = true;
//         }

//         if(setPostedAt){ // if either custom date or time has been set, pass result to method
//           Meteor.call('setPostedAt', post, postedAt); // use a method to guarantee timestamp integrity
//         }else{
//           Meteor.call('setPostedAt', post);
//         }
//       }
//     }

//     // ------------------------------ Callbacks ------------------------------ //

//     // run all post edit client callbacks on properties object successively
//     properties = postEditClientCallbacks.reduce(function(result, currentFunction) {
//         return currentFunction(result);
//     }, properties);

//     // console.log(properties)

//     // ------------------------------ Update ------------------------------ //

//     if (properties) {

//       updateObject.$set = properties;

//       Posts.update(post._id, updateObject, function(error){
//         if(error){
//           console.log(error);
//           throwError(error.message);
//           clearSeenErrors();
//           $(e.target).removeClass('disabled');
//         }else{
//           trackEvent("edit post", {'postId': post._id});
//           Router.go("/posts/"+post._id);
//         }
//       });
//     } else {
//       $(e.target).removeClass('disabled');
//     }

//   },
//   'click .delete-link': function(e){
//     var post = this;

//     e.preventDefault();
    
//     if(confirm("Are you sure?")){
//       Router.go("/");
//       Meteor.call("deletePostById", post._id, function(error) {
//         if (error) {
//           console.log(error);
//           throwError(error.reason);
//         } else {
//           throwError('Your post has been deleted.');
//         }
//       });
//     }
//   }
// });