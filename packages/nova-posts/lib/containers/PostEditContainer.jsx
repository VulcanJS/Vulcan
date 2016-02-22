// import React from 'react';

const PostEditContainer = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    return {
      categories: Categories.find().fetch(),
      // postUrl: Session.get("postUrl"),
      currentUser: Meteor.user()
    };
  },

  render() {
    ({PostEdit} = Telescope.components);
    return <PostEdit post={this.props} {...this.data} />;
  }

});

module.exports = PostEditContainer;