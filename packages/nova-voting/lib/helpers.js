
/**
 * @summary Check if a user has upvoted a document
 * @param {Object} user
 * @param {Object} document
 * @returns {Boolean}
 */
const hasUpvoted = (user, document) => {
  // note(apollo): check upvoters depending if the document is queried by mongo directly or fetched by an apollo resolver
  return user && document.upvoters && !!document.upvoters.find(u => typeof u === 'string' ? u === user._id : u._id === user._id);
};

/**
 * @summary Check if a user has downvoted a document
 * @param {Object} user
 * @param {Object} document
 * @returns {Boolean}
 */
const hasDownvoted = (user, document) => {
  // note(apollo): check downvoters depending if the document is queried by mongo directly or fetched by an apollo resolver
  return user && document.downvoters && !!document.downvoters.find(u => typeof u === 'string' ? u === user._id : u._id === user._id);
};

export { hasUpvoted, hasDownvoted }