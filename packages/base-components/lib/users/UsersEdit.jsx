const UsersEdit = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  render() {
  
    const user = this.props.document;
    const label = `Edit profile for ${Users.getDisplayName(user)}`;

    ({CanEditUser, EditDocContainer} = Telescope.components);

    return (
      <CanEditUser user={this.props.currentUser} userToEdit={user}>
        <EditDocContainer collection={Meteor.users} document={user} label={label} methodName="users.edit"/>
      </CanEditUser>
    )
  }
});

module.exports = UsersEdit;