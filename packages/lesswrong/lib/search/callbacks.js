import { addCallback, newMutation, editMutation, Utils } from 'meteor/vulcan:core';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import Users from 'meteor/vulcan:users';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import Sequences from '../collections/sequences/collection.js';
import { algoliaDocumentExport } from './utils.js';

function newCommentAlgoliaIndex(comment) {
  algoliaDocumentExport([comment], Comments, 'test_comments', Comments.toAlgolia, (comment) => Comments.update(comment._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Indexed new comment into Algolia: ", comment);
}
addCallback("comments.new.async", newCommentAlgoliaIndex)

function editCommentAlgoliaIndex(comment) {
  algoliaDocumentExport([comment], Comments, 'test_comments', Comments.toAlgolia, (comment) => Comments.update(comment._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Updated Algolia index for edited comment", comment);
}
addCallback("comments.edit.async", editCommentAlgoliaIndex)

function newPostAlgoliaIndex(post) {
  algoliaDocumentExport([post], Posts, 'test_posts', Posts.toAlgolia, (post) => Posts.update(post._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Indexed new post into Algolia: ", post);
}
addCallback("posts.new.async", newPostAlgoliaIndex)

function editPostAlgoliaIndex(post) {
  algoliaDocumentExport([post], Posts, 'test_posts', Posts.toAlgolia, (post) => Posts.update(post._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Updated Algolia index for edited post ", post);
}
addCallback("posts.edit.async", editPostAlgoliaIndex)

function newUserAlgoliaIndex(user) {
  algoliaDocumentExport([user], Users, 'test_users', Users.toAlgolia, (user) => Users.update(user._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Indexed new user into Algolia: ", user);
}
addCallback("users.new.async", newUserAlgoliaIndex)

function editUserAlgoliaIndex(user) {
  algoliaDocumentExport([user], Users, 'test_users', Users.toAlgolia, (user) => Users.update(user._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Updated Algolia index for edited user ", user);
}
addCallback("users.edit.async", editUserAlgoliaIndex)

function newSequenceAlgoliaIndex(sequence) {
  algoliaDocumentExport([sequence], Sequences, 'test_sequences', Sequences.toAlgolia, (sequence) => Sequences.update(sequence._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Indexed new sequence into Algolia ", sequence);
}
addCallback("sequences.new.async", newSequenceAlgoliaIndex)

function editSequenceAlgoliaIndex(sequence) {
  algoliaDocumentExport([sequence], Sequences, 'test_sequences', Sequences.toAlgolia, (sequence) => Sequences.update(sequence._id, {$set: {algoliaIndexAt: new Date()}}))
  console.log("Updated Algolia index for edited sequence ", sequence);
}
addCallback("sequences.edit.async", editSequenceAlgoliaIndex);
