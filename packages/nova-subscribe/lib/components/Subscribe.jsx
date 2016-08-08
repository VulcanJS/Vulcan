import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';

class Subscribe extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  onSubscribe(e) {
    e.preventDefault();

    const post = this.props.post;
    const user = this.context.currentUser;

    let callAction = 'posts.subscribe';

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      callAction = "posts.unsubscribe";
    }

    this.context.actions.call(callAction, post._id, (error, result) => {
      if (error)
        this.context.messages.flash(error.message, "error")
      if (result)
        this.context.events.track(callAction, {'_id': post._id});
    })
  }

  isSubscribed(post, user) {
    if (!post || !user)
      return false;
    return post.subscribers && post.subscribers.indexOf(user._id) != -1;
  }

  render() {
    const post = this.props.post;
    const user = this.context.currentUser;

    // can't subscribe to own post (also validated on server side)
    if(user && post.author === user.username) {
      return null;
    }

    let btnTitle = "posts.subscribe";

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      btnTitle = "posts.unsubscribe";
    }

    return (
      <a onClick={this.onSubscribe} >{this.context.intl.formatMessage({id: btnTitle})}</a>
    )
  }

}

Subscribe.propTypes = {
  post: React.PropTypes.object.isRequired
}

Subscribe.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
};

module.exports = Subscribe;
export default Subscribe;
