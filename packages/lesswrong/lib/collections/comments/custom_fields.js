import Comments from "meteor/vulcan:comments";
import Users from "meteor/vulcan:users";
import CommentEditor from '../../editor/CommentEditor.jsx';

Comments.addField([
  /**
    Ory Editor content JSON
  */
  {
    fieldName: 'content',
    fieldSchema: {
      type: Object,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
      control: CommentEditor,
      blackbox: true,
      order: 25,
    }
  },

  /**
    Legacy: Boolean used to indicate that post was imported from old LW database
  */
  {
    fieldName: 'legacy',
    fieldSchema: {
      type: Boolean,
      optional: true,
      hidden: true,
      defaultValue: false,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    Legacy ID: ID used in the original LessWrong database
  */
  {
    fieldName: 'legacyId',
    fieldSchema: {
      type: String,
      hidden: true,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    Legacy Poll: Boolean to indicate that original LW data had a poll here
  */
  {
    fieldName: 'legacyPoll',
    fieldSchema: {
      type: Boolean,
      optional: true,
      hidden: true,
      defaultValue: false,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    Legacy Parent Id: Id of parent comment in original LW database
  */
  {
    fieldName: 'legacyParentId',
    fieldSchema: {
      type: String,
      hidden: true,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    legacyData: A complete dump of all the legacy data we have on this post in a
    single blackbox object. Never queried on the client, but useful for a lot
    of backend functionality, and simplifies the data import from the legacy
    LessWrong database
  */

  {
    fieldName: 'legacyData',
    fieldSchema: {
      type: Object,
      optional: true,
      viewableBy: ['admins'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
      hidden: true,
      blackbox: true,
    }
  },

  /**
    retracted: Indicates whether a comment has been retracted by its author.
    Results in the text of the comment being struck-through, but still readable.
  */

  {
    fieldName: 'retracted',
    fieldSchema: {
      type: Boolean,
      optional: true,
      viewableBy: ['guests'],
      insertableBy: Users.own,
      editableBy: Users.own,
      control: "checkbox",
    }
  },

  /**
    deleted: Indicates whether a comment has been deleted by an admin.
    This removes the content of the comment, but still renders replies.
  */

  {
    fieldName: 'deleted',
    fieldSchema: {
      type: Boolean,
      optional: true,
      viewableBy: ['guests'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
      control: "checkbox"
    }
  },

  /**
    spam: Indicates whether a comment has been marked as spam.
    This removes the content of the comment, but still renders replies.
  */

  {
    fieldName: 'spam',
    fieldSchema: {
      type: Boolean,
      optional: true,
      viewableBy: ['guests'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
      control: "checkbox",
    }
  },

  /**
    algoliaIndexAt: Last time the record was indexed by algolia. Undefined if it hasn't yet been indexed.
  */

  {
    fieldName: 'algoliaIndexAt',
    fieldSchema: {
      type: Date,
      optional: true,
      viewableBy: ['guests']
    }
  }


]);
