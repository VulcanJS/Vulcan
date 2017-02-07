import Users from 'meteor/nova:users';

Users.isSubscribedTo = (user, document) => {
  // return user && document && document.subscribers && document.subscribers.indexOf(user._id) !== -1;
  if (!user || !document) {
    // should return an error
    return false;
  }
  
  const { __typename, _id: itemId } = document;
  const documentType = __typename + 's';
  
  if (user.subscribedItems && user.subscribedItems[documentType]) {
    return !!user.subscribedItems[documentType].find(subscribedItems => subscribedItems.itemId === itemId);
  } else {
    return false;
  }
};
