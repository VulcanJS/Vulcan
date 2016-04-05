import React, { PropTypes, Component } from 'react';

const IsAdmin = ({user, children}) => {
  if (!user){
    return <p>Please log in.</p>;
  } else if (Users.is.admin(user)) {
    return children;
  } else {
    return <p>Sorry, you are not an admin hence you can't edit settings.</p>;
  }
};

IsAdmin.propTypes = {
  user: React.PropTypes.object
}

module.exports = IsAdmin;
export default IsAdmin;