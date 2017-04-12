import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { EditorState } from 'draft-js';
import createUndoPlugin from '../index';

describe('UndoPlugin Config', () => {
  const onChange = () => undefined;
  let editorState;

  beforeEach(() => {
    editorState = EditorState.createEmpty();
  });

  it('instantiates plugin with undoContent config', () => {
    const undoPlugin = createUndoPlugin({
      undoContent: 'custom-child',
    });
    const UndoButton = undoPlugin.UndoButton;
    const result = shallow(
      <UndoButton />
    );
    expect(result).to.have.prop('children', 'custom-child');
  });

  it('instantiates plugin with redoContent config', () => {
    const undoPlugin = createUndoPlugin({
      redoContent: 'custom-child',
    });
    const RedoButton = undoPlugin.RedoButton;
    const result = shallow(
      <RedoButton />
    );
    expect(result).to.have.prop('children', 'custom-child');
  });

  it('instantiates plugin with theme config', () => {
    const theme = {
      redo: 'custom-class-name',
      undo: 'custom-class-name',
    };
    const undoPlugin = createUndoPlugin({ theme });
    undoPlugin.initialize({
      getEditorState: () => editorState,
      setEditorState: onChange,
    });
    const { UndoButton, RedoButton } = undoPlugin;
    const redoResult = mount(
      <RedoButton />
    );
    const undoResult = mount(
      <UndoButton />
    );
    expect(redoResult.find('button')).to.have.prop('className').to.contain('custom-class-name');
    expect(undoResult.find('button')).to.have.prop('className').to.contain('custom-class-name');
  });
});
