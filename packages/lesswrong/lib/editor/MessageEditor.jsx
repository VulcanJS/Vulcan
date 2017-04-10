import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class MessageEditor extends Component {

  render() {


    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;

    return (
      <div className="messageEditor">
        <Components.EditorWrapper addValues={addValues}/>
      </div>
    );
  }
}

MessageEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('MessageEditor', MessageEditor, withCurrentUser);

export default MessageEditor;
