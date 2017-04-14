import Comments from "meteor/vulcan:comments";
import CommentEditor from '../../editor/CommentEditor.jsx';

Comments.addField([
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
      control: CommentEditor,
      blackbox: true,
      order: 25,
    }
  },
]);
