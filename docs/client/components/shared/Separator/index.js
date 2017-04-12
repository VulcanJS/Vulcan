import React, { Component } from 'react';
import styles from './styles.css';

export default class Separator extends Component {

  state = {
    separator1ClassName: styles.separatorBase,
    separator2ClassName: styles.separatorBase,
    separator3ClassName: styles.separatorBase,
    separator4ClassName: styles.separatorBase,
    separator5ClassName: styles.separatorBase,
    separator6ClassName: styles.separatorBase,
    separatorRootClassName: styles.root,
  };

  componentDidMount() {
    setTimeout(() => this.setState({
      separator1ClassName: styles.separatorPart1,
      separator2ClassName: styles.separatorPart2,
      separator3ClassName: styles.separatorPart3,
      separator4ClassName: styles.separatorPart4,
      separator5ClassName: styles.separatorPart5,
      separator6ClassName: styles.separatorPart6,
      separatorRootClassName: styles.rootFinal,
    }), 1800);
  }

  render() {
    return (
      <div className={this.state.separatorRootClassName}>
        <div className={this.state.separator1ClassName} />
        <div className={this.state.separator2ClassName} />
        <div className={this.state.separator3ClassName} />
        <div className={this.state.separator4ClassName} />
        <div className={this.state.separator5ClassName} />
        <div className={this.state.separator6ClassName} />
      </div>
    );
  }
}
