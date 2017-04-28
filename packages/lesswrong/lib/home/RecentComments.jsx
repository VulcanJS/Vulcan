import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";

class SelectCommentsList extends Component {

  render() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const loading = this.props.loading;

    return (
      <div>
        <div><h5>{this.props.title}</h5></div>
        <div className="comments-list">
          {
            loading ? <Loading /> :
            <div className="comments-items">
              {
                results.map(comment =>
                  <div key={comment._id}>
                    <div>From post:&nbsp;
                      <Link to={Posts.getPageUrl(comment.post)}>
                        {comment.post.title}
                      </Link>
                    </div>
                    <Components.CommentsItem comment={comment} currentUser={currentUser} />
                  </div>
                )
              }
            </div>
          }
        </div>
      </div>
    )
  }

}

const commentsOptions = {
  collection: Comments,
  queryName: 'selectCommentsListQuery',
  fragmentName: 'SelectCommentsList',
  limit: 0,
};

registerComponent('SelectCommentsList', SelectCommentsList, withList(commentsOptions), withCurrentUser);


class RecentComments extends Component {

  render() {
    return (
      <Components.SelectCommentsList title='Recent comments' terms={{view: 'recentComments'}} />
    )
  }

}

registerComponent('RecentComments', RecentComments);
