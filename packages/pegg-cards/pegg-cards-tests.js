// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by pegg-cards.js.
import { name as packageName } from "meteor/pegg-cards";

// Write your tests here!
// Here is an example.
Tinytest.add('pegg-cards - example', function (test) {
  test.equal(packageName, "pegg-cards");
});
