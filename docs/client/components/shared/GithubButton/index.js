import React, { Component } from 'react';

export default class GithubStarButton extends Component {

  componentDidMount() {
    const githubScript = document.createElement('script');
    githubScript.src = '//buttons.github.io/buttons.js';
    githubScript.id = 'github-bjs';
    this.githubButton.parentNode.appendChild(githubScript);
  }

  shouldComponentUpdate = () => false;

  componentWillUnmount() {
    const elem = document.getElementById('github-bjs');
    if (elem !== undefined) {
      elem.parentNode.removeChild(elem);
    }
  }

  render() {
    const size = this.props.size ? this.props.size : 'default'; // 'mega' is the other option
    const text = this.props.text ? this.props.text : 'Github';

    // TODO make name & repo dynamic

    // Note: all of the attributes including the className 'github-button' are required
    return (
      <a
        ref={(element) => { this.githubButton = element; }}
        className="github-button"
        href="https://github.com/draft-js-plugins/draft-js-plugins"
        data-style={size}
        data-count-href="/draft-js-plugins/draft-js-plugins/stargazers"
        data-count-api="/repos/draft-js-plugins/draft-js-plugins#stargazers_count"
        data-count-aria-label="# stargazers on GitHub"
        aria-label="Star draft-js-plugins/draft-js-plugins on GitHub"
      >
        {text}
      </a>
    );
  }
}
