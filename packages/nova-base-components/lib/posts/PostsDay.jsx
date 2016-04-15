import React, { PropTypes, Component } from 'react';

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const PostsDay = ({date, number}) => {

  ({PostsList} = Telescope.components);

  const terms = {
    view: "top",
    date: date,
    after: moment(date).format("YYYY-MM-DD"),
    before: moment(date).format("YYYY-MM-DD"),
    enableCache: number <= 15 ? true : false // only cache first 15 days
  };

  ({selector, options} = Posts.parameters.get(terms));

  return (
    <div className="post-day">
      <h4>{moment(date).format("dddd, MMMM Do YYYY")}</h4>
      <ListContainer 
        collection={Posts} 
        publication="posts.list"
        selector={selector}
        options={options}
        terms={terms} 
        joins={Posts.getJoins()}
        component={PostsList}
        componentProps={{showHeader: false}}
      />
    </div>
  )
}

PostsDay.propTypes = {
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

module.exports = PostsDay;
export default PostsDay;