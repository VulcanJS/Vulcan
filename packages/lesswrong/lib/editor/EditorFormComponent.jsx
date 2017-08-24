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
    let state = (document && document[fieldName]) || createEmptyState();
    console.log("EditorFormComponent constructor state", state);
    console.log("EditorFormComponent constructor document[fieldName]", fieldName, document[fieldName]);
    state = JSON.parse(JSON.stringify(state));
    this.state = {
      [fieldName]: state,
    };
    editor.trigger.editable.add(state);
  }

  componentWillMount() {
    //Add function for resetting form to form submit callbacks
    const resetEditor = (result) => {
      // On Form submit, create a new empty editable
      const fieldName = this.props.name;
      let editor = this.props.editor;
      let state = createEmptyState();
      editor.trigger.editable.add(state);
      this.setState({
        [fieldName]: state,
      });
      return result;
    }
    this.context.addToSuccessForm(resetEditor);
  }

  render() {
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    let editor = this.props.editor;
    const onChange = (state) => {
      addValues({[fieldName]: state});
      return state;
    }
    return (
      <div className="commentEditor">
        <div className="editor-form-component-description">{fieldName}</div>
        <Editable editor={editor} id={this.state[fieldName].id} onChange={onChange} />
        <Toolbar editor={editor} />
      </div>
    )
  }
}

EditorFormComponent.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  addToSuccessForm: React.PropTypes.func,
};

registerComponent("EditorFormComponent", EditorFormComponent, withEditor);

export default withEditor(EditorFormComponent);
