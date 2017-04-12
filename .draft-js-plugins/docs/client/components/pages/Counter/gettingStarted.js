// It is important to import the Editor which accepts plugins.
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createCounterPlugin from 'draft-js-counter-plugin'; // eslint-disable-line import/no-unresolved
import React from 'react';

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
const counterPlugin = createCounterPlugin();

// Extract a counter from the plugin.
const { CharCounter } = counterPlugin;

// The Editor accepts an array of plugins. In this case, only the counterPlugin is
// passed in, although it is possible to pass in multiple plugins.
// The Counter is placed after the Editor.
const MyEditor = ({ editorState, onChange }) => (
  <div>
    <Editor
      editorState={editorState}
      onChange={onChange}
      plugins={[counterPlugin]}
    />
    <CharCounter editorState={this.state.editorState} limit={200} />
  </div>
);

export default MyEditor;
