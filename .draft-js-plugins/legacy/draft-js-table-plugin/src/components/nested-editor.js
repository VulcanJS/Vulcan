import React, { Component } from 'react';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';

export default (PluginEditor) => class NestedEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.editorState
        ? EditorState.createWithContent(convertFromRaw(props.editorState))
        : EditorState.createWithContent(ContentState.createFromText('Insert text ...'))
    };
  }

  componentDidMount() {
    this.editor.addEventListener('mousedown', this.mouseDown, false);
    this.editor.addEventListener('keydown', this.stopPropagation, false);
  }

  componentWillUnmount() {
    this.editor.removeEventListener('mousedown', this.listener, false);
    this.editor.removeEventListener('keydown', this.stopPropagation, false);
  }

  onChange = (editorState) => {
    const { readOnly } = this.props;
    if (readOnly) return;
    this.setState({ editorState });
    this.props.onChange(convertToRaw(editorState.getCurrentContent()));
  }

  mouseDown = (event) => {
    const { readOnly, setFocus } = this.props;
    event.stopPropagation();
    if (readOnly === false) {
      return;
    }

    setFocus();
  }

  stopPropagation = (event) => {
    if (event.keyCode === 38) {
      event.stopPropagation();
    } else if (event.keyCode === 40) {
      event.stopPropagation();
    } else if (event.keyCode === 8) {
      event.stopPropagation();
    }
  }

  render() {
    const { editorState } = this.state;
    const { readOnly } = this.props;

    return (
      <PluginEditor
        {...this.props}
        ref={(element) => { this.editor = element; }}
        editorState={editorState}
        onChange={this.onChange}
        readOnly={readOnly}
      />
    );
  }
};
