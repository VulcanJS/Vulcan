import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

class PostsDay extends Component {

  render() {

    const {date, posts} = this.props;
    const noPosts = posts.length === 0;

    return (
      <div className="posts-day">
        <h4 className="posts-day-heading">{date.format("dddd, MMMM Do YYYY")}</h4>
        { noPosts ? <Components.PostsNoMore /> :
          <div className="posts-list">
            <div className="posts-list-content">
              {posts.map(post => <Components.PostsItem post={post} key={post._id} currentUser={this.props.currentUser} />)}
            </div>
          </div>
        }
      </div>
    )

  }

}

PostsDay.propTypes = {
  currentUser: React.PropTypes.object,
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

registerComponent('PostsDay', PostsDay);
