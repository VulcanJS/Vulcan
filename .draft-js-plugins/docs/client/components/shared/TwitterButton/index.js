import React, { Component } from 'react';

export default class TwitterButton extends Component {

  componentDidMount() {
    const twitterscript = document.createElement('script');
    twitterscript.src = '//platform.twitter.com/widgets.js';
    twitterscript.id = 'twitter-wjs';
    twitterscript.onload = this.renderWidget;
    this.twitterbutton.parentNode.appendChild(twitterscript);
  }

  // prevent re-rendering of the button
  shouldComponentUpdate = () => false;

  componentWillUnmount() {
    const elem = document.getElementById('twitter-wjs');
    if (elem !== undefined) {
      elem.parentNode.removeChild(elem);
    }
  }

  renderWidget = () => {
    const text = this.props.text ? this.props.text : '';
    const size = this.props.size ? this.props.size : 'default';
    window.twttr.widgets.createShareButton(
      this.props.url,
      this.twitterbutton,
      {
        text,
        size,
      }
    );
  };

  render() {
    return (
      <span ref={(element) => { this.twitterbutton = element; }} />
    );
  }
}
