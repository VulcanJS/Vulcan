import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createUndoPlugin from 'draft-js-undo-plugin'; // eslint-disable-line import/no-unresolved
import editorStyles from './editorStyles.css';

const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;
const plugins = [undoPlugin];

export default class SimpleUndoEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
        </div>
        <div className={editorStyles.options}>
          <UndoButton />
          <RedoButton />
        </div>
      </div>
    );
  }
}
