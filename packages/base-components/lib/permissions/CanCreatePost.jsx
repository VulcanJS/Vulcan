const CanCreatePost = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    if (!this.props.user){
      return <p>Please log in.</p>;
    } else if (Users.can.post(this.props.user)) {
      return this.props.children;
    } else {
      return <p>Sorry, you do not have permissions to post at this time</p>;
    }
  }

});

module.exports = CanCreatePost;