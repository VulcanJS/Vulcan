const CurrentUserContainer = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    return {
      currentUser: Meteor.user()
    };
  },

  render() {
    return React.cloneElement(this.props.children, { currentUser: this.data.currentUser });
  }

});

module.exports = CurrentUserContainer;
export default CurrentUserContainer;