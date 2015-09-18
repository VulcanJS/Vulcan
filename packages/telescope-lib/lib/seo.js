// SEO

Telescope.SEO = {};

Telescope.SEO.setTitle = function (title) {
  DocHead.setTitle(title);
  DocHead.addMeta({name: "title", content: title});
  DocHead.addMeta({property: "og:title", content: title});
  DocHead.addMeta({property: "twitter:title", content: title});
}

Telescope.SEO.setDescription = function (description) {
  DocHead.addMeta({name: "description", content: description});
  DocHead.addMeta({property: "og:description", content: description});
}

Telescope.SEO.setImage = function (image) {
  DocHead.addMeta({name: "image", content: image});
  DocHead.addMeta({property: "og:image", content: image});
  DocHead.addMeta({property: "twitter:image", content: image});
}