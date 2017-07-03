import Posts from 'meteor/vulcan:posts'

Posts.addView("legacyPostUrl", function (terms) {
  return {
    selector: {"legacyData.url": {$regex: "\/lw\/"+terms.legacyUrlId+"\/.*"}},
    options: {limit: 1},
  };
});
