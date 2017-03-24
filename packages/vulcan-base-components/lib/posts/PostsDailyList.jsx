import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Posts from 'meteor/vulcan:posts';
import { withCurrentUser, withList, getSetting, Components, getRawComponent, registerComponent } from 'meteor/vulcan:core';

class PostsDailyList extends Component{

  constructor(props) {
    super(props);
    this.loadMoreDays = this.loadMoreDays.bind(this);
    this.state = {
      days: props.days,
      after: props.terms.after,
      daysLoaded: props.days,
      afterLoaded: props.terms.after,
      before: props.terms.before,
      loading: true,
    };
  }

  // intercept prop change and only show more days once data is done loading
  componentWillReceiveProps(nextProps) {
    if (nextProps.networkStatus === 2) {
      this.setState({loading: true});
    } else {
      this.setState((prevState, props) => ({
        loading: false,
        daysLoaded: prevState.days,
        afterLoaded: prevState.after,
      }));
    }
  }

  // return date objects for all the dates in a range
  getDateRange(after, before) {
    const mAfter = moment(after, 'YYYY-MM-DD');
    const mBefore = moment(before, 'YYYY-MM-DD');
    const daysCount = mBefore.diff(mAfter, 'days') + 1;
    const range = _.range(daysCount).map(
      i => moment(before, 'YYYY-MM-DD').subtract(i, 'days').startOf('day')
    );
    return range;
  }

  getDatePosts(posts, date) {
    return _.filter(posts, post => moment(new Date(post.postedAt)).startOf('day').isSame(date, 'day'));
  }

  // variant 1: reload everything each time (works with polling)
  loadMoreDays(e) {
    e.preventDefault();
    const numberOfDays = getSetting('numberOfDays', 5);
    const loadMoreAfter = moment(this.state.after, 'YYYY-MM-DD').subtract(numberOfDays, 'days').format('YYYY-MM-DD');
    
    this.props.loadMore({
      ...this.props.terms,
      after: loadMoreAfter,
    });

    this.setState({
      days: this.state.days + this.props.increment,
      after: loadMoreAfter,
    });
  }

  // variant 2: only load new data (need to disable polling)
  loadMoreDaysInc(e) {
    e.preventDefault();
    const numberOfDays = getSetting('numberOfDays', 5);
    const loadMoreAfter = moment(this.state.after, 'YYYY-MM-DD').subtract(numberOfDays, 'days').format('YYYY-MM-DD');
    const loadMoreBefore = moment(this.state.after, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
    
    this.props.loadMoreInc({
      ...this.props.terms,
      before: loadMoreBefore,
      after: loadMoreAfter,
    });
    
    this.setState({
      days: this.state.days + this.props.increment,
      after: loadMoreAfter,
    });
  }

  render() {
    const posts = this.props.results;
    const dates = this.getDateRange(this.state.afterLoaded, this.state.before);

    return (
      <div className="posts-daily">
        <Components.PostsListHeader />
        {dates.map((date, index) => <Components.PostsDay key={index} number={index} date={date} posts={this.getDatePosts(posts, date)} networkStatus={this.props.networkStatus} currentUser={this.props.currentUser} />)}
        {this.state.loading? <Components.PostsLoading /> : <a className="posts-load-more posts-load-more-days" onClick={this.loadMoreDays}><FormattedMessage id="posts.load_more_days"/></a>}
      </div>
    )
  }
}

PostsDailyList.propTypes = {
  currentUser: React.PropTypes.object,
  days: React.PropTypes.number,
  increment: React.PropTypes.number
};

PostsDailyList.defaultProps = {
  days: getSetting('numberOfDays', 5),
  increment: getSetting('numberOfDays', 5)
};

const options = {
  collection: Posts,
  queryName: 'postsDailyListQuery',
  fragmentName: 'PostsList',
  limit: 0,
};

registerComponent('PostsDailyList', PostsDailyList, withCurrentUser, [withList, options]);