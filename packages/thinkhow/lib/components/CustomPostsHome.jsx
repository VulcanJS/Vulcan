import { Components, registerComponent, getSetting, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import Posts from "meteor/vulcan:posts";
import moment from 'moment';


const CustomPostsHome = props => {
  // const terms = props.location && props.location.query;
  const numberOfDays = getSetting('numberOfDays', 5);
  const terms = {
    view: 'top',
    after: moment().subtract(numberOfDays - 1, 'days').format("YYYY-MM-DD"),
    before: moment().format("YYYY-MM-DD"),
  };

  return <Components.PostsDailyList terms={terms}/>
};


replaceComponent('PostsHome', CustomPostsHome);
