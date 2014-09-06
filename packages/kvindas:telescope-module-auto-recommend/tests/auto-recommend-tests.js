Tinytest.add('recommend empty title from html', function (test) {
  var html = "";
  var title = AutoRecommendService.getTitleFromHtml(html);
  test.equal(title, "");
});

Tinytest.add('recommend title from html', function (test) {
  var html = "<html><head><title>This is test title</title></head></html>";
  var title = AutoRecommendService.getTitleFromHtml(html);
  test.equal(title, "This is test title");
});

Tinytest.add('recommend empty description from html', function (test) {
  var html = "";
  var desc = AutoRecommendService.getDescriptionFromHtml(html);
  test.equal(desc, "");
});

Tinytest.add('recommend description from html - meta content', function (test) {
  var html = '<html><head><meta content="This is a test description" name="description"></head></html>';
  var desc = AutoRecommendService.getDescriptionFromHtml(html);
  test.equal(desc, "This is a test description");
});

Tinytest.add('recommend description from html - og content', function (test) {
  var html = '<html><head><meta content="This is a test description" property="og:description"></head></html>';
  var desc = AutoRecommendService.getDescriptionFromHtml(html);
  test.equal(desc, "This is a test description");
});

Tinytest.add('recommend description from html - first paragraph of html', function (test) {
  var html = '<html><body><p>This is a test description</p></body></html>';
  var desc = AutoRecommendService.getDescriptionFromHtml(html);
  test.equal(desc, "This is a test description");
});
