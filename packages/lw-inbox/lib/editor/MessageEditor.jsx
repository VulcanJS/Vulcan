import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class MessageEditor extends Component {

  render() {
    return (
      <div style={{width:"300px", height:"200px"}}>
        <Components.EditorWrapper />
      </div>
    );
  }
}

registerComponent('MessageEditor', MessageEditor, withCurrentUser);

export default MessageEditor;
