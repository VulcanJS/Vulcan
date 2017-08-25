import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { Editable, createEmptyState } from 'ory-editor-core';
import { Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'


class EditorFormComponent extends Component {
  constructor(props, context) {
    super(props,context);
    const fieldName = this.props.name;
    let editor = this.props.editor;
    const document = this.props.document;
    let state = (document && document[fieldName] && !_.isEmpty(document[fieldName])) || createEmptyState();
    console.log("constructor state", state);
    state = JSON.parse(JSON.stringify(state));
    this.state = {
      [fieldName]: state,
      hasTyped: false,
    };
    editor.trigger.editable.add(state);
  }

  componentWillMount() {
    //Add function for resetting form to form submit callbacks
    const fieldName = this.props.name;
    const resetEditor = (result) => {
      // On Form submit, create a new empty editable
      let editor = this.props.editor;
      let state = createEmptyState();
      editor.trigger.editable.add(state);
      this.setState({
        [fieldName]: state,
      });
      return result;
    }
    this.context.addToSuccessForm(resetEditor);


    const checkForEmpty = (data) => {
      if (this.isEditorEmpty(data[fieldName])) {
        console.log("Submitted empty editor component, resetting state");
        data[fieldName] = null;
      }
      return data;
    }

    this.context.addToSubmitForm(checkForEmpty);
  }

  isEditorEmpty = (state) => {
    const slateState = state && state.cells && state.cells[0] && state.cells[0].content && state.cells[0].content.state
    const blocks = slateState && slateState.serialized && slateState.serialized.nodes && _.filter(slateState.serialized.nodes, (b) => (b.kind == "block"))
    const textState = blocks && _.filter(blocks, (b) => _.filter(b.nodes, (b2) => b2.kind == "text" && b2.text != "").length)
    return textState;
  }

  onChange = (state) => {
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    addValues({[fieldName]: state});
  }

  render() {
    const fieldName = this.props.name;
    let editor = this.props.editor;
    return (
      <div className="commentEditor">
        <div className="editor-form-component-description">{fieldName}</div>
        <Editable editor={editor} id={this.state[fieldName].id} onChange={this.onChange} />
        <Toolbar editor={editor} />
      </div>
    )
  }
}

EditorFormComponent.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  addToSuccessForm: React.PropTypes.func,
  addToSubmitForm: React.PropTypes.func,
};

registerComponent("EditorFormComponent", EditorFormComponent, withEditor);

export default withEditor(EditorFormComponent);
