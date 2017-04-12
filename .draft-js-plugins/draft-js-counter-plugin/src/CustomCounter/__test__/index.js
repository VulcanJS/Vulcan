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

  it('instantiates plugin with word counter and counts 5 words', () => {
    const text = 'Hello there, how are you?';
    const editorState = createEditorStateFromText(text);
    counterPlugin.initialize({
      getEditorState: () => editorState,
    });
    const { CustomCounter } = counterPlugin;

    // a function that takes a string and returns the number of words
    const countFunction = (str) => {
      const wordArray = str.match(/\S+/g);  // matches words according to whitespace
      return wordArray ? wordArray.length : 0;
    };

    const result = mount(
      <CustomCounter countFunction={countFunction} />
    );
    expect(result).to.have.text('5');
  });

  it('instantiates plugin with number counter and counts 6 number characters', () => {
    const text = 'I am a 1337 h4x0r';
    const editorState = createEditorStateFromText(text);
    counterPlugin.initialize({
      getEditorState: () => editorState,
    });
    const { CustomCounter } = counterPlugin;

    // a function that takes a string and returns the number of number characters
    const countFunction = (str) => {
      const numArray = str.match(/\d/g);  // matches only number characters
      return numArray ? numArray.length : 0;
    };

    const result = mount(
      <CustomCounter countFunction={countFunction} />
    );
    expect(result).to.have.text('6');
  });
});
