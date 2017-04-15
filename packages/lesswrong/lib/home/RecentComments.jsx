import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';

class RecentComments extends Component {

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const loading = this.props.loading;

    return (
      <div>
        <div>-= Recent comments =-</div>
        {
          <div className="comments-list">
            {loading ?
              <Loading /> :
              <div className="comments-items">
                {results.map(comment => <Components.CommentsItem key={comment._id} comment={comment} currentUser={currentUser} />)}
              </div>
            }
          </div>
        }
      </div>
    )
  }

}

// ROGTODO: select recent comments, not all comments
const commentsOptions = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragmentName: 'CommentsList',
  limit: 0,
};

registerComponent('RecentComments', RecentComments, withList(commentsOptions), withCurrentUser);
