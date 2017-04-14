import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class CommentEditor extends Component {

  render() {
    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;

    return (
      <div className="commentEditor">
        <Components.EditorWrapper addValues={addValues} initialState={document.draftJS} />
      </div>
    );
  }
}

CommentEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('CommentEditor', CommentEditor, withCurrentUser);

export default CommentEditor;
