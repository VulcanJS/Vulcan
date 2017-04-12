import React, { Component } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createVideoPlugin from 'draft-js-video-plugin'; // eslint-disable-line import/no-unresolved
import editorStyles from './editorStyles.css';

const videoPlugin = createVideoPlugin();
const { types } = videoPlugin;
const plugins = [videoPlugin];
/* eslint-disable */
const initialState = {
  "entityMap": {
    "0": {
      "type": types.VIDEOTYPE,
      "mutability": "IMMUTABLE",
      "data": {
        "src": "https://www.youtube.com/watch?v=iEPTlhBmwRg"
      }
    }
  },
  "blocks": [{
    "key": "9gm3s",
    "text": "You can have video in your text field. This is a very rudimentary example, but you can enhance the video plugin with resizing, focus or alignment plugins.",
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
    "text": "See advanced examples further down …",
    "type": "unstyled",
    "depth": 0,
    "inlineStyleRanges": [],
    "entityRanges": [],
    "data": {}
  }]
};
/* eslint-enable */
export default class SimpleVideoEditor extends Component {

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
      <div className={editorStyles.editor} onClick={this.focus} >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => {
            this.editor = element;
          }}
        />
      </div>
    );
  }
}
