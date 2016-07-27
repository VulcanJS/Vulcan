import React, { PropTypes, Component } from 'react';

class SubscribeButton extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  onSubscribe() {
    const post = this.props.post;
    const user = this.context.currentUser;

    let callAction = 'subscribePost';

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      callAction = "unsubscribePost";
    }

    this.context.actions.call(callAction, post._id, (error, result) => {
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
      return null
    }

    let btnStyle = "default";

    let isSubscribed = this.isSubscribed(post, user);
    if( isSubscribed ) {
      btnStyle = "info";
    }

    return (
      <button type="button" title="Observe"
        className={`btn btn-${btnStyle} btn-sm pull-right`}
        style={{padding: '.5rem', lineHeight: 1, borderRadius: '50%', marginLeft: '.5rem'}}
        onClick={this.onSubscribe} >
        <i className="fa fa-eye"></i>
      </button>
    )
  }

}

SubscribeButton.propTypes = {
  post: React.PropTypes.object.isRequired
}

SubscribeButton.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object
};

module.exports = SubscribeButton;
export default SubscribeButton;
