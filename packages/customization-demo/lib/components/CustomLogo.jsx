/*
The original Logo components is defined using React's
functional stateless component syntax, so we redefine
it the same way. 
*/

import Telescope from 'meteor/nova:lib';
import React from 'react';
import { IndexLink } from 'react-router';
import Users from 'meteor/nova:users';

const CustomLogo = ({logoUrl, siteTitle, currentUser}) => {
  return (
    <div>
      <h1 className="logo-text"><IndexLink to="/">⭐{siteTitle}⭐</IndexLink></h1>
      { currentUser ? <span className="logo-hello">Welcome {Users.getDisplayName(currentUser)} 👋</span> : null}
    </div>
  )
}

Telescope.replaceComponent('Logo', CustomLogo);