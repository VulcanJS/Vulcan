import Users from '../collection.js';
import { newMutation } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

const createUser = user => {
  
  // if user has an email, copy it over to emails array
  if(user.email) {
    user.emails = [{address: user.email, verified: false}];
  }

  user.services = {};

  newMutation({
    collection: Users, 
    document: user,
    validate: false
  });
}

export default createUser;