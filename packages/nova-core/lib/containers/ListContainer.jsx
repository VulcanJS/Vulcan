const ListContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    publication: React.PropTypes.string.isRequired,
    terms: React.PropTypes.object,
    limit: React.PropTypes.number,
    joins: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      limit: 5
    };
  },

  getInitialState() {
    return {
      limit: this.props.limit
    };
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    let terms = {...this.props.terms, limit: this.state.limit};
    let find = {};
    let options = {limit: this.state.limit}; 
    
    if (this.props.collection.parameters) {
      const parameters = this.props.collection.parameters.get(terms);
      find = parameters.find;
      options = parameters.options;
    }
    
    const subscription = Meteor.subscribe(this.props.publication, terms);

    const totalCount = Counts.get(this.props.publication);

    const cursor = this.props.collection.find(find, options);
    let results = cursor.fetch();

    // look for any specified joins
    if (this.props.joins) {

      // loop over each document in the results
      results.map(doc => {

        // loop over each join
        this.props.joins.forEach(join => {

          // get the property containing the id or ids
          const joinProperty = doc[join.property];

          // perform the join
          if (Array.isArray(joinProperty)) { // join property is an array of ids
            doc[join.joinAs] = join.collection.find({_id: {$in: joinProperty}}).fetch();
          } else { // join property is a single id
            doc[join.joinAs] = join.collection.findOne({_id: joinProperty});
          }
            
        });

        // return the updated document
        return doc;

      });
    }
    
    return {
      results: results,
      ready: subscription.ready(),
      count: cursor.count(),
      totalCount: totalCount,
      hasMore: cursor.count() < totalCount
    };
  },

  loadMore(event) {
    event.preventDefault();
    this.setState({
      limit: this.state.limit+this.props.limit
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