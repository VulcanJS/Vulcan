import React, { Component } from 'react';
import {
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';
// eslint-disable-next-line import/no-unresolved
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
// eslint-disable-next-line import/no-unresolved
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import editorStyles from './editorStyles.css';
import colorStyleMap from './colorStyleMap';
import ColorControls from './ColorControls';
import * as colorPlugin from './colorPlugin';

const hashtagPlugin = createHashtagPlugin();
const plugins = [hashtagPlugin, colorPlugin];
const text = `#TIL: This editor can have all sorts of #hashtags. Pretty #cool :)
Try it yourself by starting a word with a # (hash character) …
`;

export default class SimpleHashtagEditor extends Component {

  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  toggleColor = (toggledColor) => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => (
        Modifier.removeInlineStyle(contentState, selection, color)
      ), editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((currentEditorState, color) => (
        RichUtils.toggleInlineStyle(currentEditorState, color)
      ), nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.onChange(nextEditorState);
  };

  render() {
    return (
      <div className={editorStyles.editor} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
        <ColorControls
          editorState={this.state.editorState}
          onToggle={this.toggleColor}
        />
      </div>
    );
  }
}
