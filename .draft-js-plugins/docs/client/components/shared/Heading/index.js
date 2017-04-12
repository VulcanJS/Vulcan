import React, { Component } from 'react';
import styles from './styles.css';

export default class Heading extends Component {

  render() {
    let style;
    switch (this.props.level) {
      case 2:
        style = styles.level2;
        break;
      case 3:
        style = styles.level3;
        break;
      case 4:
        style = styles.level4;
        break;
      default:
        style = styles.level2;
    }

    return (
      <h2 className={style}>
        {this.props.children}
      </h2>
    );
  }
}
