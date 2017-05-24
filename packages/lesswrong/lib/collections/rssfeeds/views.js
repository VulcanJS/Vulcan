import RSSFeeds from "./collection.js"

//Messages for a specific conversation
RSSFeeds.addView("usersFeed", function (terms) {
  return {
    selector: {userId: terms.userId},
    options: {sort: {createdAt: 1}}
  };
});
