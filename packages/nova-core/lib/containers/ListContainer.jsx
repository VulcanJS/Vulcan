/*
Example code:

<ListContainer 
  collection={Posts} 
  publication="posts.list" 
  terms={queryParams} 
  component={PostList}
  joins={[
    {
      property: "categories",
      joinAs: "categoriesArray",
      collection: "Categories"
    },
    {
      property: "userId",
      joinAs: "user",
      collection: "Users"
    }
  ]}
/>

Note that the joins are client-side only, and expect you to
make the relevant data available separately. 

*/

const ListContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired, // the collection to paginate
    component: React.PropTypes.func.isRequired, // the component results will be passed to
    publication: React.PropTypes.string.isRequired, // the publication to subscribe to
    terms: React.PropTypes.object, // an object passed to the publication
    selector: React.PropTypes.object, // the selector used in collection.find()
    options: React.PropTypes.object, // the options used in collection.find()
    limit: React.PropTypes.number, // the limit used to increase pagination
    joins: React.PropTypes.array // joins to apply to the results
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
    let selector = this.props.selector;
    let options = {...this.props.options, limit: this.state.limit}; 
    
    const subscription = Meteor.subscribe(this.props.publication, terms);

    const totalCount = Counts.get(this.props.publication);

    const cursor = this.props.collection.find(selector, options);
    let results = cursor.fetch();

    // look for any specified joins
    if (this.props.joins) {

      // loop over each document in the results
      results.map(doc => {

        // loop over each join
        this.props.joins.forEach(join => {

          // get the property containing the id or ids
          const joinProperty = doc[join.property];
          const collection = window[join.collection];

          // perform the join
          if (Array.isArray(joinProperty)) { // join property is an array of ids
            doc[join.joinAs] = collection.find({_id: {$in: joinProperty}}).fetch();
          } else { // join property is a single id
            doc[join.joinAs] = collection.findOne({_id: joinProperty});
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
      hasMore: cursor.count() < totalCount,
      currentUser: Meteor.user()
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