import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {registerComponent} from 'meteor/vulcan:lib';

// Scroll restoration based on https://reacttraining.com/react-router/web/guides/scroll-restoration.
export default class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

registerComponent('ScrollToTop', ScrollToTop, withRouter);
