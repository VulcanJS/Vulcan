const UsersEdit = ({document, currentUser}) => {

  const user = document;
  const label = `Edit profile for ${Users.getDisplayName(user)}`;

  ({CanEditUser, EditDocContainer} = Telescope.components);

  return (
    <CanEditUser user={currentUser} userToEdit={user}>
      <EditDocContainer collection={Meteor.users} document={user} label={label} methodName="users.edit"/>
    </CanEditUser>
  )
}
  
UsersEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UsersEdit;