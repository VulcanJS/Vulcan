import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class PostEditor extends Component {

  render() {
    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;

    return (
      <div className="postEditor">
        <Components.EditorWrapper addValues={addValues} initialState={document.draftJS} />
      </div>
    );
  }
}

PostEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('PostEditor', PostEditor, withCurrentUser);

export default PostEditor;
