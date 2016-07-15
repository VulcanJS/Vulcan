import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';

class PostsDaily extends Component{
  
  constructor(props) {
    super(props);
    this.loadMoreDays = this.loadMoreDays.bind(this);
    this.state = {days: props.days};
  }

  // for a number of days "n" return dates object for the past n days
  getLastNDates(n) {
    return _.range(n).map(
      i => moment().subtract(i, 'days').startOf('day').toDate()
    );
  }

  loadMoreDays(e) {
    e.preventDefault();
    this.setState({
      days: this.state.days + this.props.increment
    });
  }

  render() {
    return (
      <div className="posts-daily">
        <Telescope.components.PostsListHeader />
        {this.getLastNDates(this.state.days).map((date, index) => <Telescope.components.PostsDay key={index} date={date} number={index}/>)}
        <button className="posts-load-more" onClick={this.loadMoreDays}>Load More Days</button>
      </div>
    )
  }
}

PostsDaily.propTypes = {
  days: React.PropTypes.number,
  increment: React.PropTypes.number
}

PostsDaily.defaultProps = {
  days: 5,
  increment: 5
}

module.exports = PostsDaily;
export default PostsDaily;
