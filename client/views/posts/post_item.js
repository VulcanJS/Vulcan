var post = {};

var getPathname = window.location.pathname;

Template[getTemplate('post_item')].created = function () {
  post = this.data;
};


Template[getTemplate('post_item')].rendered = function () {
  $('.ui.accordion').accordion({
        onOpen:function() {
           $(this).prev().addClass('active');
        }
      });

  var user = Meteor.user();
  var slug = user.slug;
  var pathname = getPathname;
  if (pathname.indexOf('/'+slug+'/friend/') > -1) {
    $('.post-avatars').hide();
    $('.post-list-info').css('border-bottom','none');
  }

};

Template[getTemplate('post_item')].helpers({
  postModules: function () {
    return postModules;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  moduleContext: function () { // not used for now
    var module = this;
    module.templateClass = camelToDash(this.template) + ' ' + this.position + ' cell';
    module.post = post;
    return module;
  },
  moduleClass: function () {
    return camelToDash(this.template) + ' post-module';
  },
  postClass: function () {
    var post = this;
    var postAuthorClass = "author-"+post.author;

    var postClass = postClassCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(post, result);
    }, postAuthorClass);
    
    return postClass;
  },
  notPostPage: function () {
    var pathname = getPathname;
    return pathname.indexOf('/posts/') === -1;
  }
});

Template[getTemplate('post_item')].events({
  'click .post-list-info': function (e) {

    if ($('.content.active').length === 0) {
      $('.ui.accordion').accordion({
        duration:500,
        onOpen:function() {
           $(this).prev().addClass('active');
        }
      });
    } else {
      $('.content.active').removeClass('active');
      $('.post.title.active').removeClass('active');
      $('.ui.accordion').accordion({
        duration:300,
        onOpen:function() {
           $(this).prev().addClass('active');
        }
      });
    }
  }
});

