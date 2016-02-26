// import React from 'react';

const ItemContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    publication: React.PropTypes.string,
    terms: React.PropTypes.object,
    joins: React.PropTypes.array,
    callback: React.PropTypes.func // a callback function to pass through, for modals (note: use Redux?)
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    // subscribe if necessary
    if (this.props.publication) {
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
      return React.cloneElement(this.props.children, { ...this.data, callback: this.props.callback, collection: this.props.collection });
    } else {
      return <p>Loading…</p>
    }
  }

});

module.exports = ItemContainer;