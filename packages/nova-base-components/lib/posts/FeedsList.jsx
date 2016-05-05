import React from 'react';

const FeedsList = ({results, currentUser, ready }) => {

  ({PostsLoading, PostsNoResults} = Telescope.components);

  if (!!results.length) {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          {results.map(feed => <div key={feed._id}>{feed.url}</div>)}
        </div>
      </div>
    )
  } else if (!ready) {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          <PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          <PostsNoResults/>
        </div>
      </div>
    )  
  }
  
};

module.exports = FeedsList;
export default FeedsList;