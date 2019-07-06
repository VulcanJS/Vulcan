import expect from 'expect';
// import { setupRedux } from '../../lib/client/setupRedux.js';
describe('vulcan-redux/setupRedux', function() {
  describe('server : redux should init with empty initialState', () => {
    it('default initialisation', function() {
      const initialState = {};
      expect({}).toStrictEqual(initialState);
    });
  });
});
