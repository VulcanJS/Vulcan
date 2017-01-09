import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Posts from 'meteor/nova:posts';
import { withList, getSetting, Components, getRawComponent, registerComponent } from 'meteor/nova:core';

class PostsDailyList extends Component{

  constructor(props) {
    super(props);
    this.loadMoreDays = this.loadMoreDays.bind(this);
    this.state = {
      days: props.days,
      after: props.terms.after,
      before: props.terms.before,
    };
  }

  // for a number of days "n" return dates object for the past n days
  getLastNDates(n) {
    return _.range(n).map(
      i => moment().subtract(i, 'days').startOf('day')
    );
  }

  loadMoreDays(e) {
    e.preventDefault();
    const numberOfDays = getSetting('numberOfDays', 5);
    
    /*
    note: loadMoreBefore is used when doing incremental loading, 
    but we're not doing that anymore so we only need to change 'after'
    */
    
    // const loadMoreBefore = moment(this.state.after, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
    const loadMoreAfter = moment(this.state.after, 'YYYY-MM-DD').subtract(numberOfDays, 'days').format('YYYY-MM-DD');
    this.props.loadMore({
      ...this.props.terms,
      // before: loadMoreBefore,
      after: loadMoreAfter,
    });
    this.setState({
      days: this.state.days + this.props.increment,
      after: loadMoreAfter,
    });
  }

  render() {
    const posts = this.props.results;

    const postsByDates = this.getLastNDates(this.state.days).map(date => {
      return {
        date, 
        posts: _.filter(posts, post => {
          // console.log(post)
          // console.log(moment(post.postedAt).startOf('day'))
          // console.log(date)
          return moment(new Date(post.postedAt)).startOf('day').isSame(date, 'day')
        })
      }
    });

    return (
      <div className="posts-daily">
        <Components.PostsListHeader />
        {postsByDates.map((day, index) => <Components.PostsDay key={index} number={index} {...day} loading={true} />)}
        <a className="posts-load-more-days" onClick={this.loadMoreDays}><FormattedMessage id="posts.load_more_days"/></a>
      </div>
    )
  }
}

PostsDailyList.propTypes = {
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
  fragment: getRawComponent('PostsList').fragment,
  limit: 0,
};

registerComponent('PostsDailyList', PostsDailyList, withList(options));