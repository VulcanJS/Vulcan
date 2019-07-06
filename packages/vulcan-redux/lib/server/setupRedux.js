import React from 'react';
import { Provider } from 'react-redux';
import { addCallback } from 'meteor/vulcan:core';
import { initStore } from '../modules/redux';

const setupRedux = initialState => {
  console.log('DEBUG server initialState', initialState);
  const store = initStore(initialState);
  addCallback('router.server.wrapper', function ReduxStoreProvider(app) {
    return <Provider store={store}>{app}</Provider>;
  });
};
export default setupRedux;
