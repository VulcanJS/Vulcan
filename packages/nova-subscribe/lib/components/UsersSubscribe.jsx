import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import Telescope from 'meteor/nova:lib';

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

    let action = "users.subscribe";

    let isSubscribed = this.isSubscribed(user, currentUser);
    if( isSubscribed ) {
      action = "users.unsubscribe";
    }

    return (
      <Telescope.components.CanDo action={action}>
        <a onClick={this.onSubscribe} >{intl.formatMessage({id: action})}</a>
      </Telescope.components.CanDo>
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
