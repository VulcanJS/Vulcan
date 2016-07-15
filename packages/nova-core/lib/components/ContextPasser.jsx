import React, { PropTypes, Component } from 'react';

class ContextPasser extends Component {

  getChildContext() {
    return {
      closeCallback: this.props.closeCallback,
      currentUser: this.props.currentUser, // pass on currentUser,
      actions: this.props.actions,
      events: this.props.events,
      messages: this.props.messages,
    };
  }

  render() {
    return this.props.children;
  }
}

ContextPasser.propTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,  
};

ContextPasser.childContextTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
};

export default ContextPasser;
module.exports = ContextPasser;