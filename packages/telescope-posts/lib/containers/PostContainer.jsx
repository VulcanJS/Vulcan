// import React from 'react';

const Post = Telescope.getComponent("Post");

PostContainer = React.createClass({

  // propTypes: {

  // },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    const subscription = Meteor.subscribe('singlePost', this.props._id);

    return {
      post: Posts.findOne(this.props._id)
    };
  },

  render() {
    if (this.data.post) {
      return (
        <Post {...this.data.post} />
      )
    } else {
      return <p>Loading…</p>
    }
  }

});