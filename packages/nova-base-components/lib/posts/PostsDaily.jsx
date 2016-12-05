import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';

const PostsDaily = props => {
  // const terms = props.location && props.location.query;
  const numberOfDays = Telescope.settings.get('numberOfDays', 5);
  const terms = {
    view: 'daily',
    after: moment().subtract(numberOfDays - 1, 'days').format("YYYY-MM-DD"),
    before: moment().format("YYYY-MM-DD"),
  };

  return <Telescope.components.PostsDailyList terms={terms}/>
};

PostsDaily.displayName = "PostsDaily";

Telescope.registerComponent('PostsDaily', PostsDaily);