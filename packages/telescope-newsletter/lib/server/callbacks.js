//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

function removeUserFromList (user) {
  if(!! Users.getSetting(user, "newsletter.subscribeToNewsletter")) {
    removeFromMailChimpList(user);
  }
};

Telescope.callbacks.add("userDeleteAsync", removeUserFromList);

function updateUserOnList (data) {
  oldUser = data.oldUser;
  user = data.newUser;

  if(Users.getEmail(oldUser) != Users.getEmail(user) &&
    Users.getSetting(user, "newsletter.subscribeToNewsletter")) {

    if( Users.getSetting(oldUser, "newsletter.subscribeToNewsletter"))
      removeFromMailChimpList(oldUser);

    addToMailChimpList(user, false);

  } else if (Users.getSetting(oldUser, "newsletter.subscribeToNewsletter") &&
  !Users.getSetting(user, "newsletter.subscribeToNewsletter")) {

    removeFromMailChimpList(oldUser);

  } else if (!Users.getSetting(oldUser, "newsletter.subscribeToNewsletter") &&
  Users.getSetting(user, "newsletter.subscribeToNewsletter")) {

    addToMailChimpList(user, false);

  }
};

Telescope.callbacks.add("userEditAsync", updateUserOnList);

function subscribeUserOnProfileCompletion (user) {
  if (!!Settings.get('autoSubscribe') && !!Users.getEmail(user)) {
    addToMailChimpList(user, false, function (error, result) {
      console.log(error);
      console.log(result);
    });
  }
  return user;
}

Telescope.callbacks.add("profileCompletedAsync", subscribeUserOnProfileCompletion);
