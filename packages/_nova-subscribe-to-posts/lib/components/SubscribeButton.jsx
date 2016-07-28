import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import Subscribe from './Subscribe.jsx';

class SubscribeButton extends Subscribe {

  render() {
    const post = this.props.post;
    const user = this.context.currentUser;

    // can't subscribe to own post (also validated on server side)
    if(user && post.author === user.username) {
      return null;
    }

    let btnStyle = "default";
    let btnTitle = "posts.subscribe";
    let btnIcon  = "eye";

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      btnStyle = "info";
      btnTitle = "posts.unsubscribe";
      btnIcon  = "eye-slash";
    }

    return (
      <button type="button" title={this.context.intl.formatMessage({id: btnTitle})}
        className={`btn btn-${btnStyle} btn-sm`}
        style={{padding: '.5rem', lineHeight: 1, borderRadius: '50%', marginLeft: '.5rem'}}
        onClick={this.onSubscribe} >
        <i className={`fa fa-${btnIcon}`}></i>
      </button>
    )
  }

}

module.exports = SubscribeButton;
export default SubscribeButton;
