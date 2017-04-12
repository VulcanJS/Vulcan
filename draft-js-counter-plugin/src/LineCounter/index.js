import React, { Component, PropTypes } from 'react';
import unionClassNames from 'union-class-names';

class LineCounter extends Component {

  static propTypes = {
    theme: PropTypes.any,
    limit: PropTypes.number,
  };

  getLineCount(editorState) {
    const blockArray = editorState.getCurrentContent().getBlocksAsArray();
    return blockArray ? blockArray.length : null;
  }

  getClassNames(count, limit) {
    const { theme = {}, className } = this.props;
    const defaultStyle = unionClassNames(theme.counter, className);
    const overLimitStyle = unionClassNames(theme.counterOverLimit, className);
    return count > limit ? overLimitStyle : defaultStyle;
  }

  render() {
    const { store, limit } = this.props;
    const count = this.getLineCount(store.getEditorState());
    const classNames = this.getClassNames(count, limit);

    return <span className={classNames}>{count}</span>;
  }
}

export default LineCounter;
