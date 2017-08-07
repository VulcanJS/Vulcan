import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

class PostsDay extends PureComponent {

  render() {
    const {date, posts} = this.props;
    const noPosts = posts.length === 0;

    return (
      <div className="posts-day">
        <h5 className="posts-day-heading">{date.format('dddd, MMMM Do')}</h5>
        { noPosts ? <Components.PostsNoMore /> :
          <div className="posts-list">
            <div className="posts-list-content">
              {posts.map((post, index) => <Components.PostsItem post={post} key={post._id} index={index} currentUser={this.props.currentUser} />)}
            </div>
          </div>
        }
      </div>
    );
  }
}

PostsDay.propTypes = {
  currentUser: PropTypes.object,
  date: PropTypes.object,
  number: PropTypes.number
};

registerComponent('PostsDay', PostsDay);
