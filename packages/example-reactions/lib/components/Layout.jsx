/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React from 'react';
import Helmet from 'react-helmet';
import { Components, replaceComponent, registerComponent } from 'meteor/vulcan:core';
import { Link } from 'react-router';

const Layout = ({children, currentUser}) => 
  
  <div style={{maxWidth: '500px', margin: '20px auto'}}>

    <Components.FlashMessages />

    <Helmet>
      <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
    </Helmet>

    {/* user accounts */}

    <div style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}}>
    
      <Components.AccountsLoginForm />
    
    </div>

    {/* nav */}

    <div style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}}>
    
      <ul>
        <li><Link to="/">All Movies</Link></li>
        <li><Link to="/my-reactions">My Reactions</Link></li>
        <li><Link to="/my-reactions2">My Reactions (variant)</Link></li>
      </ul>

    </div>

    {children}

  </div>

replaceComponent('Layout', Layout);
