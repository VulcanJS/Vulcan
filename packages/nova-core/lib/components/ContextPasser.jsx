import React, { PropTypes, Component } from 'react';

class ContextPasser extends Component {

  getChildContext() {
    return {
      closeCallback: this.props.closeCallback,
      currentUser: this.props.currentUser // pass on currentUser
    };
  }

  render() {
    return this.props.children;
  }
}

ContextPasser.propTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object
};

ContextPasser.childContextTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object
};

export default ContextPasser;
module.exports = ContextPasser;