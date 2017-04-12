import React, { Component } from 'react';
import TwitterButton from '../TwitterButton';
import FacebookButton from '../FacebookButton';
import GithubButton from '../GithubButton';
import styles from './styles.css';

export default class SocialBar extends Component {

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.githubButtonWrapper}>
          <GithubButton user="draft-js-plugins" repo="draft-js-plugins" size="mega" />
        </div>
        <div className={styles.twitterButtonWrapper}>
          <TwitterButton url="https://www.draft-js-plugins.com/" size="large" />
        </div>
        <div className={styles.facebookButtonWrapper}>
          <FacebookButton url="https://www.draft-js-plugins.com/" />
        </div>
      </div>
    );
  }
}
