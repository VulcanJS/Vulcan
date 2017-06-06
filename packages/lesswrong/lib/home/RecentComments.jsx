import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";

class RecentComments extends Component {

  render() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const loading = this.props.loading;
    const fontSize = this.props.fontSize;

    return (
      <div>
        <Link to="/recentComments" >
          <div><h5>Recent Comments</h5></div>
        </Link>
        <div className="comments-list">
          {
            loading ? <Loading /> :
            <div className={"comments-items" + (fontSize == "small" ? " smalltext" : "")}>
              {
                results.map(comment =>
                  <div key={comment._id}>
                    <div>From post:&nbsp;
                      <Link to={Posts.getPageUrl(comment.post)}>
                        {comment.post.title}
                      </Link>
                    </div>
                    <Components.RecentCommentsItem comment={comment} currentUser={currentUser} />
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

registerComponent('RecentComments', RecentComments, withList(commentsOptions), withCurrentUser);
