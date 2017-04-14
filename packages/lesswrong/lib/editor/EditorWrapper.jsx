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

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

const dummyState = {
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


class EditorWrapper extends Component {

  constructor(props){
    super(props);
    if (props.initialState) {
      this.state = {editorState: EditorState.createWithContent(convertFromRaw(props.initialState))}
    } else {
      this.state = {editorState: EditorState.createWithContent(convertFromRaw(dummyState))};
    }
    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);

    const focusPlugin = createFocusPlugin();
    const alignmentPlugin = createAlignmentPlugin();
    this.AlignmentTool = alignmentPlugin.AlignmentTool;
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
    this.InlineToolbar = inlineToolbarPlugin.InlineToolbar;
    this.imagePlugin = imagePlugin;

    this.plugins = [
      linkifyPlugin,
      imagePlugin,
      inlineToolbarPlugin,
      alignmentPlugin,
      focusPlugin,
      resizeablePlugin
    ];
  };

  onChange(editorState) {
    this.setState({
      editorState,
    });
    // TODO: Make this somehow less terrible. I.e. not make it serialize the whole contentState one very state change. Ideally some kind of callback on form submit, but that doesn't exist, I think.
    if (this.props.addValues) {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState: contentState);
      this.props.addValues({draftJS: rawContentState });
    }
  };

  focus() {
    this.editor.focus();
  };

  render() {
    const AlignmentTool = this.AlignmentTool;
    const InlineToolbar = this.InlineToolbar;

    if (this.props.readOnly) {
      // If the component is readOnly, then check on each render whether the initialState changed, and recompute the content;
      const editorState = EditorState.createWithContent(convertFromRaw(this.props.initialState));
      return (
        <div>
          <Editor
            editorState={editorState}
            onChange={(editorState) => this.setState({editorState})}
            plugins={this.plugins}
            readOnly />
        </div>
      )
    } else {
      return (
        <div>
          <div onClick={this.focus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              plugins={this.plugins}
              ref={(element) => {this.editor = element;}}
            />
          </div>
          <AlignmentTool />
          <InlineToolbar />
          <Components.ImageAdd
            editorState={this.state.editorState}
            onChange={this.onChange}
            modifier={this.imagePlugin.addImage}
          />
        </div>
      );
    }
  }
}

registerComponent('EditorWrapper', EditorWrapper, withCurrentUser);
