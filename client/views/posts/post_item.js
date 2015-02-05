var post = {};

var getPathname = window.location.pathname;

shortDescription = function(id) {
  var selector ='#'+ id + '-more p';
  $(selector).addClass('more');
  var showChar = 205, 
      showtxt = "more", 
      hidetxt = "less";
  $('.more').each(function() {
    var content = $(this).text(),
        contentLength = content.length;

    if (contentLength > showChar) {
      var con = content.substr(0, showChar),
      hcon = content.substr(showChar, contentLength - showChar);

      var txt= con +  '<span class="dots">...</span> <span class="morecontent"> <span>' + hcon + '</span> <a href="" class="moretxt">' + showtxt + '</a> </span>';
      $(this).html(txt);
    }
  });

  $(".moretxt").click(function() {
    if ($(this).hasClass("sample")) {
      $(this).removeClass("sample");
      $(this).text(showtxt);
    } else {
      $(this).addClass("sample");
      $(this).text(hidetxt);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
}

Template[getTemplate('post_item')].created = function () {
  post = this.data;
};


Template[getTemplate('post_item')].rendered = function () {
  $('.ui.accordion').accordion({
    onOpen:function() {
       $(this).prev().addClass('active');
    }
  });
};

Template[getTemplate('post_item')].helpers({
  post_body: function () {
    return getTemplate('post_body');
  },
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
    e.proventDefault;

    shortDescription(this._id);

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

