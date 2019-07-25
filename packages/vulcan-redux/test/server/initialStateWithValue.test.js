import expect from 'expect';
import setupRedux from '../../lib/server/setupRedux.js';
import { getStore, addReducer } from '../../lib/modules/redux';

describe('vulcan-redux/setupRedux', function() {
  describe('server : redux should init with initialState', () => {
    it('initial value', function() {
      addReducer({
        stage: (state = 0, action) => {
          return state;
        },
      });
      setupRedux({ stage: 1 });
      const initialState = getStore().getState();
      expect(initialState).toMatchObject({ stage: 1 });
    });
  });
});
