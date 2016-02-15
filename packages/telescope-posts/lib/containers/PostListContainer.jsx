// import {composeWithTracker} from 'react-komposer';

// const composer = (props, onData) => {
  
//   console.log(props)

//   var terms = props;
//   // const terms = {...props, limit: this.state.limit};
//   const parameters = Posts.parameters.get(terms);
//   const find = parameters.find;
//   const options = parameters.options;
//   // options.limit = this.state.limit;


//   Meteor.subscribe('postList', terms, () => {
//     console.log(find, options)
//     const posts = Posts.find(find, options).fetch();
//     console.log(Posts.find().count())
//     console.log(posts)
//     onData(null, {posts});
//   });

//   // support latency compensation
//   //  we don't need to invalidate tracker because of the
//   //  data fetching from the cache.
//   // const postFromCache = Tracker.nonreactive(() => {
//   //   return Posts.find(find, options);
//   // });

//   // if (postFromCache) {
//   //   onData(null, {post: postFromCache});
//   // } else {
//   //   onData();
//   // }
// };

// PostListContainer = composeWithTracker(composer)(PostList);




// import React from 'react';

// const PostList = Telescope.getComponent("PostList");
console.log("// PostListContainer")
PostListContainer = React.createClass({

  // propTypes: {

  // },

  getInitialState() {

    return {
      limit: 5
    };

  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    const terms = {...this.props, limit: this.state.limit};
    const parameters = Posts.parameters.get(terms);
    const find = parameters.find;
    const options = parameters.options;
    options.limit = this.state.limit;

    // var cursor = Posts.find(find, options);
    // var sm = SmartQuery.create("posts", cursor);
    
    // console.log(terms)

    const subscription = Meteor.subscribe('postList', terms);

    const totalCount = Counts.get("postList");

    const cursor = Posts.find(find, options);
    
    return {
      posts: cursor.fetch(),
      ready: subscription.ready(),
      count: cursor.count(),
      totalCount: totalCount,
      hasMore: cursor.count() < totalCount
    };
  },

  loadMore(event) {
    event.preventDefault();
    this.setState({
      limit: this.state.limit+5
    });
  },

  render() {
    const PostList = Telescope.getComponent("PostList");
    return (
      <PostList {...this.data} loadMore={this.loadMore}/>
    )
  }

});

// export default PostListContainer;