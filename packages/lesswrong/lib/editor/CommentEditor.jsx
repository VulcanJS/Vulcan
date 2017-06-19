import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import Editor, { Editable, createEmptyState } from 'ory-editor-core';
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'



class CommentEditor extends Component {
  constructor(props) {
    super(props);
    const editor = this.props.editor;
    const document = this.props.document;
    let state = document && document.content ? document.content : createEmptyState();
    state.id = document && document.content ? document.content.id : Math.floor(Math.random() * 1000);
    this.state = {
      contentState: state,
    };
    editor.trigger.editable.add(state);
  }

  render() {
    const document = this.props.document;
    const addValues = this.context.addToAutofilledValues;

    let editor = this.props.editor;

    onChange = (state) => {
      addValues({content: state});
      return state;
    }


    return (
      <div className="commentEditor">
        <Editable editor={editor} id={this.state.contentState.id} onChange={onChange} />
        <Toolbar editor={editor} />
      </div>
    )
  }
}

CommentEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
};

registerComponent('CommentEditor', CommentEditor, withEditor, withCurrentUser);

export default withEditor(CommentEditor);
