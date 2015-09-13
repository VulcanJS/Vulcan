//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

function removeUserFromList (user) {

  if (!!user && Users.getSetting(user, 'newsletter.subscribeToNewsletter')){
    var email = Users.getEmail(user);
    var apiKey = Settings.get('mailChimpAPIKey');
    var listId = Settings.get('mailChimpListId');

  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
    if(!!apiKey && !!listId){

      try {
        console.log('// removing "'+email+'" from MailChimp list…');

        var api = new MailChimp(apiKey);
        var subscribeOptions = {
          id: listId,
          email: {"email": email},
        };

        // unsubscribe user
        var subscribe = api.call('lists', 'unsubscribe', subscribeOptions);

        console.log("// User unsubscribed");

        return subscribe;

      } catch (error) {
        throw new Meteor.Error("un-subscribe-failed", error.message);
      }
    }
  }
};

Telescope.callbacks.add("onRemoveUserAsync", removeUserFromList);
