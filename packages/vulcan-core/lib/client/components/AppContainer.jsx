/**
 * Client specific wrapper, such as the BrowserRouter
 */
import {
  registerComponent,
} from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom'

class AppContainer extends PureComponent {
  render() {
    const { children } = this.props
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    )
  }
}

AppContainer.displayName = 'AppContainer';

registerComponent({ name: 'AppContainer', component: AppContainer })

export default AppContainer;
