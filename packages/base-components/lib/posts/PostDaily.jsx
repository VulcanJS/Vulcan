import React, { PropTypes, Component } from 'react';

// for a number of days "n" return dates object for the past n days
const getLastNDates = n => {
  return _.range(n).map(
    i => moment().subtract(i, 'days').startOf('day').toDate()
  );
};

class PostDaily extends Component{
  
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
    ({PostDay} = Telescope.components);
    return (
      <div className="post-daily">
        {getLastNDates(this.state.days).map((date, index) => <PostDay key={index} date={date} number={index}/>)}
        <a href="#" className="button button--primary" onClick={this.loadMoreDays}>Load More Days</a>
      </div>
    )
  }
}

PostDaily.propTypes = {
  days: React.PropTypes.number
}

PostDaily.defaultProps = {
  days: 5
}

module.exports = PostDaily;
export default PostDaily;
