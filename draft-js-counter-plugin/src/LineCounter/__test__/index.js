import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { EditorState, ContentState } from 'draft-js';
import createCounterPlugin from '../../index';

describe('CounterPlugin Line Counter', () => {
  const createEditorStateFromText = (text) => {
    const contentState = ContentState.createFromText(text);
    return EditorState.createWithContent(contentState);
  };

  let counterPlugin;

  beforeEach(() => {
    counterPlugin = createCounterPlugin();
  });

  it('instantiates plugin and counts 3 lines', () => {
    const editorState = createEditorStateFromText('One\nTwo\nThree');
    counterPlugin.initialize({
      getEditorState: () => editorState,
    });
    const { LineCounter } = counterPlugin;

    const result = mount(
      <LineCounter />
    );
    expect(result).to.have.text('3');
  });
});
