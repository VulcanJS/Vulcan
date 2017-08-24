import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Chapters from '../chapters/collection.js';
import Sequences from './collection.js';
import Books from '../books/collection.js';
import Collections from '../collections/collection.js';
import { newMutation, editMutation } from 'meteor/vulcan:core';

const runSeed = false;

const createSequence = (user, title) => {
  const sequenceData = {
    userId: user._id,
    title,
  };
  return newMutation({
    collection: Sequences,
    document: sequenceData,
    currentUser: user,
    validate: false,
  });
}

const createChapter = (title, subtitle, sequenceId) => {
  return newMutation ({
    collection: Chapters,
    document: {title, subtitle, sequenceId},
    currentUser: Users.findOne(),
    validate: false,
  })
}

const addPostsToChapter = (chapterId, postIds) => {
  return editMutation({
    collection: Chapters,
    documentId: chapterId,
    set: {postIds},
    currentUser: Users.findOne(),
    validate: false,
  })
}

const createBook = (title, subtitle, collectionId) => {
  return newMutation ({
    collection: Books,
    document: {title, subtitle, collectionId},
    currentUser: Users.findOne(),
    validate: false,
  })
}

const addSequencesToBook = (bookId, sequenceIds) => {
  return editMutation({
    collection: Books,
    documentId: bookId,
    set: {sequenceIds},
    currentUser: Users.findOne(),
    validate: false,
  })
}

const createCollection = (user, title) => {
  return newMutation({
    collection: Collections,
    document: {userId: user._id, title},
    currentUser: Users.findOne(),
    validate: false,
  })
}

const addBooksToCollection = (collectionId, bookIds) => {
  return editMutation({
    collection: Collections,
    documentId: collectionId,
    set: {bookIds},
    currentUser: Users.findOne(),
    validate: false,
  })
}

if(runSeed) {
  Meteor.startup(async function () {

    const currentUser = Users.findOne({_id: "nmk3nLpQE89dMRzzN"});

    const first_sequence = await createSequence(currentUser, "Map and Territory");
    const first_chapter = await createChapter("","", first_sequence._id);

    await addPostsToChapter(first_chapter._id, ["RcZCwxFiZzE6X7nsv", "SqF8cHjJv43mvJJzx", "YshRbqZHYFoEMqFAu", "jnZbHi873v9vcpGpZ", "R8cpqD3NA4rZxRdQ4", "Yq6aA4M3JKWaQepPJ", "CPm5LTwHrvBJCa9h5", "sSqoEw9eRP2kPKLCz", "HLqWn5LASfhhArZ7w", "46qnWRSR7L2eyNbMA"]);

    const col1 = await createCollection(currentUser, "The Sequences");
    const col2 = await createCollection(currentUser, "The Codex");
    const col3 = await createCollection(currentUser, "Harry Potter and the Methods of Rationality");

    console.log("Created Collections: ", col1, col2, col3);

    const book1 = await createBook("Book I: The Real Deal", "This is another subtitle", col1._id);
    const book2 = await createBook("Book II: The Real Real Deal", "And another Subtitle", col1._id);
    const book3 = await createBook("Book III: The Real More Deal", col2._id);

    console.log("Created Books: ", book1, book2, book3);

    const seq1 = await createSequence(currentUser, "Map and Territory");
    const seq2 = await createSequence(currentUser, "The Other Territory");
    const seq3 = await createSequence(currentUser, "And One More Sequence");

    console.log("Created Sequences ", seq1, seq2, seq3);

    await addSequencesToBook(book1._id, [seq1._id, seq2._id, seq3._id])
    await addSequencesToBook(book2._id, [seq1._id, seq2._id, seq3._id])
    await addSequencesToBook(book3._id, [seq1._id, seq2._id, seq3._id])

    console.log("Added sequences to books");

    const chap1 = await createChapter("Chapter 1: The end of Chapters", "The one chapter to bind them all", seq1._id);
    const chap2 = await createChapter("Chapter 2: The return of the Chapters", "In the darkness to find them", seq1._id);
    const chap3 = await createChapter("Chapter 3: A new Chapterious Hope", "And Forever Bind Them", seq2._id);

    console.log("Created Chapters", chap1, chap2, chap3);

    await addPostsToChapter(chap1._id, ["zztyZ4SKy7suZBpbk", "zzsNpwTuduGNggT7G", "zyuXC7suPt2M85Scd", "zwvYRBqarbj8MmDub"])
    await addPostsToChapter(chap2._id, ["zztyZ4SKy7suZBpbk", "zzsNpwTuduGNggT7G", "zyuXC7suPt2M85Scd"])
    await addPostsToChapter(chap3._id, ["zzsNpwTuduGNggT7G", "zyuXC7suPt2M85Scd", "zwvYRBqarbj8MmDub"])

    console.log("Added Posts to Chapters")
  });
}
