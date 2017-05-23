/*

Utilities

*/

import marked from 'marked';
import urlObject from 'url';
import moment from 'moment';
import sanitizeHtml from 'sanitize-html';
import getSlug from 'speakingurl';
import { getSetting } from './settings.js';

/**
 * @summary The global namespace for Telescope utils.
 * @namespace Telescope.utils
 */
export const Utils = {};

/**
 * @summary Convert a camelCase string to dash-separated string
 * @param {String} str
 */
Utils.camelToDash = function (str) {
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * @summary Convert a camelCase string to a space-separated capitalized string
 * See http://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
 * @param {String} str
 */
Utils.camelToSpaces = function (str) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
};

/**
 * @summary Convert an underscore-separated string to dash-separated string
 * @param {String} str
 */
Utils.underscoreToDash = function (str) {
  return str.replace('_', '-');
};

/**
 * @summary Convert a dash separated string to camelCase.
 * @param {String} str
 */
Utils.dashToCamel = function (str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

/**
 * @summary Convert a string to camelCase and remove spaces.
 * @param {String} str
 */
Utils.camelCaseify = function(str) {
  str = this.dashToCamel(str.replace(' ', '-'));
  str = str.slice(0,1).toLowerCase() + str.slice(1);
  return str;
};

/**
 * @summary Trim a sentence to a specified amount of words and append an ellipsis.
 * @param {String} s - Sentence to trim.
 * @param {Number} numWords - Number of words to trim sentence to.
 */
Utils.trimWords = function(s, numWords) {

  if (!s)
    return s;

  var expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
};

/**
 * @summary Trim a block of HTML code to get a clean text excerpt
 * @param {String} html - HTML to trim.
 */
Utils.trimHTML = function (html, numWords) {
  var text = Utils.stripHTML(html);
  return Utils.trimWords(text, numWords);
};

/**
 * @summary Capitalize a string.
 * @param {String} str
 */
Utils.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

Utils.t = function(message) {
  var d = new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()); // eslint-disable-line
};

Utils.nl2br = function(str) {
  var breakTag = '<br />';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};

Utils.scrollPageTo = function(selector) {
  $('body').scrollTop($(selector).offset().top);
};

