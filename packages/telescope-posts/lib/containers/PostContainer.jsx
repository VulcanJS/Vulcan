// import React from 'react';

const PostContainer = React.createClass({

  // propTypes: {

  // },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    const subscription = Meteor.subscribe('posts.single', this.props._id);

    return {
      post: Posts.findOne(this.props._id)
    };
  },

  render() {

    const PostComponent = Telescope.getComponent(this.props.component); // could be Post or PostEdit

    if (this.data.post) {
      return (
        <PostComponent {...this.data.post} />
      )
    } else {
      return <p>Loading…</p>
    }
  }

});

module.exports = PostContainer;