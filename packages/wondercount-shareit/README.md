# Share it

I've built social sharing buttons a few times and decided it was time to extract it to a package!  The goal of this package is to do a few things:

* Render appropriate meta tags for Facebook/OG and Twitter (via spiderable)
* Support social sharing buttons with bootstrap-3 (default) and font-awesome
* Expand to support other social platforms besides just twitter & facebook, in a configurable way

See also our [project home](http://meteorjs.club/shareit/) (WIP).

## Quick Start

    meteor add joshowens:shareit

## Usage

Simply put `{{>shareit}}` in your template.  We use the following keys in your
**current data context** (more on this below):

* `title`
* `author` - expects a string or a function (see below).  The function is used only for twitter.  If an object is returned, and `author.profile.twitter` exists, this value will be used instead.
* `excerpt` or `description` or `summary`  in FB and Twitter

and optionally:

* `url` - defaults to current page URL
* `sitenap` - defaults to current page hostname
* `thumbnail` - `image` in FB and Twitter.  Expects a function (see below).

Notes:

1. **Facebook**:
  1. The `og:type` is `article`.
  1. Images should at least 1200x630; if above 600x315 you'll get a big photo
share, and below, a small photo, see
[this](https://developers.facebook.com/docs/sharing/best-practices#images).
  1. [Sharing Best Practices for Websites & Mobile Apps](https://developers.facebook.com/docs/sharing/best-practices)

1. **Twitter**
  1. The `twitter:card` type is `summary`.
  1. Image, min of 120x120 & < 1MB, see [this](https://dev.twitter.com/cards/types/summary).  For "large image summaries" (in our roadmap, below), at least 280x150 &
< 1 MB, see [this](https://dev.twitter.com/cards/types/summary-large-image).

1. **Google+** tags are not added yet, but when you share on Google+, it's smart
enough to get everything it needs from the other tags.

1. [Social media image dimensions 2014: the complete guide for Facebook, Twitter and Google +](http://postcron.com/en/blog/social-media-image-dimensions-sizes/)

### Regarding the Data Context

`{{> shareit}}` will work anywhere in a template where `{{title}}`, `{{excerpt}}`,
etc would work.  The source of the data context would be the `data()` function
for a route in `iron:router`, or from a surrounding `{{#with}}` tag.  (You can
use `{{#each}}` too, but only the last rendered block will be used to set the
page meta tags:

```handlebars
<template name="article">
  <h1>{{title}}</h1>
  {{> shareit}}
</template>
```

Just like any Meteor template/component, you can override the data context
for a single component by specifying a single non-key argument.  e.g.
`{{> shareit shareData}}` will get `title` from `{{shareData.title}}`, etc.
shareData can itself be a key in the current data context, or a helper
function of the current template, e.g.:

```handlebars
<template name="article">
  {{shareit shareData}}
</template>
```
```js
Template.article.helpers({
  shareData: function() {
    return { title: ..., etc } || MyCol.findOne() || etc
  }
});
```

### Functions

For keys that take functions (author, image), the value of this function will be used.  We use these functions to do lookups.  If the function is setup anonymously inside a helper, `this` is the current data context.  e.g.

```js
Template.article.helpers({
  shareData: function() {
    return {
      title: this.data,
      author: Meteor.users.findOne(this.authorId)
  }
});
```

## Configuration

Somewhere in your client (not server) code you can configure ShareIt.  This is completely optional and the defaults are listed below:

```js
  ShareIt.configure({
    useFB: true,          // boolean (default: true)
                          // Whether to show the Facebook button
    useTwitter: true,     // boolean (default: true)
                          // Whether to show the Twitter button
    useGoogle: true,      // boolean (default: true)
                          // Whether to show the Google+ button
    classes: "large btn", // string (default: 'large btn')
                          // The classes that will be placed on the sharing buttons, bootstrap by default.
    iconOnly: false,      // boolean (default: false)
                          // Don't put text on the sharing buttons
    applyColors: true     // boolean (default: true)
                          // apply classes to inherit each social networks background color
  });
```

## Roadmap

* Support text OR functions for `thumbnail`
* Rename `thumbnail` to image with backwards compatilility (FB suggestion of 1200x630 is not a thumbnail :))
* Twitter: use [summary](https://dev.twitter.com/cards/types/summary) for `thumbnail`, and [summary_large_image](https://dev.twitter.com/cards/types/summary-large-image)
for `image`
* Google+ tags ([snippets](https://developers.google.com/+/web/snippet/))
