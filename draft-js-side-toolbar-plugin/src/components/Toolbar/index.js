/* eslint-disable react/no-array-index-key */
import React from 'react';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

export default class Toolbar extends React.Component {

  state = {
    position: {
      transform: 'scale(0)',
    }
  }

  componentDidMount() {
    this.props.store.subscribeToItem('editorState', this.onEditorStateChange);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem('editorState', this.onEditorStateChange);
  }

  onEditorStateChange = (editorState) => {
    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) {
      this.setState({
        position: {
          transform: 'scale(0)',
        },
      });
      return;
    }

    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    // TODO verify that always a key-0-0 exists
    const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);
    // Note: need to wait on tick to make sure the DOM node has been create by Draft.js
    setTimeout(() => {
      const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
      const top = node.getBoundingClientRect().top;
      const editor = this.props.store.getItem('getEditorRef')().refs.editor;
      this.setState({
        position: {
          top: (top + window.scrollY),
          left: editor.getBoundingClientRect().left - 80,
          transform: 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
        },
      });
    }, 0);
  }

  render() {
    const { theme, store } = this.props;
    return (
      <div
        className={theme.toolbarStyles.wrapper}
        style={this.state.position}
      >
        {this.props.structure.map((Component, index) => (
          <Component
            key={index}
            getEditorState={store.getItem('getEditorState')}
            setEditorState={store.getItem('setEditorState')}
            theme={theme}
          />
        ))}
      </div>
    );
  }
}
