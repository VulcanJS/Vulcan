import expect from 'expect';
import setupRedux from '../../lib/server/setupRedux.js';
import { getStore } from '../../lib/modules/redux';

describe('vulcan-redux/setupRedux', function() {
  describe('server : redux should init with empty initialState', () => {
    it('default initialisation', function() {
      setupRedux();
      const initialState = getStore().getState();
      expect(initialState).toBeUndefined;
    });
  });
});
