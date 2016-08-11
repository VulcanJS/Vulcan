import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';

class UsersSubscribe extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  onSubscribe(e) {
    e.preventDefault();

    const user = this.props.user;
    const currentUser = this.context.currentUser;

    let callAction = 'users.subscribe';

    let isSubscribed = this.isSubscribed(user, currentUser);
    if( isSubscribed ) {
      callAction = "users.unsubscribe";
    }
    debugger

    this.context.actions.call(callAction, user._id, (error, result) => {
      if (error)
        this.context.messages.flash(error.message, "error")
      if (result)
        this.context.events.track(callAction, {'_id': user._id});
    });
  }

  isSubscribed(user, currentUser) {
    if (!user || !currentUser)
      return false;

    return user.telescope && user.telescope.subscribers && user.telescope.subscribers.indexOf(currentUser._id) != -1;
  }

  render() {
    const {user} = this.props;
    const {currentUser, intl} = this.context;

    // can't subscribe to yourself (also validated on server side)
    if(!user || user === currentUser) {
      return null;
    }

    let btnTitle = "users.subscribe";

    let isSubscribed = this.isSubscribed(user, currentUser);
    if( isSubscribed ) {
      btnTitle = "users.unsubscribe";
    }

    return (
      <a onClick={this.onSubscribe} >{intl.formatMessage({id: btnTitle})}</a>
    );
  }

}

UsersSubscribe.propTypes = {
  user: React.PropTypes.object.isRequired
}

UsersSubscribe.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
};

export default UsersSubscribe;
