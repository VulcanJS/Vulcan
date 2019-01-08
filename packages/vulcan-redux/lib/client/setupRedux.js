import React from 'react';
import {Provider} from 'react-redux';
import {addCallback} from 'meteor/vulcan:core';
import {initStore} from '../modules/redux';

const setupRedux = () => {
  const store = initStore();
  addCallback('router.client.wrapper', function ReduxStoreProvider(app) {
    return <Provider store={store}>{app}</Provider>;
  });
};
export default setupRedux;
