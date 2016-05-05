import React from 'react';

const FeedsList = ({results, currentUser, ready }) => {

  ({FeedsItem, PostsLoading, PostsNoResults} = Telescope.components);

  if (!!results.length) {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          {results.map(feed => <FeedsItem key={feed._id} feed={feed}/>)}
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