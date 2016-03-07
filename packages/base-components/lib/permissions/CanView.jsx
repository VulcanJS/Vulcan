const CanView = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    if (Users.can.view(this.props.user)) {
      return this.props.children;
    } else if (!this.props.user){
      return <p>Please log in.</p>;
    } else {
      return <p>Sorry, you do not have permissions to post at this time</p>;
    }
  }

});

module.exports = CanView;