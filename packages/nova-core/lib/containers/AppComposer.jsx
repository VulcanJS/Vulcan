import { composeWithTracker } from 'react-komposer';

function composer(props, onData) {

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

module.exports = composeWithTracker(composer);
export default composeWithTracker(composer);
