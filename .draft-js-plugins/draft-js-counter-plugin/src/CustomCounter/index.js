import React, { Component, PropTypes } from 'react';
import unionClassNames from 'union-class-names';

class CustomCounter extends Component {

  static propTypes = {
    theme: PropTypes.any,
    limit: PropTypes.number,
    countFunction: PropTypes.func.isRequired,
  };

  getClassNames(count, limit) {
    const { theme = {}, className } = this.props;
    const defaultStyle = unionClassNames(theme.counter, className);
    const overLimitStyle = unionClassNames(theme.counterOverLimit, className);
    return count > limit ? overLimitStyle : defaultStyle;
  }

  render() {
    const { store, limit, countFunction } = this.props;
    const plainText = store.getEditorState().getCurrentContent().getPlainText('');
    const count = countFunction(plainText);
    const classNames = this.getClassNames(count, limit);

    return <span className={classNames}>{count}</span>;
  }
}

export default CustomCounter;
