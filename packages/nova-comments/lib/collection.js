/**
 * @summary The global namespace for Comments.
 * @namespace Comments
 */
Comments = new Mongo.Collection('comments');

Comments.typeName = 'Comment';

export default Comments;