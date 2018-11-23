export const getUserObject = currentUser => ({
  id: currentUser._id,
  username: currentUser.displayName,
  email: currentUser.email,
});