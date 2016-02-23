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
    publication: React.PropTypes.string, // the publication to subscribe to
    terms: React.PropTypes.object, // an object passed to the publication
    selector: React.PropTypes.object, // the selector used in collection.find()
    options: React.PropTypes.object, // the options used in collection.find()
    limit: React.PropTypes.number, // the limit used to increase pagination
    joins: React.PropTypes.array, // joins to apply to the results
    parentProperty: React.PropTypes.string // if provided, use to generate tree
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

    // initialize data object with current user, and default to data being ready
    let data = {
      currentUser: Meteor.user(),
      ready: true
    };

    // subscribe if needed. Note: always subscribe first, otherwise 
    // it won't work when server-side rendering with FlowRouter SSR
    if (this.props.publication && this.props.terms) {
      let terms = {...this.props.terms, limit: this.state.limit};
      const subscription = Meteor.subscribe(this.props.publication, terms);
      data.ready = subscription.ready();
    }

    const selector = this.props.selector || {};
    const options = {...this.props.options, limit: this.state.limit}; 
    const cursor = this.props.collection.find(selector, options);
    const count = cursor.count();
    // when rendering on the server, we want to get a count without the limit
    const optionsNoLimit = {...this.props.options, limit: 0}; 
    const cursorNoLimit = this.props.collection.find(selector, optionsNoLimit);

    const totalCount = Meteor.isClient ? Counts.get(this.props.publication) : cursorNoLimit.count();

    let results = cursor.fetch(); 

    // look for any specified joins
    if (this.props.joins) {

      // loop over each document in the results
      results.forEach(doc => {

        // loop over each join
        this.props.joins.forEach(join => {

          // get the property containing the id or ids
          const joinProperty = doc[join.property];
          const collection = Meteor.isClient ? window[join.collection] : global[join.collection];

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
    
    // transform list into tree
    if (this.props.parentProperty) {
      results = Telescope.utils.unflatten(results, "_id", this.props.parentProperty);
    }

    data = {
      ...data,
      results: results,
      count: count,
      totalCount: totalCount,
      hasMore: count < totalCount
    };

    return data;
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