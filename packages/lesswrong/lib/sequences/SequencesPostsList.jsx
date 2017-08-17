import React, { PropTypes, Component } from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

const SequencesPostsList = ({posts, currentUser}) =>

  <div className="sequences-posts-list">
    {posts.map((post) => <Components.PostsItem key={post._id} post={post} />)}
  </div>

registerComponent('SequencesPostsList', SequencesPostsList)
