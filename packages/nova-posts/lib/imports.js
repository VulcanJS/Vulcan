// stubs for NPM compatibility

const returnEmptyObject = function () {
  return {};
}

console.log(Mongo); // eslint-disable-line

const Mongo = typeof Mongo !== "undefined" ? Mongo : {
  Collection: function () {
    return {attachSchema: returnEmptyObject}
  }
};

console.log("// Mongo"); // eslint-disable-line
console.log(Mongo); // eslint-disable-line

const Meteor = typeof Meteor !== "undefined" ? Meteor : {
  methods: returnEmptyObject
};

const SimpleSchema = typeof SimpleSchema !== "undefined" ? SimpleSchema : returnEmptyObject;

const Foo = "bar"
export { Mongo, Foo }
