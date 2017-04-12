import React, { Component } from 'react';

export default class FacebookLikeButton extends Component {

  componentDidMount() {
    const fbscript = document.createElement('script');
    fbscript.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5';
    fbscript.id = 'facebook-jssdk';
    fbscript.onload = this.renderWidget;
    this.fbbutton.parentNode.appendChild(fbscript);
  }

  // prevent re-rendering of the button
  shouldComponentUpdate = () => false;

  componentWillUnmount() {
    const elem = document.getElementById('facebook-jssdk');
    if (elem !== undefined) {
      elem.parentNode.removeChild(elem);
    }
  }

  renderWidget = () => {
    /*
       need to detect if it has already been parsed.
       if coming from react router it may need reparsing.
    */
    setTimeout(() => {
      window.FB.XFBML.parse();
    }, 0);
  };

  render() {
    // Note: the width was set to 290 to work well on mobile
    return (
      <div
        id="fbbutton"
        ref={(element) => { this.fbbutton = element; }}
        className="fb-like"
        data-href={this.props.url}
        data-layout="standard"
        data-action="like"
        data-show-faces="true"
        data-share="true"
        data-width="290"
      />
    );
  }
}
