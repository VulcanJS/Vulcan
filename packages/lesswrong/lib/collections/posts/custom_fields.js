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
]);

Posts.removeField('body');
Posts.removeField('htmlBody');
Posts.removeField('excerpt');
