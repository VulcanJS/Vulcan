// import React from 'react';

const ItemContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    subscription: React.PropTypes.string.isRequired,
    terms: React.PropTypes.object
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    const subscription = Meteor.subscribe(this.props.subscription, this.props.terms);

    return {
      results: this.props.collection.findOne(this.props.terms)
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