import Posts from "meteor/vulcan:posts"
import Users from "meteor/vulcan:users"
import PostEditor from '../editor/PostEditor.jsx';

Posts.addField([
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
    }
  },
]);
