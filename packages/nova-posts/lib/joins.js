Posts.joins = {};

Posts.joins.list = [
  {
    property: "categories",
    joinAs: "categoriesArray",
    collection: "Categories"
  },
  {
    property: "userId",
    joinAs: "user",
    collection: "Users"
  },
  {
    property: "commenters",
    joinAs: "commentersArray",
    collection: "Users"
  }
];