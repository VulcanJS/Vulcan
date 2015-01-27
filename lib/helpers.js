cl = function(something){
  console.log(something);
};

getCurrentTemplate = function() {
  var template = Router.current().lookupTemplate();
  // on postsDaily route, template is a function
  if (typeof template === "function") {
    return template();
  } else {
    return template;
  }
};

t=function(message){
  var d=new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
};
nl2br= function(str) {
  var breakTag = '<br />';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};
getAuthorName = function(item){
  var user = Meteor.users.findOne(item.userId);
  return typeof user === 'undefined' ? '' : getDisplayName(user);
};
scrollPageTo = function(selector){
  $('body').scrollTop($(selector).offset().top);
};
getDateRange= function(pageNumber){
  var now = moment(new Date());
  var dayToDisplay=now.subtract(pageNumber-1, 'days');
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
};
// getPostCategories = function(post){
//   var postCategories = _.map(post.categories, function(categoryId){
//     return Categories.findOne(categoryId);
//   });
//   // put resulting array through a filter to remove empty values in case
//   // some of the post's categories weren't found in the database
//   return _.filter(postCategories, function(e){return e});
// }
// ---------------------------------- URL Helper Functions ----------------------------------- //
goTo = function(url){
  Router.go(url);
};

// This function should only ever really be necessary server side
// Client side using .path() is a better option since it's relative
// and shouldn't care about the siteUrl.
getRouteUrl = function (routeName, params, options) {
  options = options || {};
  var route = Router.url(
    routeName,
    params || {},
    options
  );
  return route;
};

getSignupUrl = function(){
  return getRouteUrl('atSignUp');
};
getSigninUrl = function(){
  return getRouteUrl('atSignIn');
};
getPostUrl = function(id){
  return getRouteUrl('post_page', {_id: id});
};
getPostEditUrl = function(id){
  return getRouteUrl('post_edit', {_id: id});
};

getCommentUrl = function(id){
  return getRouteUrl('comment_reply', {_id: id});
};
getPostCommentUrl = function(postId, commentId){
  // get link to a comment on a post page
  return getRouteUrl('post_page_comment', {
    _id: postId,
    commentId: commentId
  });
};
slugify = function(text) {
  if(text){
    text = text.replace(/[^-_a-zA-Z0-9,&\s]+/ig, '');
    text = text.replace(/\s/gi, "-");
    text = text.toLowerCase();
  }
  return text;
};
getShortUrl = function(post){
  return post.shortUrl || post.url;
};
getDomain = function(url){
  urlObject = Npm.require('url');
  return urlObject.parse(url).hostname.replace('www.', '');
};
invitesEnabled = function () {
  return getSetting("requireViewInvite") || getSetting("requirePostInvite");
};
getOutgoingUrl = function(url){
  return getRouteUrl('out', {}, {query: {url: url}});
};
// ---------------------------------- String Helper Functions ----------------------------------- //
cleanUp = function(s){
  return stripHTML(s);
};
sanitize = function (s) {
  // console.log('// before sanitization:')
  // console.log(s)
  if(Meteor.isServer){
    var s = sanitizeHtml(s, {
      allowedTags: [
        'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',
        'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',
        'tbody', 'tr', 'th', 'td', 'pre', 'img'
      ]
    });
    // console.log('// after sanitization:')
    // console.log(s)
  }
  return s;
};
stripHTML = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
};
stripMarkdown = function(s){
  var html_body = marked(s);
  return stripHTML(html_body);
};

// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
checkNested = function(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments),
      obj = args.shift();

  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};
