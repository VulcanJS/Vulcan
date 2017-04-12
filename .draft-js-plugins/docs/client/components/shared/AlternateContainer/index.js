import React, { Component } from 'react';
import unionClassNames from 'union-class-names';
import styles from './styles.css';
import ContainerBox from '../ContainerBox';

export default class AlternateContainer extends Component {

  render() {
    const { className } = this.props;
    const combinedClassName = unionClassNames(styles.root, className);
    return (
      <div className={combinedClassName}>
        <ContainerBox>
          {this.props.children}
        </ContainerBox>
      </div>
    );
  }
}
