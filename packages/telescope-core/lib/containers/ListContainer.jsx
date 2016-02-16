const ListContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    subscription: React.PropTypes.string.isRequired,
    terms: React.PropTypes.object
  },

  getInitialState() {

    return {
      limit: 5
    };

  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    const terms = {...this.props.terms, limit: this.state.limit};
    const parameters = Posts.parameters.get(terms);
    const find = parameters.find;
    const options = parameters.options;
    options.limit = this.state.limit;

    const subscription = Meteor.subscribe(this.props.subscription, terms);

    const totalCount = Counts.get(this.props.subscription);

    const cursor = this.props.collection.find(find, options);
    
    return {
      results: cursor.fetch(),
      ready: subscription.ready(),
      count: cursor.count(),
      totalCount: totalCount,
      hasMore: cursor.count() < totalCount
    };
  },

  loadMore(event) {
    event.preventDefault();
    this.setState({
      limit: this.state.limit+5
    });
  },

  render() {
    const Component = this.props.component;
    return (
      <Component {...this.data} loadMore={this.loadMore}/>
    )
  }

});

// export default PostListContainer;

module.exports = ListContainer;