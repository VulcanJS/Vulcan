import React, { Component } from 'react';
import {
  convertFromRaw,
  EditorState,
} from 'draft-js';
// eslint-disable-next-line import/no-unresolved
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
// eslint-disable-next-line import/no-unresolved
import createFocusPlugin from 'draft-js-focus-plugin';
import createColorBlockPlugin from './colorBlockPlugin';
import editorStyles from './editorStyles.css';

const focusPlugin = createFocusPlugin();

const decorator = composeDecorators(
  focusPlugin.decorator,
);

const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [focusPlugin, colorBlockPlugin];

/* eslint-disable */
const initialState = {
    "entityMap": {
        "0": {
            "type": "colorBlock",
            "mutability": "IMMUTABLE",
            "data": {}
        }
    },
    "blocks": [{
        "key": "9gm3s",
        "text": "This is a simple example. Focus the block by clicking on it and change alignment via the toolbar.",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }, {
        "key": "ov7r",
        "text": " ",
        "type": "atomic",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [{
            "offset": 0,
            "length": 1,
            "key": 0
        }],
        "data": {}
    }, {
        "key": "e23a8",
        "text": "More text here to demonstrate how inline left/right alignment works …",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }]
};
/* eslint-enable */

export default class CustomImageEditor extends Component {

  state = {
    editorState: EditorState.createWithContent(convertFromRaw(initialState)),
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
      <div className={editorStyles.editor} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
      </div>
    );
  }
}
