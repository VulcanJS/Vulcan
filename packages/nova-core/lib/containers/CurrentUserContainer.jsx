import { createContainer } from 'meteor/react-meteor-data';

const CurrentUserContainer = ({component}) => {
  return createContainer(() => {
    return {
      currentUser: Meteor.user()
    }
  }, component)
}

module.exports = CurrentUserContainer;
export default CurrentUserContainer;