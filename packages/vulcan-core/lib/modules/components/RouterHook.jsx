import React, { PureComponent } from 'react';
import { registerComponent, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:lib';
import { withApollo } from 'react-apollo';

class RouterHook extends PureComponent {
  constructor(props) {
    super(props);
    this.runOnUpdateCallback(props);
  }

  componentDidUpdate(nextProps) {
    this.runOnUpdateCallback(this.props, nextProps);
  }

  runOnUpdateCallback = (props, nextProps = {}) => {
    const { currentRoute, client } = props;
    // the first argument is an item to iterate on, needed by vulcan:lib/callbacks
    // note: this item is not used in this specific callback: router.onUpdate
    runCallbacks('router.onUpdate', {}, currentRoute, client.store, client);

    runCallbacksAsync('router.onUpdate.async', props, nextProps);
  };

  render() {
    return null;
  }
}
registerComponent('RouterHook', RouterHook, withApollo);
