import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import Editor, { Editable, createEmptyState } from 'ory-editor-core';
import { Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'

const placeholderContent = {
    id: '2',
    cells: [{
      rows: [
        {
          cells: [
            {
              content: {
                plugin: {
                  name: 'ory/editor/core/content/slate'
                },
                state: {}
              },
              id: '7d29c96e-53b8-4b3e-b0f1-758b405d6daf'
            }
          ],
          id: 'd62fe894-5795-4f00-80c8-0a5c9cfe85b9'
        },
      ],
      id: '15efd3c3-b683-4da6-b107-16d8d0c8cd26'
    }]
  };


class MessageEditor extends Component {
  constructor(props, context) {
    super(props,context);
    let editor = this.props.editor;
    const document = this.props.document;
    let state = document && document.content ? document.content : createEmptyState();
    this.state = {
      contentState: state,
    };
    editor.trigger.editable.add(state);
  }

  componentWillMount() {
    //Add function for resetting form to form submit callbacks
    const resetEditor = (data) => {
      // On Form submit, create a new empty editable
      let editor = this.props.editor;
      let state = createEmptyState();
      editor.trigger.editable.add(state);
      this.setState({
        contentState: state,
      })
      return data;
    }
    const addToSubmitCallbacks = this.context.addToSubmitForm;
    addToSubmitCallbacks(resetEditor);
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

MessageEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('MessageEditor', MessageEditor, withEditor, withCurrentUser);

export default withEditor(MessageEditor);
