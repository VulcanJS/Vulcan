import React, { Component, PropTypes } from 'react';
import { EditorState } from 'draft-js';
import unionClassNames from 'union-class-names';

class RedoButton extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.any,
  };

  onClick = () => {
    this.props.store.setEditorState(EditorState.redo(this.props.store.getEditorState()));
  };

  render() {
    const { theme = {}, children, className } = this.props;
    const combinedClassName = unionClassNames(theme.redo, className);
    return (
      <button
        disabled={this.props.store.getEditorState().getRedoStack().isEmpty()}
        onClick={this.onClick}
        className={combinedClassName}
      >
        {children}
      </button>
    );
  }
}

export default RedoButton;
