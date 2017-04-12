import React, { Component } from 'react';
import { EditorState } from 'draft-js';
// eslint-disable-next-line import/no-unresolved
import Editor from 'draft-js-plugins-editor';
// eslint-disable-next-line import/no-unresolved
import createMentionPlugin from 'draft-js-mention-plugin';
import { fromJS } from 'immutable';
import editorStyles from './editorStyles.css';

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

export default class SimpleMentionEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: fromJS([]),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    // An import statment would break server-side rendering.
    require('whatwg-fetch'); // eslint-disable-line global-require

    // while you normally would have a dynamic server that takes the value as
    // a workaround we use this workaround to show different results
    let url = '/data/mentionsA.json';
    if (value.length === 1) {
      url = '/data/mentionsB.json';
    } else if (value.length > 1) {
      url = '/data/mentionsC.json';
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          suggestions: fromJS(data),
        });
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
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
        />
      </div>
    );
  }
}
