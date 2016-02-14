// import React from 'react';

PostListContainer = React.createClass({

  // propTypes: {

  // },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    var cursor = Posts.find({}, {limit: 10});
    var sm = SmartQuery.create("posts", cursor);
    return {
      posts: sm.cursor.fetch()
    }
    // return {
    //   posts: [
    //     {title: "foo"},
    //     {title: "bar"}
    //   ]
    // };
  },

  render() {
    return (
      <PostList {...this.data}/>
    )
  }

});

// export default PostListContainer;