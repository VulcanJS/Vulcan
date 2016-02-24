const CanEditUser = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    userToEdit: React.PropTypes.object
  },

  render() {
    if (Users.can.edit(this.props.user, this.props.userToEdit)) {
      return this.props.children;
    } else if (!this.props.user){
      return <p>Please log in.</p>;
    } else {
      return <p>Sorry, you do not have permissions to edit this user at this time</p>;
    }
  }

});

module.exports = CanEditUser;