Utils.getDateRange = function(pageNumber) {
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
 * @summary Returns the user defined site URL or Meteor.absoluteUrl
 */
Utils.getSiteUrl = function () {
  return getSetting('siteUrl', Meteor.absoluteUrl());
};

/**
 * @summary The global namespace for Telescope utils.
 * @param {String} url - the URL to redirect
 */
Utils.getOutgoingUrl = function (url) {
  return Utils.getSiteUrl() + "out?url=" + encodeURIComponent(url);
};

Utils.slugify = function (s) {
  var slug = getSlug(s, {
    truncate: 60
  });

  // can't have posts with an "edit" slug
  if (slug === "edit") {
    slug = "edit-1";
  }

  return slug;
};

Utils.getUnusedSlug = function (collection, slug) {
  let suffix = "";
  let index = 0;

  // test if slug is already in use
  while (!!collection.findOne({slug: slug+suffix})) {
    index++;
    suffix = "-"+index;
  }

  return slug+suffix;
};

Utils.getShortUrl = function(post) {
  return post.shortUrl || post.url;
};

Utils.getDomain = function(url) {
  try {
    return urlObject.parse(url).hostname.replace('www.', '');
  } catch (error) {
    return null;
  }
};

Utils.invitesEnabled = function() {
  return getSetting("requireViewInvite") || getSetting("requirePostInvite");
};

// add http: if missing
Utils.addHttp = function (url) {
  try {
    if (url.substring(0, 5) !== "http:" && url.substring(0, 6) !== "https:") {
      url = "http:"+url;
    }
    return url;
  } catch (error) {
    return null;
  }
};

/////////////////////////////
// String Helper Functions //
/////////////////////////////

Utils.cleanUp = function(s) {
  return this.stripHTML(s);
};

Utils.sanitize = function(s) {
  // console.log('// before sanitization:')
  // console.log(s)
  if(Meteor.isServer){
    s = sanitizeHtml(s, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
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

Utils.stripHTML = function(s) {
  return s.replace(/<(?:.|\n)*?>/gm, '');
};

Utils.stripMarkdown = function(s) {
  var htmlBody = marked(s);
  return Utils.stripHTML(htmlBody);
};

// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
Utils.checkNested = function(obj /*, level1, level2, ... levelN*/) {
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

Utils.log = function (s) {
  if(getSetting('debug', false) || process.env.NODE_ENV === "development") {
    console.log(s); // eslint-disable-line
  }
};

// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
Utils.getNestedProperty = function (obj, desc) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
};

// see http://stackoverflow.com/a/14058408/649299
_.mixin({
  compactObject : function(object) {
    var clone = _.clone(object);
    _.each(clone, function(value, key) {
      if(!value && typeof value !== "boolean") {
        delete clone[key];
      }
    });
    return clone;
  }
});


Utils.getFieldLabel = (fieldName, collection) => {
  const label = collection.simpleSchema()._schema[fieldName].label;
  const nameWithSpaces = Utils.camelToSpaces(fieldName);
  return label || nameWithSpaces;
}

Utils.getLogoUrl = () => {
  const logoUrl = getSetting("logoUrl");
  if (!!logoUrl) {
    const prefix = Utils.getSiteUrl().slice(0,-1);
    // the logo may be hosted on another website
    return logoUrl.indexOf('://') > -1 ? logoUrl : prefix + logoUrl;
  }
};

// note(apollo): get collection's name from __typename given by react-apollo
Utils.getCollectionNameFromTypename = (type) => {
  if (type.indexOf('Post') > -1) {
    return 'posts';
  } else if (type.indexOf('Cat') > -1) {
    return 'categories';
  } else if (type.indexOf('User') > -1) {
    return 'users';
  } else if (type.indexOf('Comment') > -1) {
    return 'comments';
  }
};

Utils.findIndex = (array, predicate) => {
  let index = -1;
  let continueLoop = true;
  array.forEach((item, currentIndex) => {
    if (continueLoop && predicate(item)) {
      index = currentIndex
      continueLoop = false
    }
  });
  return index;
}

// adapted from http://stackoverflow.com/a/22072374/649299
Utils.unflatten = function(array, options, parent, level=0, tree){

  const { 
    idProperty = '_id', 
    parentIdProperty = 'parentId', 
    childrenProperty = 'childrenResults'
  } = options;

  level++;

  tree = typeof tree !== "undefined" ? tree : [];

  let children = [];

  if (typeof parent === "undefined") {
    // if there is no parent, we're at the root level
    // so we return all root nodes (i.e. nodes with no parent)
    children = _.filter(array, node => !node[parentIdProperty]);
  } else {
    // if there *is* a parent, we return all its child nodes
    // (i.e. nodes whose parentId is equal to the parent's id.)
    children = _.filter(array, node => node[parentIdProperty] === parent[idProperty]);
  }

  // if we found children, we keep on iterating
  if (!!children.length) {

    if (typeof parent === "undefined") {
      // if we're at the root, then the tree consist of all root nodes
      tree = children;
    } else {
      // else, we add the children to the parent as the "childrenResults" property
      parent[childrenProperty] = children;
    }

    // we call the function on each child
    children.forEach(child => {
      child.level = level;
      Utils.unflatten(array, options, child, level);
    });
  }

  return tree;
};

// remove the telescope object from a schema and duplicate it at the root
Utils.stripTelescopeNamespace = (schema) => {
  // grab the users schema keys
  const schemaKeys = Object.keys(schema);

  // remove any field beginning by telescope: .telescope, .telescope.upvotedPosts.$, ...
  const filteredSchemaKeys = schemaKeys.filter(key => key.slice(0,9) !== 'telescope');

  // replace the previous schema by an object based on this filteredSchemaKeys
  return filteredSchemaKeys.reduce((sch, key) => ({...sch, [key]: schema[key]}), {});
}

/**
 * Convert an array of field names into a Mongo fields specifier
 * @param {Array} fieldsArray
 */
Utils.arrayToFields = (fieldsArray) => {
  return _.object(fieldsArray, _.map(fieldsArray, function () {return true}));
}

/**
 * Get the display name of a React component
 * @param {React Component} WrappedComponent
 */
Utils.getComponentDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};


/**
 * Take a collection and a list of documents, and convert all their date fields to date objects
 * This is necessary because Apollo doesn't support custom scalars, and stores dates as strings
 * @param {Object} collection
 * @param {Array} list
 */
Utils.convertDates = (collection, listOrDocument) => {
  // if undefined, just return
  if (!listOrDocument || !listOrDocument.length) return listOrDocument;

  const list = Array.isArray(listOrDocument) ? listOrDocument : [listOrDocument];
  const schema = collection.simpleSchema()._schema;
  const dateFields = _.filter(_.keys(schema), fieldName => schema[fieldName].type === Date);
  const convertedList = list.map(result => {
    dateFields.forEach(fieldName => {
      if (result[fieldName] && typeof result[fieldName] === 'string') {
        result[fieldName] = new Date(result[fieldName]);
      }
    });
    return result;
  });

  return Array.isArray(listOrDocument) ? convertedList : convertedList[0];
}

Utils.encodeIntlError = error => typeof error !== "object" ? error : JSON.stringify(error);

Utils.decodeIntlError = (error, options = {stripped: false}) => {
  try {
    // do we get the error as a string or as an error object?
    let strippedError = typeof error === 'string' ? error : error.message;

    // if the error hasn't been cleaned before (ex: it's not an error from a form)
    if (!options.stripped) {
      // strip the "GraphQL Error: message [error_code]" given by Apollo if present
      const graphqlPrefixIsPresent = strippedError.match(/GraphQL error: (.*)/);
      if (graphqlPrefixIsPresent) {
        strippedError = graphqlPrefixIsPresent[1];
      }

      // strip the error code if present
      const errorCodeIsPresent = strippedError.match(/(.*)\[(.*)\]/);
      if (errorCodeIsPresent) {
        strippedError = errorCodeIsPresent[1];
      }
    }

    // the error is an object internationalizable
    const parsedError = JSON.parse(strippedError);

    // check if the error has at least an 'id' expected by react-intl
    if (!parsedError.id) {
      console.error('[Undecodable error]', error); // eslint-disable-line
      return {id: 'app.something_bad_happened', value: '[undecodable error]'}
    }

    // return the parsed error
    return parsedError;
  } catch(__) {
    // the error is not internationalizable
    return error;
  }
};

Utils.findWhere = (array, criteria) => array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]));

Utils.defineName = (o, name) => {
  Object.defineProperty(o, 'name', { value: name });
  return o;
};

Utils.performCheck = (operation, user, checkedObject, context, documentId) => {

  if (!checkedObject) {
    throw new Error(Utils.encodeIntlError({id: `app.document_not_found`, value: documentId}))
  }

  if (!operation.check(user, checkedObject, context)) {
    throw new Error(Utils.encodeIntlError({id: `app.operation_not_allowed`, value: operation.name}));
  }

}