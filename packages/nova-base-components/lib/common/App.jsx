import React, { PropTypes, Component } from 'react';

import { AppComposer } from "meteor/nova:core";

class App extends Component {

  getChildContext() {
    return {
      currentUser: this.props.currentUser,
      currentRoute: this.props.currentRoute
    };
  }

  render() {
    if (this.props.ready) {
      return <Telescope.components.Layout currentUser={this.props.currentUser}>{this.props.content}</Telescope.components.Layout>
    } else {
      return <Telescope.components.AppLoading />
    }
  }

}

App.propTypes = {
  ready: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object
}

module.exports = AppComposer(App);
export default AppComposer(App);