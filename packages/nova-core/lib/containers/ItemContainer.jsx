// import React from 'react';

const ItemContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    publication: React.PropTypes.string.isRequired,
    terms: React.PropTypes.object,
    joins: React.PropTypes.array
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    // subscribe if necessary
    if (this.props.publication && this.props.terms) {
      const subscription = Meteor.subscribe(this.props.publication, this.props.terms);
    }

    const collection = this.props.collection;
    const document = collection.findOne(this.props.terms);
    
    // look for any specified joins
    if (document && this.props.joins) {

      // loop over each join
      this.props.joins.forEach(join => {

        // get the property containing the id or ids
        const joinProperty = document[join.property];
        const collection = Meteor.isClient ? window[join.collection] : global[join.collection];

        // perform the join
        if (Array.isArray(joinProperty)) { // join property is an array of ids
          document[join.joinAs] = collection.find({_id: {$in: joinProperty}}).fetch();
        } else { // join property is a single id
          document[join.joinAs] = collection.findOne({_id: joinProperty});
        }
          
      });

    }

    return {
      document: document,
      currentUser: Meteor.user()
    };
  },

  render() {

    const Component = this.props.component; // could be Post or PostEdit

    if (this.data.document) {
      return (
        <Component {...this.data} />
      )
    } else {
      return <p>Loading…</p>
    }
  }

});

module.exports = ItemContainer;