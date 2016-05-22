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
    
    ({Layout, AppLoading} = Telescope.components);

    if (this.props.ready) {
      return <Layout currentUser={this.props.currentUser}>{this.props.content}</Layout>
    } else {
      return <AppLoading />
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