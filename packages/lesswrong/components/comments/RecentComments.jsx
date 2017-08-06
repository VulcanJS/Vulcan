import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";

const RecentComments = (props) => {
    const results = props.results;
    const currentUser = props.currentUser;
    const loading = props.loading;
    const fontSize = props.fontSize;

    return (
      <div>
        <Link to="/recentComments" >
          <div><h5>Recent Comments</h5></div>
        </Link>
        <div className="comments-list">
          {loading || !results ? <Loading /> :
            <div className={"comments-items" + (fontSize == "small" ? " smalltext" : "")}>
              {results.map(comment =>
                  <div key={comment._id}>
                    <Components.RecentCommentsItem comment={comment} currentUser={currentUser} />
                  </div>
                )}
            </div>}
        </div>
      </div>)
  }

const commentsOptions = {
  collection: Comments,
  queryName: 'selectCommentsListQuery',
  fragmentName: 'SelectCommentsList',
  totalResolver: false,
};

registerComponent('RecentComments', RecentComments, [withList, commentsOptions], withCurrentUser);
