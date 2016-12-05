import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import Posts from "meteor/nova:posts";

class PostsDay extends Component {

  render() {

    const {date, number, posts} = this.props;

    return (
      <div className="posts-day">
        <h4 className="posts-day-heading">{date.format("dddd, MMMM Do YYYY")}</h4>
        <div className="posts-list-content">
          {posts.map(post => <Telescope.components.PostsItem post={post} key={post._id} />)}
        </div>
      </div>
    )

  }

}

PostsDay.propTypes = {
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

Telescope.registerComponent('PostsDay', PostsDay);