import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createCounterPlugin from 'draft-js-counter-plugin'; // eslint-disable-line import/no-unresolved
import editorStyles from './editorStyles.css';

const counterPlugin = createCounterPlugin();
const { CharCounter, WordCounter, LineCounter, CustomCounter } = counterPlugin;
const plugins = [counterPlugin];
const text = `This editor has counters below!
Try typing here and watch the numbers go up. 🙌

Note that the color changes when you pass one of the following limits:
- 200 characters
- 30 words
- 10 lines
`;

export default class SimpleCounterEditor extends Component {

  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  focus = () => {
    this.editor.focus();
  };

  customCountFunction(str) {
    const wordArray = str.match(/\S+/g);  // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  }

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
        <div><CharCounter limit={200} /> characters</div>
        <div><WordCounter limit={30} /> words</div>
        <div><LineCounter limit={10} /> lines</div>
        <div>
          <CustomCounter limit={40} countFunction={this.customCountFunction} />
          <span> words (custom function)</span>
        </div>
        <br />
        <br />
      </div>
    );
  }
}
