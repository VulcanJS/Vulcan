import React, { Component, PropTypes } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import unionClassNames from 'union-class-names';
import 'prismjs/themes/prism.css';
import styles from './styles.css';

export default class InlineCode extends Component {

  static propTypes = {
    code: PropTypes.string,
  };

  shouldComponentUpdate = shouldComponentUpdate; // eslint-disable-line no-redeclare

  render() {
    const { className } = this.props;
    const combinedRootClassName = unionClassNames(styles.root, className);
    return (
      <span className={combinedRootClassName}>
        <code
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.code }}
        />
      </span>
    );
  }
}
