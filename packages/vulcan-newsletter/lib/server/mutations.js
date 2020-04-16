import Users from 'meteor/vulcan:users';
import { addGraphQLMutation, addGraphQLResolvers, Connectors } from 'meteor/vulcan:core';
import { subscribeUser, subscribeEmail, send, unsubscribeUser } from './newsletters';

export const sendNewsletter = async (root, { newsletterId }, context) => {
  if (Users.isAdmin(context.currentUser)) {
    const foo = await send({ newsletterId });
    console.log(foo);
    return foo;
  } else {
    throw new Error({ id: 'app.noPermission' });
  }
};

export const testNewsletter = async (root, { newsletterId }, context) => {
  if (Users.isAdmin(context.currentUser)) {
    const foo = await send({ newsletterId, isTest: true });
    console.log('// foo');
    console.log(foo);
    return foo;
  } else {
    throw new Error({ id: 'app.noPermission' });
  }
};

export const addUserNewsletter = async (root, { userId }, context) => {
  const currentUser = context.currentUser;
  const user = await Connectors.get(Users, userId);
  if (!user || !Users.options.mutations.edit.check(currentUser, user, context)) {
    throw new Error({ id: 'app.noPermission' });
  }
  return await subscribeUser(user, false);
};

export const addEmailNewsletter = async (root, { email }, context) => {
  return await subscribeEmail(email, true);
};

export const removeUserNewsletter = async (root, { userId }, context) => {
  const currentUser = context.currentUser;
  const user = await Connectors.get(Users, userId);
  if (!user || !Users.options.mutations.edit.check(currentUser, user, context)) {
    throw new Error({ id: 'app.noPermission' });
  }

  try {
    return await unsubscribeUser(user);
  } catch (error) {
    const errorMessage = error.message.includes('subscription-failed') ? { id: 'newsletter.subscription_failed' } : error.message;
    throw new Error(errorMessage);
  }
};

export const addNewsletterMutations = () => {
  addGraphQLMutation('sendNewsletter(newsletterId: String) : Newsletter');
  addGraphQLMutation('testNewsletter(newsletterId: String) : Newsletter');
  addGraphQLMutation('addUserNewsletter(userId: String) : JSON');
  addGraphQLMutation('addEmailNewsletter(email: String) : JSON');
  addGraphQLMutation('removeUserNewsletter(userId: String) : JSON');

  const resolver = {
    Mutation: {
      sendNewsletter,
      testNewsletter,
      addUserNewsletter,
      addEmailNewsletter,
      removeUserNewsletter,
    },
  };

  addGraphQLResolvers(resolver);
};
