import { composeWithTracker } from 'react-komposer';
import Messages from '../messages.js';
import Events from "meteor/nova:events";

function composer(props, onData) {

  const subscriptions = Telescope.subscriptions.map((sub) => Meteor.subscribe(sub.name, sub.arguments));

  const data = {
    currentUser: Meteor.user(),
    actions: {call: Meteor.call},
    events: Events,
    messages: Messages
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
