import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import Editor, { Editable, createEmptyState } from 'ory-editor-core';
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import withEditor from './withEditor.jsx'



class EditorTest extends Component {
  constructor(props) {
    const placeholderContent1 = createEmptyState();
    const placeholderContent2 = createEmptyState();
    super(props);
    const editor = this.props.editor;
    console.log(placeholderContent1);
    console.log(placeholderContent2);

    this.state = {
      contentId1: placeholderContent1.id,
      contentId2: placeholderContent2.id,
    }
    state1 = placeholderContent1;
    state2 = placeholderContent2;
    editor.trigger.editable.add(state1);
    editor.trigger.editable.add(state2);
  };
  render() {
    editor = this.props.editor;
    onChange = (state) => {
      console.log(state);
      return state;
    }


    return (
      <div>
        <Editable editor={editor} id={this.state.contentId1} onChange={onChange} />
        <Editable editor={editor} id={this.state.contentId2} onChange={onChange} />
        <Toolbar editor={editor} />
        <DisplayModeToggle editor={editor} />
      </div>
    )
  }
}

registerComponent('EditorTest', EditorTest, withEditor, withCurrentUser);
