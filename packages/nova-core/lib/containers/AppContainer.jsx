import React, { PropTypes, Component } from 'react';
import { composeWithTracker } from 'react-komposer';

function AppComposer(props, onData) {

  const subscriptions = Telescope.subscriptions.map((sub) => Meteor.subscribe(sub.name, sub.arguments));

  FlowRouter.watchPathChange();

  if (!subscriptions.length || _.every(subscriptions, handle => handle.ready())) {
    const data = {
      ready: true,
      currentUser: Meteor.user(),
      currentRoute: FlowRouter.current()
    }
    onData(null, data);
  } else {
    onData(null, {ready: false});
  }
}

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

module.exports = composeWithTracker(AppComposer)(App);
export default composeWithTracker(AppComposer)(App);
