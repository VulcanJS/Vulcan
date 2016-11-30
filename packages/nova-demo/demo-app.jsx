/* global Movies:true */

import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import React, { PropTypes, Component } from 'react';
import MoviesWrapper from './demo-components.jsx';
// import {mount} from 'react-mounter';
// import Core from 'meteor/nova:core';
// import { Route } from 'react-router';

//////////////////////////////////////////////////////
// Collection & Schema                              //
//////////////////////////////////////////////////////

Movies = new Mongo.Collection("movies");

const isLoggedIn = user => !!user;
const isOwner = (user, document) => user._id === document.userId;

const schema = new SimpleSchema({
  name: {
    type: String,
    publish: true,
    control: "text",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  createdAt: {
    type: Date,
    publish: true,
  },
  year: {
    type: String,
    publish: true,
    optional: true,
    control: "text",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  review: {
    type: String,
    publish: true,
    control: "textarea",
    insertableIf: isLoggedIn,
    editableIf: isOwner
  },
  userId: {
    type: String,
    publish: true,
    join: {
      collection: () => Users,
      joinAs: "user",
      fields: ["_id", "username"]
    }
  }
});

Movies.attachSchema(schema);

//////////////////////////////////////////////////////
// Route                                            //
//////////////////////////////////////////////////////

// Telescope.routes.add(<Route name="demo" path="/demo" component={MoviesWrapper} />);
Telescope.routes.add({name:"demo", path:"/demo", component:MoviesWrapper});

//////////////////////////////////////////////////////
// Methods                                          //
//////////////////////////////////////////////////////

Movies.smartMethods({
  createName: "movies.create",
  editName: "movies.edit",
  createCallback: function (user, document) {
    document = _.extend(document, {
      createdAt: new Date(),
      userId: Meteor.userId()
    });
    return document;
  },
  deleteCallback: isOwner
});

//////////////////////////////////////////////////////
// Publications                                     //
//////////////////////////////////////////////////////

if (Meteor.isServer) {
  Movies.smartPublish("movies.list");
}
