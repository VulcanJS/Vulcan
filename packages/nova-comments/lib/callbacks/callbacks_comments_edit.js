import marked from 'marked';
import { addCallback, Utils } from 'meteor/vulcan:core';

// ------------------------------------- comments.edit.sync -------------------------------- //

function CommentsEditGenerateHTMLBody (modifier, comment, user) {
  // if body is being modified, update htmlBody too
  if (modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Utils.sanitize(marked(modifier.$set.body));
  }
  return modifier;
}
addCallback("comments.edit.sync", CommentsEditGenerateHTMLBody);
