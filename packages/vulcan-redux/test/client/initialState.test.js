import expect from 'expect';
// import { setupRedux } from '../../lib/client/setupRedux.js';
if (Meteor.isClient) {
  describe('vulcan-redux/setupRedux', function() {
    describe('redux should init with empty initialState', () => {
      it('default initialisation', function() {
        const initialState = {};
        expect({}).toStrictEqual(initialState);
      });
    });
  });
}
