import Posts from "meteor/vulcan:posts";
import PostEditor from '../../editor/PostEditor.jsx';

Posts.addField([
  /**
    Drafts
  */
  {
    fieldName: "draft",
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: false,
      viewableBy: ['members'],
      insertableBy: ['members'],
      editableBy: ['members'],
      control: "checkbox"
    }
  },

  /**
    draftJS
  */
  {
    fieldName: 'draftJS',
    fieldSchema: {
      type: Object,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
      control: PostEditor,
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
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },
]);

Posts.removeField('body');
