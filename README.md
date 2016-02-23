# Telescope Nova

**Nova** is a top-secret, highly unstable experimental branch of Telescope with a really cool name. 

### Install

Clone this branch, then `npm install`. 

### Philosophy

Nova was born from a simple realization: 80% of the work involed in Telescope comes from focusing on the user experience. But this comes at the detriment of *developer* experience since it means a much larger codebase.

So Nova gets rid of nice-to-have-but-not-critical features like themes, notifications, update alerts, the admin back-end, etc.

### Goals

The goal of this project is to provide an upgrade path for people who want to completely customize their app anyway, and also benefit from React's advantages (performance, server-side rendering, tooling, etc.).

### Separation Of Concerns

Nova assumes that you're a developer and that you're going to want to customize your app anyway. So it doesn't have a default theme, and more importantly the core files don't include a single piece of HTML code. 

Instead, all markup is stored in your own theme. This comes in sharp contrast with “vanilla” Telescope:

- **Vanilla**: the newsletter package contains markup for the newsletter form, the comments package contains markup for displaying comments, etc.
- **Nova**: packages only contains each feature's underlying logic. All markup used to *display* content is contained within your own theme. 

This means that Nova doesn't lock you in with any specific rendering framework. Use React, Blaze, Angular, or even an iOS or Android app!

(OK, I lied. Nova does depend on React for now, but this dependency could in theory be removed in the future.)

### Packages

#### Core Packages

These packages are necessary for Telescope to run. 

- `lib`: utility functions used by the app; also handles all external packages.
- `events`: event tracking.
- `settings`: publish the `Settings` collection.
- `i18n`
- `core`: import previous core packages; define containers.

#### Optional Packages

These packages are optional, although they might depend on each other. Note that dependencies on non-core packages should be `weak` whenever possible. 

- `posts`
- `comments`
- `users`
- `search`
- `tags`
- `vote`
- `scoring`

#### Theme Packages

- `base-components`

### Files

Nova tries to maintain a consistent file structure for its main packages:

- `config.js`: the package's main namespace and set basic config options.
- `collection.js`: the package's collection schema.
- `callbacks.js`: callbacks used by the package.
- `helpers.js`: collection helpers.
- `methods.js`: collectiom methods.
- `published_fields.js`: specifies which collection fields should be published in which context.
- `custom_fields.js`: sets custom fields on *other* collections.
- `routes.jsx`: routes.
- `views.js`: views used for [query constructors](https://www.discovermeteor.com/blog/query-constructors/).
- `parameters.js`: the collection's query constructor.
- `server/publications.js`: publications.

### Containers & Components

Apart from the above files, Nova has two other major file types: **containers** and **components**. 

**Containers** take a set of properties, subscribe to a data source, and return a set of results. Out of the box, Nova has three containers (all contained in the `core` package):

- `AppContainer.jsx`: used to wait on global subscriptions and load the app.
- `ListContainer.jsx`: used for paginated list of items.
- `ItemContainer.jsx`: used for single items. 

**Components** take in these results, and output HTML. They should only exist inside theme packages. 

The current default “theme” is `base-components`.

### Settings

Settings can be configured in your `settings.json` file (although any settings published to the `Settings` collection will also be taken into account).

Settings can be public (meaning they will be published to the client) or private (they will be kept on the server). Public settings should be set on the `public` object. Here's an example:

```
{
  "public": {
    "title": "Nova"
  },
  "kadiraAppSecret": "123xyz"
}
```

#### Public Settings

- `title`
- `siteUrl`
- `tagline`
- `description`
- `siteImage`
- `requireViewInvite`
- `requirePostInvite`
- `requirePostsApproval`
- `defaultView`
- `postInterval`
- `RSSLinksPointTo`
- `commentInterval`
- `maxPostsPerDay`
- `startInvitesCount`
- `postsPerPage`
- `logoUrl`
- `logoHeight`
- `logoWidth`
- `faviconUrl`
- `language`
- `twitterAccount`
- `facebookPage`
- `googleAnalyticsId`

#### Private Settings

- `defaultEmail`
- `mailUrl`
- `scoreUpdateInterval` – how often scores are recalculated, in seconds
- `emailFooter`

Note that packages may also rely on their own settings. 

### Other Notes

- The `comments` package is now optional.
- Voting logic is now optional. 
- Posts and comments fields are not published by default anymore, but must be specified as so using `Posts.publishedFields` and `Comments.publishedFields`.
- Using the global scope is discouraged. Instead, use modules with `import` (if possible) or `require` (if you need dynamic module importing).
- Packages with directory names starting with `_` are currently disabled. 
- All Blaze files within packages are disabled.
- Some `.js` files within packages are disabled.
- Some code is commented. 
- Telescope's module system will probably not be ported to Nova, since it encourages you to customize your theme manually anyway. 
- This is obviously a work in progress!

### TODO

#### Clean Up

- ~~Split off notifications package~~
- ~~Get rid of unused js code (menus, modules, etc.).~~
- Get rid of Blaze code.

#### Components & Themes

- ~~Comment threads~~
- ~~Flesh out the `base-components` theme with components for the most common elements.~~
- ~~Add simple stylesheet to make base theme a little less ugly.~~
- Make base theme class names compatible with Vanilla Telescope?

#### Forms & Methods

- ~~posts.new~~
- ~~posts.edit~~
- ~~comments.new~~
- ~~comments.edit~~
- ~~users.edit (account)~~

#### Other Stuff

- ~~Create categories from code.~~
- Newsletter.
- Email & notifications (keep Spacebars for templates?).
- Refactor scheduled posts to use cron job (do in `master`?)
- i18n (waiting for [tapi18n](https://github.com/TAPevents/tap-i18n) to be 1.3-compatible).
- Autoform.
- Votes.
- Nested categories.
- Embedly.
- Search.
- Meta tags.