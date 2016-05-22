import React, { PropTypes, Component } from 'react';

const CanView = ({user, children}) => {
  if (Users.can.view(user)) {
    return children;
  } else if (!user){
    return <p>Please log in.</p>;
  } else {
    return <p>Sorry, you do not have permissions to post at this time</p>;
  }
};

CanView.propTypes = {
  user: React.PropTypes.object
}

CanView.displayName = "CanView";

module.exports = CanView;