import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import styles from './styles.css';

export default class StatePreview extends Component {

  shouldComponentUpdate = shouldComponentUpdate; // eslint-disable-line no-redeclare

  render() {
    const codeClassName = this.props.collapsed ? styles.collapsedCode : styles.expandedCode;

    let code = null;
    if (!this.props.collapsed) {
      code = JSON.stringify(this.props.editorState.getCurrentContent().toJS(), null, 2);
    }

    return (
      <div className={styles.root}>
        <pre className={codeClassName}>
          {code}
        </pre>
      </div>
    );
  }
}
