/* 

Wrapper for the Movies components

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/nova:core';

const MoviesWrapper = () => 
  <div className="wrapper framework-demo" style={{maxWidth: '500px', margin: 'auto'}}>

    <div className="header" style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}}>
      <Components.AccountsLoginForm />
    </div>        
    
    <div className="main">
      <Components.MoviesList />
    </div>

  </div>

registerComponent('MoviesWrapper', MoviesWrapper);
