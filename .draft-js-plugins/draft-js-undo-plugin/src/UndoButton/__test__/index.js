/* eslint no-unused-expressions: 0, react/no-children-prop:0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { EditorState, Modifier } from 'draft-js';
import Undo from '../index';

chai.use(sinonChai);

describe('UndoButton', () => {
  const onChange = () => sinon.spy();
  let editorState;
  let store = {
    getEditorState: () => editorState,
    setEditorState: onChange,
  };

  beforeEach(() => {
    editorState = EditorState.createEmpty();
  });

  it('applies the className based on the theme property `undo`', () => {
    const theme = { undo: 'custom-class-name' };
    const result = shallow(
      <Undo
        store={store}
        theme={theme}
        children={'undo'}
      />
    );
    expect(result).to.have.prop('className', 'custom-class-name');
  });

  it('renders the passed in children', () => {
    const result = shallow(
      <Undo
        store={store}
        children="undo"
      />
    );
    expect(result).to.have.prop('children', 'undo');
  });

  it('applies a custom className as well as the theme', () => {
    const theme = { undo: 'custom-class-name' };
    const result = shallow(
      <Undo
        store={store}
        theme={theme}
        className="undo"
        children="undo"
      />
    );
    expect(result).to.have.prop('className').to.contain('undo');
    expect(result).to.have.prop('className').to.contain('custom-class-name');
  });

  it('adds disabled attribute to button if the getUndoStack is empty', () => {
    const result = shallow(
      <Undo
        store={store}
        children="redo"
      />
    );
    expect(result.find('button')).prop('disabled').to.equal(true);
  });

  it('removes disabled attribute from button if the getUndoStack is not empty', () => {
    const contentState = editorState.getCurrentContent();
    const SelectionState = editorState.getSelection();
    const newContent = Modifier.insertText(
      contentState,
      SelectionState,
      'hello'
    );
    const newEditorState = EditorState.push(editorState, newContent, 'insert-text');
    store = {
      getEditorState: () => newEditorState,
      setEditorState: onChange,
    };
    const result = shallow(
      <Undo
        store={store}
        children="redo"
      />
    );
    expect(result.find('button')).prop('disabled').to.equal(false);
  });

  it('triggers an update with undo when the button is clicked', () => {
    const result = shallow(
      <Undo
        store={store}
        children="redo"
      />
    );
    result.find('button').simulate('click');
    expect(onChange).to.have.been.calledOnce;
  });
});
