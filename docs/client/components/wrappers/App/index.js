import React, { Component } from 'react';
import styles from './styles.css';
import ExternalLink from '../../shared/Link';

import '../../favicon.ico';

export default class Wrapper extends Component {
  render() {
    return (
      <div>
        {this.props.children}
        <footer className={styles.footer}>
          Built with&nbsp;
          <span className={styles.heart}>
            &#x2764;
          </span>
          &nbsp;on Planet Earth

          <div className={styles.emojiAttribution}>
            Emoji art provided free by&nbsp;
            <ExternalLink href="http://emojione.com/">Emoji One</ExternalLink>
          </div>
        </footer>
      </div>
    );
  }
}
