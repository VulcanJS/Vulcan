import { composeWithTracker } from 'react-komposer';

function composer(props, onData) {

  const subscriptions = Telescope.subscriptions.map((sub) => Meteor.subscribe(sub.name, sub.arguments));

  FlowRouter.watchPathChange();

  const data = {
    currentUser: Meteor.user(),
    currentRoute: FlowRouter.current()
  }

  Meteor.call("settings.getJSON", (error, result) => {
    Telescope.settings.settingsJSON = result;
  });

  if (!subscriptions.length || _.every(subscriptions, handle => handle.ready())) {
    data.ready = true;
    onData(null, data);
  } else {
    onData(null, {ready: false});
  }
}

module.exports = composeWithTracker(composer);
export default composeWithTracker(composer);
