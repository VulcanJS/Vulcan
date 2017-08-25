import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { Editable, createEmptyState } from 'ory-editor-core';
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'


class EditorFormComponent extends Component {
  constructor(props, context) {
    super(props,context);
    const fieldName = this.props.name;
    let editor = this.props.editor;
    const document = this.props.document;
    let state = (document && !_.isEmpty(document[fieldName]) && document[fieldName]) || createEmptyState();
    console.log("constructor state", state);
    state = JSON.parse(JSON.stringify(state));
    this.state = {
      [fieldName]: state,
      active: !!document[fieldName],
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


    const checkForActive = (data) => {
      if (!this.state.active) {
        console.log("Editor component deactivated while submitting, resetting state");
        data[fieldName] = null;
      }
      return data;
    }

    this.context.addToSubmitForm(checkForActive);
  }

  onChange = (state) => {
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    addValues({[fieldName]: state});
  }

  activateEditor = () => {this.setState({active: true})}

  deactivateEditor = () => {this.setState({active: false})}

  toggleEditor = () => {this.setState({active: !this.state.active})}

  render() {
    const fieldName = this.props.name;
    let editor = this.props.editor;
    return (
      <div className="commentEditor">
        <div className="editor-form-component-description">{fieldName}</div>
        <a onTouchTap={this.toggleEditor}>{this.state.active ? "Deactivate Editor" : "Activate Editor"}</a>
        {this.state.active ?
          <div>
            <Editable editor={editor} id={this.state[fieldName].id} onChange={this.onChange} />
            <Toolbar editor={editor} />
            {this.props.name == "content" ? <div><Trash editor={editor} />
            <DisplayModeToggle editor={editor} /></div> : null}
          </div> : null}
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
