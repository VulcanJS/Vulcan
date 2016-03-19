import { createContainer } from 'meteor/react-meteor-data';

const CurrentUserContainer = createContainer(() => {
  return {
    currentUser: Meteor.user()
  }
}, params => <params.component {...params} />);

module.exports = CurrentUserContainer;
export default CurrentUserContainer;