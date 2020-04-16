import expect from 'expect';
import Users from '../../lib/modules/collection';
import StubCollections from 'meteor/hwillson:stub-collections';

const test = it;

const { create: createUser } = Users.options.mutations;

//const fooUser = { _id: 'foobar' };
/*
const context = {
    // TODO: move this into vulcan:tests
    Users: {
        findOne: () => fooUser,
        remove: () => 1,
        options: {
            collectionName: 'Users',
            typeName: 'User'
        },
        simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } }),
        restrictViewableFields: (currentUser, collection, doc) => doc
    },
    currentUser: {
        isAdmin: true,
        groups: ['admins']
    }
};
*/
describe('vulcan:users/mutations', () => {
  beforeEach(function() {
    StubCollections.stub(Users);
  });
  afterEach(function() {
    StubCollections.restore();
  });

  describe('create user', () => {
    const context = {
      Users,
      currentUser: { isAdmin: true },
    };
    test('respect email if provided', async () => {
      const email = 'foobar@foo.com';
      const user = { email };
      const { data: userDocument } = await createUser.mutation(null, { data: user }, context);
      expect(userDocument.email).toEqual(email);
    });
    test('add email to emails array (for Meteor legacy compatibility)', async () => {
      const email = 'foobar@foo.com';
      const user = { email };
      const { data: userDocument } = await createUser.mutation(null, { data: user }, context);
      expect(userDocument.emails).toBeDefined();
      expect(userDocument.emails[0]).toEqual({ address: email });
    });
  });
  describe('auth process', () => {
    test.skip('sign up user', () => {
      const query = `
            mutation signup($input: SignupInput) {signup(input:$input) {userId}}
            `;
      const variables = {
        input: {
          email: 'test@test.test',
          password: 'testtest',
        },
      };
      // Manual test: OK
      // TODO: test the mutation, should return the new userId
    });
    test.skip('authenticate with password', () => {
      const query = `
            mutation auth($input: AuthPasswordInput) {authenticateWithPassword(input:$input){token
userId}}
            `;
      const variables = {
        input: {
          email: 'test@test.test',
          password: 'testtest',
        },
      };
      // Manual test: OK
      // TODO: test the mutation, should return userId and token
      // token needs to be passed as a cookie for further requests
      // In GraphQL Playground headers: {"Authorization": "XXX" } // Cookie seems to have no effect, otherwise the value would be {"Cookie":"meteor_login_token=XXX"}
    });
    test.skip('logout', () => {
      const query = `mutation logout { logout { userId }}`;
      // Manual test: OK
      // TODO: test the mutation
    });
    test.skip('set password', () => {
      const query = `
            mutation setPassword($input: SetPasswordInput) {setPassword(input: $input){token
userId}}
            `;
      const variables = { input: { newPassword: 'foobar' } };
      // Manual test: OK
      // TODO: test the mutation. Should set the user own password, and return a new auth token (previous token is invalid now)
    });
    test.skip('sendResetPasswordEmail', () => {
      const query = `
            mutation sendResetPWEMail($input: AuthEmailInput) { sendResetPasswordEmail(input: $input) }
            `;
      const variables = {
        input: { email: 'test@test.test' },
      };
      // TODO: test the mutation. It will trigger an email that returns a token.
      // This token may be used in the reset password mutation
    });
    test.skip('resetPassword', () => {
      const query = `
            mutation resetPassword ($input:ResetPasswordInput) {resetPassword(input: $input) {userId}}
            `;
      // If the email is:
      // I20200416-18:49:58.433(2)? To reset your password, simply click the link below.
      // I20200416-18:49:58.433(2)?
      // I20200416-18:49:58.433(2)? http://localhost:3000/reset-password/X_xBD5todL-3Yca_yuM0veej_2dqZqN91--tcb=
      // I20200416-18:49:58.433(2)? bel6C
      // I20200416-18:49:58.433(2)?
      //
      // The reset pw token is (remove the = symbol! and concatenate 2 lines)
      // X_xBD5todL-3Yca_yuM0veej_2dqZqN91--tcbbel6C
      const variables = { input: { token: 'X_xBD5todL-3Yca_yuM0veej_2dqZqN91--tcbbel6C', newPassword: 'helloworld' } };
    });
    test.skip('send verification email', () => {
      const query = `
            mutation sendVerifEmail($input: AuthEmailInput ){sendVerificationEmail(input:$input)}`;
      const variables = { input: { email: 'test@test.test' } };
      // TODO: test the mutation, should send an email with a verification token
      // YeG89-Ln14_Sew0dwSkl_QiWn7D9HOzOAhdKAnkqUJW
    });
    test.skip('verify email', () => {
      const query = ``;
      const variables = {};
      // TODO: test the mutation
    });
  });
});
