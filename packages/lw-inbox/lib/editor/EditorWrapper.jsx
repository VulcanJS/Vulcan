/*

Wrapper for the Editor components

*/

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import create from 'draft-js-linkify-plugin';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';

import { EditorState, convertFromRaw } from 'draft-js';

const focusPlugin = createFocusPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const resizeablePlugin = createResizeablePlugin();


const decorator = composeDecorators(
  focusPlugin.decorator,
  alignmentPlugin.decorator,
  resizeablePlugin.decorator,
);

const linkifyPlugin = createLinkifyPlugin();
const imagePlugin = createImagePlugin({ decorator });
const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;

const initialState = {
    "entityMap": {
        "0": {
            "type": "image",
            "mutability": "IMMUTABLE",
            "data": {
                "src": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
            }
        }
    },
    "blocks": [{
        "key": "9gm3s",
        "text": "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
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

const plugins = [
  linkifyPlugin,
  imagePlugin,
  inlineToolbarPlugin,
  alignmentPlugin,
  focusPlugin,
  resizeablePlugin
];

class EditorWrapper extends Component {

  constructor(props){
    super(props);
    this.state = {editorState: EditorState.createWithContent(convertFromRaw(initialState))};
    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
  };

  onChange(editorState) {
    this.setState({
      editorState,
    });
  };

  focus() {
    this.editor.focus();
  };

  render() {
    return (
      <div onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => {this.editor = element;}}
        />
        <div className="Toolbars">
          <InlineToolbar />
          <AlignmentTool />
        </div>
      </div>
    );
  }
}

registerComponent('EditorWrapper', EditorWrapper, withCurrentUser);
