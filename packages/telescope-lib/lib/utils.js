/**
 * The global namespace for Telescope utils.
 * @namespace Telescope.utils
 */
Telescope.utils = {};

/**
 * Convert a camelCase string to dash-separated string
 * @param {String} str
 */
Telescope.utils.camelToDash = function (str) {
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Convert an underscore-separated string to dash-separated string
 * @param {String} str
 */
Telescope.utils.underscoreToDash = function (str) {
  return str.replace('_', '-');
};

/**
 * Convert a dash separated string to camelCase.
 * @param {String} str
 */
Telescope.utils.dashToCamel = function (str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

/**
 * Convert a string to camelCase and remove spaces.
 * @param {String} str
 */
Telescope.utils.camelCaseify = function(str) {
  str = this.dashToCamel(str.replace(' ', '-'));
  str = str.slice(0,1).toLowerCase() + str.slice(1);
  return str;
};

/**
 * Trim a sentence to a specified amount of words and append an ellipsis.
 * @param {String} s - Sentence to trim.
 * @param {Number} numWords - Number of words to trim sentence to.
 */
Telescope.utils.trimWords = function(s, numWords) {
  
  if (!s)
    return s;

  var expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
};

/**
 * Trim a block of HTML code to get a clean text excerpt
 * @param {String} html - HTML to trim.
 */
Telescope.utils.trimHTML = function (html, numWords) {
  var text = Telescope.utils.stripHTML(html);
  return Telescope.utils.trimWords(text, numWords);
};

/**
 * Capitalize a string.
 * @param {String} str
 */
Telescope.utils.capitalise = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

Telescope.utils.t = function(message) {
  var d = new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
};

Telescope.utils.nl2br = function(str) {
  var breakTag = '<br />';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};

Telescope.utils.scrollPageTo = function(selector) {
  $('body').scrollTop($(selector).offset().top);
};

Telescope.utils.getDateRange = function(pageNumber) {
  var now = moment(new Date());
  var dayToDisplay=now.subtract(pageNumber-1, 'days');
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
};

//////////////////////////
// URL Helper Functions //
//////////////////////////

/**
 * Returns the user defined site URL or Meteor.absoluteUrl
 */
Telescope.utils.getSiteUrl = function () {
  return Settings.get('siteUrl', Meteor.absoluteUrl());
};

/**
 * The global namespace for Telescope utils.
 * @param {String} url - the URL to redirect
 */
Telescope.utils.getOutgoingUrl = function (url) {
  return Telescope.utils.getSiteUrl() + "out?url=" + encodeURIComponent(url);
};

// This function should only ever really be necessary server side
// Client side using .path() is a better option since it's relative
// and shouldn't care about the siteUrl.
Telescope.utils.getRouteUrl = function (routeName, params, options) {
  options = options || {};
  var route = FlowRouter.path(
    routeName,
    params || {},
    options
  );
  return route;
};

Telescope.utils.getSignupUrl = function() {
  return this.getRouteUrl('atSignUp');
};
Telescope.utils.getSigninUrl = function() {
  return this.getRouteUrl('atSignIn');
};

//TODO: fix this
Telescope.utils.getPostCommentUrl = function(postId, commentId) {
  // get link to a comment on a post page
  return this.getRouteUrl('post_page_comment', {
    _id: postId,
    commentId: commentId
  });
};

Telescope.utils.slugify = function (s) {
  var slug = getSlug(s, {
    truncate: 60
  });

  // can't have posts with an "edit" slug
  if (slug === "edit") {
    slug = "edit-1";
  }

  return slug;
};

Telescope.utils.getUnusedSlug = function (collection, slug) {
  var suffix = "";
  var index = 0;

  // test if slug is already in use
  while (!!collection.findOne({slug: slug+suffix})) {
    index++;
    suffix = "-"+index;
  }

  return slug+suffix;
};

Telescope.utils.getShortUrl = function(post) {
  return post.shortUrl || post.url;
};

Telescope.utils.getDomain = function(url) {
  var urlObject = Npm.require('url');
  return urlObject.parse(url).hostname.replace('www.', '');
};

Telescope.utils.invitesEnabled = function() {
  return Settings.get("requireViewInvite") || Settings.get("requirePostInvite");
};

// add http: if missing
Telescope.utils.addHttp = function (url) {
  if (url.substring(0, 5) !== "http:" && url.substring(0, 6) !== "https:") {
    url = "http:"+url;
  }
  return url;
};

/////////////////////////////
// String Helper Functions //
/////////////////////////////

Telescope.utils.cleanUp = function(s) {
  return this.stripHTML(s);
};

Telescope.utils.sanitize = function(s) {
  // console.log('// before sanitization:')
  // console.log(s)
  if(Meteor.isServer){
    s = sanitizeHtml(s, {
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

Telescope.utils.stripHTML = function(s) {
  return s.replace(/<(?:.|\n)*?>/gm, '');
};

Telescope.utils.stripMarkdown = function(s) {
  var htmlBody = marked(s);
  return Telescope.utils.stripHTML(htmlBody);
};

// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
Telescope.utils.checkNested = function(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments);
  obj = args.shift();

  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};

Telescope.log = function (s) {
  if(Settings.get('debug', false))
    console.log(s);
};

// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
Telescope.getNestedProperty = function (obj, desc) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
};
