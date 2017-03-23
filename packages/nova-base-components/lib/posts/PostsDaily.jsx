import { Components, registerComponent, getSetting } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';

const PostsDaily = props => {
  // const terms = props.location && props.location.query;
  const numberOfDays = getSetting('numberOfDays', 5);
  const terms = {
    view: 'top',
    after: moment().subtract(numberOfDays - 1, 'days').format("YYYY-MM-DD"),
    before: moment().format("YYYY-MM-DD"),
  };

  return <Components.PostsDailyList terms={terms}/>
};

PostsDaily.displayName = "PostsDaily";

registerComponent('PostsDaily', PostsDaily);
