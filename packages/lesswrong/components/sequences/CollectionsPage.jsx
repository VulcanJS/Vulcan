import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
import Collections from '../../lib/collections/collections/collection.js';
import FlatButton from 'material-ui/FlatButton';

const CollectionsPage = ({document, currentUser, loading, error}) => {

  const startedReading = false; //TODO: Check whether user has started reading sequences
  const collection = document;
  if (document && !loading) {
  return (<div className="collections-page">
    <Components.Section>
      <div className="collections-header">
        <h1 className="collections-title">{collection.title}</h1>
        <div className="collections-description">{collection.summary}</div>
        <FlatButton backgroundColor="rgba(0,0,0,0.05)" label={startedReading ? "Continue Reading" : "Start Reading"} />
      </div>
    </Components.Section>
    <div className="collections-page-content">
      {/* For each book, print a section with a grid of sequences */}
      {collection.books.map(book => {
        return (<Components.Section title={book.title}
          titleComponent={<div className="book-subtitle">{book.subtitle}</div>} className="book-title">
          <div className="book-description">{book.summary}</div>
          {/* A grid of sequences in this book */}
          <Components.SequencesGrid sequences={book.sequences} className="book-sequences-grid-list" />
        </Components.Section>);
      })}
    </div>
    </div>);
  } else if (loading) {
    return (<div className='collections-page'>
      <div className="collections-page-content">
        <Components.PostsLoading/>
      </div>
    </div>);
  } else {
    // TODO: Replace with CollectionsNoResults
    return (<div  className='collections-page'>
      {error ? <Error error={error} /> : null }
      <div className="collections-page-content">
        <Components.PostsNoResults/>
      </div>
    </div>);
  }
};

const options = {
  collection: Collections,
  fragmentName: 'CollectionsPageFragment'
};

registerComponent('CollectionsPage', CollectionsPage, withDocument(options));
