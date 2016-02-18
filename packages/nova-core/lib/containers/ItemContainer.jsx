// import React from 'react';

const ItemContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    publication: React.PropTypes.string.isRequired,
    terms: React.PropTypes.object
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    const subscription = Meteor.subscribe(this.props.publication, this.props.terms);
    const collection = this.props.collection;

    return {
      results: collection.findOne(this.props.terms)
    };
  },

  render() {

    const Component = this.props.component; // could be Post or PostEdit

    if (this.data.results) {
      return (
        <Component {...this.data.results} />
      )
    } else {
      return <p>Loading…</p>
    }
  }

});

module.exports = ItemContainer;