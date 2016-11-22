/* 

Wrapper for the Movies components

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import { Button } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { ModalTrigger, Messages, FlashContainer } from "meteor/nova:core";
import MoviesList from './MoviesList.jsx';

class MoviesWrapper extends Component {
  render() {
    return (
      <div className="wrapper">

        {/*<div style={{maxWidth: "300px"}}>
          <Accounts.ui.LoginForm />
        </div>

        <FlashContainer component={Telescope.components.FlashMessages}/>
        */}
        
        <div className="main">
          <MoviesList />
        </div>

      </div>
    )
  }
}

export default MoviesWrapper;