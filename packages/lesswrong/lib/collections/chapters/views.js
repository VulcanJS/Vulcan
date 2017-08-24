import Chapters from './collection.js';

Chapters.addView("SequenceChapters", function (terms) {
  return {
    selector: {sequenceId: terms.sequenceId},
    options: {sort: {number: 1}, limit: terms.limit || 20},
  };
});
