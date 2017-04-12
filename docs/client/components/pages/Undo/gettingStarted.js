// It is important to import the Editor which accepts plugins.
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createUndoPlugin from 'draft-js-undo-plugin'; // eslint-disable-line import/no-unresolved
import React from 'react';

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;

// The Editor accepts an array of plugins. In this case, only the undoPlugin
// is passed in, although it is possible to pass in multiple plugins.
const MyEditor = ({ editorState, onChange }) => (
  <div>
    <Editor
      editorState={editorState}
      onChange={onChange}
      plugins={[undoPlugin]}
    />
    <UndoButton />
    <RedoButton />
  </div>
);

export default MyEditor;
