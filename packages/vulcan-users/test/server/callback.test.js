import { usersMakeAdmin } from '../../lib/server/callbacks';
import Users from '../../lib/modules/collection';
import StubCollections from 'meteor/hwillson:stub-collections';
import expect from 'expect';

describe('vulcan:users/callbacks', function () {
  beforeEach(function () {
    StubCollections.stub(Users);
  });
  afterEach(function () {
    StubCollections.restore();
  });
  describe('usersMakeAdmin', function () {
    it('makes the first user an admin', function () {
      const user = usersMakeAdmin({ email: 'foo@bar.bar', password: 'password' });
      expect(user.isAdmin).toBe(true);
    });
    it('ignores dummy users', function () {
      const user = usersMakeAdmin({ isDummy: true, email: 'foo@bar.bar', password: 'password' });
      expect(user.isAdmin).toBe(false);
    });
    it('does not make 2nd user admin', function () {
      const user1 = usersMakeAdmin({ email: '11@11.fr', password: 'password' });
      Users.insert(user1);
      const user2 = usersMakeAdmin({ email: '22@22.fr', password: 'password' });
      expect(user1.isAdmin).toBe(true);
      expect(user2.isAdmin).toBe(false);
    });
    it('does not override isAdmin prop if passed', function () {
      const userNonAdmin = usersMakeAdmin({ isAdmin: false, email: 'foo@bar.bar', password: 'password' });
      expect(userNonAdmin.isAdmin).toBe(false);
      const userAdmin = usersMakeAdmin({ isAdmin: true, email: 'foo@bar.bar', password: 'password' });
      expect(userAdmin.isAdmin).toBe(true);
    });
  });
});