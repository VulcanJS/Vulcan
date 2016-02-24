const CanViewPost = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    post: React.PropTypes.object
  },

  render() {
    if (Users.can.viewPost(this.props.user, this.props.document)) {
      return this.props.children;
    } else if (!this.props.user){
      return <p>Please log in.</p>;
    } else {
      return <p>Sorry, you do not have permissions to post at this time</p>;
    }
  }

});

module.exports = CanViewPost;