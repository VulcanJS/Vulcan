import React, { PropTypes, Component } from 'react';

class FeedsItem extends Component {

  constructor(props) {
    super(props);
    this.removeFeed = this.removeFeed.bind(this);
  }

  renderCategories() {

    ({PostsCategories} = Telescope.components);

    return this.props.feed.categoriesArray ? <PostsCategories post={this.props.feed} /> : "";
  }

  renderActions() {
    return (
      <div className="post-actions">
        <a onClick={this.removeFeed}>Remove this feed</a>
      </div>
    )
  }

  removeFeed() {
    Meteor.call('feeds.remove', this.props.feed._id);
  }
  
  render() {

    const feed = this.props.feed;

    return (
      <div className="posts-item">
        <div className="posts-item-content">
          
          <h3 className="posts-item-title">
            <a className="posts-item-title-link" href={feed.url}>{feed.title ? feed.title : "Feed not fetched yet"}</a>
            {this.renderCategories()}
          </h3>

          <div className="feeds-item-link"><a href={feed.url}>{feed.url}</a></div>

          <div className="posts-item-meta">
            {feed.user? <div className="posts-item-user"><UsersAvatar user={feed.user} size="small"/><UsersName user={feed.user}/></div> : null}
            {this.renderActions()}
          </div>

        </div>
      
      </div>
    )
  }
}
  
FeedsItem.propTypes = {
  feed: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
};

FeedsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = FeedsItem;
export default FeedsItem;