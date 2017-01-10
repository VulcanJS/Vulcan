import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';

class PostsDay extends Component {

  render() {

    const {date, posts, networkStatus} = this.props;

    const noPosts = posts.length === 0;
    const loading = noPosts && networkStatus === 2;

    return (
      <div className="posts-day">
        <h4 className="posts-day-heading">{date.format("dddd, MMMM Do YYYY")}</h4>
        {loading ? <Components.PostsLoading/> :
          noPosts ? <Components.PostsNoMore /> :
            <div className="posts-list">
              <div className="posts-list-content">
                {posts.map(post => <Components.PostsItem post={post} key={post._id} />)}
              </div>
            </div>
        }
      </div>
    )

  }

}

PostsDay.propTypes = {
  date: React.PropTypes.object,
  number: React.PropTypes.number
}

registerComponent('PostsDay', PostsDay);
