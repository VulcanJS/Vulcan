getSetting = function(setting, defaultValue){
  var settings=Settings.find().fetch()[0];
  if(settings){
    return settings[setting];
  }
  return typeof defaultValue === 'undefined' ? '' : defaultValue;
}
getCurrentTemplate = function() {
  return Router._currentController.template;
}
getCurrentRoute = function() {
  return Router._currentController.path;
}
clearSeenErrors = function(){
  Errors.update({seen:true}, {$set: {show:false}}, {multi:true});
}
t=function(message){
  var d=new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}
nl2br= function(str) {   
var breakTag = '<br />';    
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
getAuthorName = function(item){
  // since we are not publishing the user collection except for admins, just display the normalized author field
  return item.author;
}
scrollPageTo = function(selector){
  $('body').scrollTop($(selector).offset().top);  
}
getDigestURL = function(moment){
  return '/digest/'+moment.year()+'/'+(moment.month()+1)+'/'+moment.date()
}
getDateRange= function(pageNumber){
  var now = moment(new Date());
  var dayToDisplay=now.subtract('days', pageNumber-1);
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
}
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
}
getPostUrl = function(id){
  return Meteor.absoluteUrl()+'posts/'+id;
}
getPostEditUrl = function(id){
  return Meteor.absoluteUrl()+'posts/'+id+'/edit';
}
getCommentUrl = function(id){
  return Meteor.absoluteUrl()+'comments/'+id;
}
getPostCommentUrl = function(postId, commentId){
  // get link to a comment on a post page
  return Meteor.absoluteUrl()+'posts/'+postId+'/comment/'+commentId;
}
getCategoryUrl = function(slug){
  return Meteor.absoluteUrl()+'category/'+slug;
}
slugify = function(text) {
  if(text){
    text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-");
    text = text.toLowerCase();
  }
  return text;
}
getShortUrl = function(post){
  return post.shortUrl ? post.shortUrl : post.url;
}
getDomain = function(url){
  urlObject = Npm.require('url');
  return urlObject.parse(url).hostname;
}
invitesEnabled = function () {
  return getSetting("requireViewInvite") || getSetting("requirePostInvite");
}
getOutgoingUrl = function(url){
  return Meteor.absoluteUrl() + 'out?url=' + url; 
}
// ---------------------------------- String Helper Functions ----------------------------------- //
cleanUp = function(s){
  return stripHTML(s);
}
stripHTML = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
}
stripMarkdown = function(s){
  var converter = new Markdown.Converter();
  var html_body = converter.makeHtml(s);
  return stripHTML(html_body);
}
trimWords = function(s, numWords) {
  expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
}

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
}