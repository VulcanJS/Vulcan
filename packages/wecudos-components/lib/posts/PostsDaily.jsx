import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

// for a number of days "n" return dates object for the past n days
const getLastNDates = n => {
  return _.range(n).map(
    i => moment().subtract(i, 'days').startOf('day').toDate()
  );
};

class PostsDaily extends Component{
  
  constructor(props) {
    super(props);
    this.loadMoreDays = this.loadMoreDays.bind(this);
    this.state = {days: props.days};
  }

  loadMoreDays(e) {
    e.preventDefault();
    this.setState({
      days: this.state.days + 5
    });
  }

  render() {
    ({PostsDay, PostsListHeader} = Telescope.components);
    return (
      <div className="post-daily">
        <PostsListHeader />
        {getLastNDates(this.state.days).map((date, index) => <PostsDay key={index} date={date} number={index}/>)}
        <button className="post-load-more" onClick={this.loadMoreDays}>Load More Days</button>
      </div>
    )
  }
}

PostsDaily.propTypes = {
  days: React.PropTypes.number
}

PostsDaily.defaultProps = {
  days: 5
}

module.exports = PostsDaily;
export default PostsDaily;
