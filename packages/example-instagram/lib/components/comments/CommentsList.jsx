/* 

List of comments. 
Wrapped with the "withList" and "withCurrentUser" containers.

All props except currentUser are passed by the withList container. 

*/

import React, { PropTypes, Component } from 'react';
import { Components, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';

import Comments from '../../modules/comments/collection.js';
import CommentsItem from './CommentsItem.jsx';

const CommentsList = ({results = [], currentUser, loading, loadMore, count, totalCount}) => 
  
  <div className="comments-list">

    {loading ? 

      <Loading /> :

      <div className="comments-items">
        {results.map(comment => <CommentsItem key={comment._id} comment={comment} currentUser={currentUser} />)}
      </div>
      
    }

  </div>

const options = {
  collection: Comments,
  fragmentName: 'CommentsItemFragment',
};

export default withList(options)(withCurrentUser(CommentsList));