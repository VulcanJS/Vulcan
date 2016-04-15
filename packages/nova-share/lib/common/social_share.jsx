import React, { PropTypes, Component } from 'react';

class SocialShare extends Component {

  constructor() {
    super();
    this.toggleView = this.toggleView.bind(this);
    this.state = {
      showShare: false
    }
  }

  viaTwitter() {
    return !!Settings.get('twitterAccount') ? 'via='+Settings.get('twitterAccount') : '';
  }

  toggleView() {
    this.setState({
      showShare: !this.state.showShare
    });
    return;
  }

  insertIcon(name) {
    return {__html: Telescope.utils.getIcon(name)};
  }

  render() {
    let shareDisplay = this.state.showShare ? 'active' : 'hidden';
    return (
      <div className="social-share">
        <a className="share-link action" title="share" onClick={ this.toggleView } dangerouslySetInnerHTML={ this.insertIcon('share')}/>
        <div className={ `share-options ${shareDisplay}` }>
          <a className="share-option-facebook" href={ `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(FlowRouter.url(this.props.url)) }`} target="_blank" dangerouslySetInnerHTML={ this.insertIcon('facebook')} />
          <a className="share-option-twitter" href={ `//twitter.com/intent/tweet?text=${ encodeURIComponent(this.props.title) }%20-%20${ encodeURIComponent(FlowRouter.url(this.props.url)) }` } target="_blank" dangerouslySetInnerHTML={ this.insertIcon('twitter')}/>
          <a className="share-option-linkedin" href={ `//www.linkedin.com/shareArticle?mini=true&url=${ encodeURIComponent(FlowRouter.url(this.props.url)) }&summary=${ encodeURIComponent(this.props.title) }` } target="_blank" dangerouslySetInnerHTML={ this.insertIcon('linkedin')}/>
          <a className="share-option-google" href={ `https://plus.google.com/share?url=${ encodeURIComponent(FlowRouter.url(this.props.url)) }` } target="_blank" dangerouslySetInnerHTML={ this.insertIcon('googleplus')}/>
        </div>
      </div>
    )
  }
}

SocialShare.propTypes = {
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
}

module.exports = SocialShare;
