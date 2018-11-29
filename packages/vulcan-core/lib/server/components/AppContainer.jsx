import {
  registerComponent,
} from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';

class AppContainer extends PureComponent {
  render() {
    const { children } = this.props
    return (
        children
    )
  }
}

AppContainer.displayName = 'AppContainer';

registerComponent({ name: 'AppContainer', component: AppContainer })

export default AppContainer;
