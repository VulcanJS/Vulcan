/* eslint no-unused-expressions: 0, react/no-children-prop:0 */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { EditorState, Modifier } from 'draft-js';
import Redo from '../index';

chai.use(sinonChai);

describe('RedoButton', () => {
  const onChange = () => sinon.spy();
  let editorState;
  let store = {
    getEditorState: () => editorState,
    setEditorState: onChange,
  };

  beforeEach(() => {
    editorState = EditorState.createEmpty();
  });

  it('applies the className based on the theme property `redo`', () => {
    const theme = { redo: 'custom-class-name' };
    const result = shallow(
      <Redo
        store={store}
        theme={theme}
        children={'redo'}
      />
    );
    expect(result).to.have.prop('className', 'custom-class-name');
  });

  it('renders the passed in children', () => {
    const result = shallow(
      <Redo
        store={store}
        children="redo"
      />
    );
    expect(result).to.have.prop('children', 'redo');
  });

  it('applies a custom className as well as the theme', () => {
    const theme = { redo: 'custom-class-name' };
    const result = shallow(
      <Redo
        store={store}
        theme={theme}
        className="redo"
        children="redo"
      />
    );
    expect(result).to.have.prop('className').to.contain('redo');
    expect(result).to.have.prop('className').to.contain('custom-class-name');
  });

  it('adds disabled attribute to button if the getRedoStack is empty', () => {
    const result = shallow(
      <Redo
        store={store}
        children="redo"
      />
    );
    expect(result.find('button')).prop('disabled').to.equal(true);
  });

  it('removes disabled attribute from button if the getRedoStack is not empty', () => {
    const contentState = editorState.getCurrentContent();
    const SelectionState = editorState.getSelection();
    const newContent = Modifier.insertText(
      contentState,
      SelectionState,
      'hello'
    );
    const newEditorState = EditorState.push(editorState, newContent, 'insert-text');
    const undoEditorState = EditorState.undo(newEditorState);
    store = {
      getEditorState: () => undoEditorState,
      setEditorState: onChange,
    };
    const result = shallow(
      <Redo
        store={store}
        children="redo"
      />
    );
    expect(result.find('button')).prop('disabled').to.equal(false);
  });

  it('triggers an update with redo when the button is clicked', () => {
    const result = shallow(
      <Redo
        store={store}
        children="redo"
      />
    );
    result.find('button').simulate('click');
    expect(onChange).to.have.been.calledOnce;
  });
});
