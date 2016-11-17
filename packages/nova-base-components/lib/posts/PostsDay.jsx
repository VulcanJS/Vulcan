import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import Posts from "meteor/nova:posts";

class PostsDay extends Component {

  render() {

    const {date, number} = this.props;

    const terms = {
      view: "top",
      date: date,
      after: moment(date).format("YYYY-MM-DD"),
      before: moment(date).format("YYYY-MM-DD"),
      enableCache: number <= 15 ? true : false, // only cache first 15 days
      listId: `posts.list.${moment(date).format("YYYY-MM-DD")}`
    };

    ({selector, options} = Posts.parameters.get(terms));

    const postsPerPage = Telescope.settings.get("postsPerPage", 10);

    return (
      <div className="posts-day">
        <h4 className="posts-day-heading">{moment(date).format("dddd, MMMM Do YYYY")}</h4>
        <Telescope.components.PostsListContainer terms={terms} />
      </div>
    )

  }

}

PostsDay.propTypes = {
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

Telescope.registerComponent('PostsDay', PostsDay);