import { registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';

class ContextPasser extends Component {

  getChildContext() {
    return {
      closeCallback: this.props.closeCallback,
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
  events: React.PropTypes.object,
  messages: React.PropTypes.object,  
};

ContextPasser.childContextTypes = {
  closeCallback: React.PropTypes.func,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
};

registerComponent('ContextPasser', ContextPasser);

export default ContextPasser;
module.exports = ContextPasser;