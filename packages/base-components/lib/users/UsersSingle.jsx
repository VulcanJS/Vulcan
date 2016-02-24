const UsersSingle = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  render() {
  
    const user = this.props.document;

    return (
      <p>Profile for {Users.getDisplayName(user)}</p>
    )
  }
});

module.exports = UsersSingle;