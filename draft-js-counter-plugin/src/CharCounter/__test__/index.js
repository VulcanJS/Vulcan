import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { EditorState, ContentState } from 'draft-js';
import createCounterPlugin from '../../index';

describe('CounterPlugin Character Counter', () => {
  const createEditorStateFromText = (text) => {
    const contentState = ContentState.createFromText(text);
    return EditorState.createWithContent(contentState);
  };

  let counterPlugin;

  beforeEach(() => {
    counterPlugin = createCounterPlugin();
  });

  it('instantiates plugin and counts 12 characters', () => {
    const editorState = createEditorStateFromText('Hello World!');
    counterPlugin.initialize({
      getEditorState: () => editorState,
    });
    const { CharCounter } = counterPlugin;

    const result = mount(
      <CharCounter />
    );
    expect(result).to.have.text('12');
  });

  it('instantiates plugin and counts 3 unicode characters', () => {
    const editorState = createEditorStateFromText('😁😂😃');
    counterPlugin.initialize({
      getEditorState: () => editorState,
    });
    const { CharCounter } = counterPlugin;

    const result = mount(
      <CharCounter />
    );
    expect(result).to.have.text('3');
  });
});
