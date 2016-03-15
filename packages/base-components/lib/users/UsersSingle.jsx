const UsersSingle = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object, // Note: should be required
    currentUser: React.PropTypes.object // Note: should be required
  },

  render() {
  
    const user = this.props.document;

    return (
      <p>Profile for {Users.getDisplayName(user)}</p>
    )
  }
});

module.exports = UsersSingle;