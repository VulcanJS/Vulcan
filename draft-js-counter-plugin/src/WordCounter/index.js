import React, { Component, PropTypes } from 'react';
import unionClassNames from 'union-class-names';

class WordCounter extends Component {

  static propTypes = {
    theme: PropTypes.any,
    limit: PropTypes.number,
  };

  getWordCount(editorState) {
    const plainText = editorState.getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g;  // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g);  // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  }

  getClassNames(count, limit) {
    const { theme = {}, className } = this.props;
    const defaultStyle = unionClassNames(theme.counter, className);
    const overLimitStyle = unionClassNames(theme.counterOverLimit, className);
    return count > limit ? overLimitStyle : defaultStyle;
  }

  render() {
    const { store, limit } = this.props;
    const count = this.getWordCount(store.getEditorState());
    const classNames = this.getClassNames(count, limit);

    return <span className={classNames}>{count}</span>;
  }
}

export default WordCounter;
