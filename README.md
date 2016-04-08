# Telescope Nova

**Nova** is a top-secret, highly unstable experimental branch of Telescope with a really cool name. 

## Table Of Contents

  - [Install](#install)
  - [Updating](#updating)
  - [Resources](#resources)
  - [Deployment](#deployment)
  - [Settings](#settings)
  - [Social Login](social-login#)
  - [Packages](#packages)
  - [Files](#files)
  - [Customizing Components](#customizing-components)
  - [Custom Fields](#custom-fields)
  - [Publishing Data](#publishing-data)
  - [Loading Data](#loading-data)
  - [Callbacks](#callbacks)
  - [Posts Parameters](#posts-parameters)
  - [Forms](#forms)
  - [Methods](#methods)
  - [Cheatsheet](#cheatsheet)

## Install

1. Clone this branch to your local machine
2. Run `npm install`
3. Run `meteor`

Note: the `nova:*` packages are *not* currently published to Atmosphere.  

## Updating

To keep your codebase up to date, you'll have to manually pull in the changes from this git repo for now. Automated updating via `meteor update` is not yet supported, although it will be soon. 

To update to Nova from an earlier version of Telescope, I suggest you create a new repo and start from scratch. That being said you can use the same database seamlessly since Nova uses the same database schema. 

For local development, an easy way to do that is to simply copy the `.meteor/local` directory which contains your local database to your new repo. 

## Resources

The best way to get support is the #nova channel in the [Telescope Slack Chatroom](http://slack.telescopeapp.org).

You can also check out the [Nova roadmap on Trello](https://trello.com/b/dwPR0LTz/nova-roadmap) to see what needs to be done. 

## Deployment

The recommended way to deploy Nova is by using [MupX](https://github.com/arunoda/meteor-up/tree/mupx).

## Settings

Settings can be configured in your `settings.json` file (although any settings published to the `Telescope.settings.collection` collection will also be taken into account).

Settings can be public (meaning they will be published to the client) or private (they will be kept on the server). Public settings should be set on the `public` object. You can find a full example in `sample_settings.json`.

To use your `settings.json` file:

- Development: `meteor --settings settings.json`
- Production: specify the path to `settings.json` in `mup.json`

See also the `/settings` route inside your app. 

## Social Login

To add new social login options, just add the relevant package (`accounts-twitter`, `accounts-facebook`, etc.) to your `.meteor/packages` file with (for example):

`meteor add accounts-twitter`

Note: you will need to configure the service's oAuth tokens via the log-in UI, or directly in the database. 

## Packages

#### Core Packages

These packages are necessary for Nova to run. 

- `lib`: utility functions used by the app; also handles all external packages.
- `events`: event tracking.
- `i18n`: internationalization.
- `core`: import previous core packages.

#### Optional Packages

These packages are optional, although they might depend on each other. Note that dependencies on non-core packages should be `weak` whenever possible. 

- `settings`: publish the `Settings` collection (for backwards compatibility)
- `posts`
- `comments`
- `users`
- `search`
- `tags`
- `vote`
- `scoring`

#### Theme Packages

- `base-components`
- `base-styles`

## Files

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

## Customizing Components

Apart from a couple exceptions, almost all React components in Nova live inside the `nova:base-components` package. There are two main ways of customizing them.

### Override

If you only need to modify a single component, you can simply override it with a new one without having to touch the `nova:base-components` package. 

For example, if you wanted to use your own `CustomLogo` component you would do:

```js
class CustomLogo extends Telescope.components.Logo{
  render() {
    return (
      <div>/* custom component code */</div>;
    )
  } 
}
Telescope.components.Logo = CustomLogo;
```

Nova components are resolved at render. So you just need to make the override anytime before the `<Logo/>` component is called from a parent component. 

### Clone & Modify

For more in-depth customizations, you can also just clone the entire `nova:base-components` package and then make your modification directly there. 

Of course, keeping your own new `components` package up to date with any future `nova:base-components` modifications will then be up to you. 

## Custom Fields

Out of the box, Nova has three main collections: `Posts`, `Users`, and `Comments`. Each of them has a pre-set schema, but that schema can also be extended with custom fields. 

For example, this is how the `nova:newsletter` package extends the `Posts` schema with a `scheduledAt` property that keeps track of when a post was sent out as part of an email newsletter:

```js
Posts.addField({
  fieldName: 'scheduledAt',
  fieldSchema: {
    type: Date,
    optional: true
  }
});
```

The `collection.addField()` function takes either a field object, or an array of fields. Each field has a `fieldName` property, and a `fieldSchema` property.

Each field schema supports all of the [SimpleSchema properties](https://github.com/aldeed/meteor-simple-schema#schema-rules), such as `type`, `optional`, etc.

A few special properties (`insertableIf`, `editableIf`, `control`, and `order`) are also supported by the [nova:forms](https://github.com/TelescopeJS/Telescope/tree/nova/packages/nova-forms) package.

Note that Telescope provides a few utility function out of the box to use with `insertableIf` and `editableIf`:

- `Users.is.admin`: returns `true` if a user is an admin.
- `Users.is.memberOrAdmin`: returns `true` if a user is a member (i.e. has an account and is currently logged in) or an admin.
- `Users.is.ownerOrAdmin`: (editing only) returns `true` if a user is a members and owns the document being edited; or is an admin. 

Additionally, the `publish` and `join` properties come from the [Smart Publications](https://github.com/meteor-utilities/smart-publications) package. Setting `publish` to true indicates that a field should be published to the client (see also next section).

You can also remove a field by calling `collection.removeField(fieldName)`. For example:

```js
Posts.removeField('scheduledAt');
```

## Publishing Data

In order to make data available to the cient, you need to **publish** it. Out of the box, Nova includes the following publications:

- `posts.list`: a list of posts
- `posts.single`: a single post (includes more data)
- `comments.list`: a list of comments
- `users.single`: a single user
- `users.current`: the current user (includes personal data)

While most publications look up each field's `publish` property to figure out if they should publish it or not, some (like `posts.list` and `comments.list`) only feature a smaller subset of properties for performance reasons, and thus have their own specific list of published fields. 

For example, here's how the `nova:embedly` adds the `thumbnailUrl, `media`, `soureName`, and `sourceUrl` fields to the list of published fields for the `posts.list` publication (after having defined them as custom fields):

```js
import PublicationUtils from 'meteor/utilities:smart-publications';

PublicationUtils.addToFields(Posts.publishedFields.list, ["thumbnailUrl", "media", "sourceName", "sourceUrl"]);
```

## Loading Data

To load data and display it as a list of documents (or a single document), Nova uses the [React List Container](https://github.com/meteor-utilities/react-list-container) package to connect to the publications mentioned in the previous section.  

## Callbacks

Nova uses a system of hooks and callbacks for many of its operations. 

For example, here's how you would add a callback to `posts.edit.sync` to give posts an `editedAt` date every time they are modified:

```js
function setEditedAt (post, user) {
  post.editedAt = new Date();
  return post;
}
Telescope.callbacks.add("posts.edit.sync", setEditedAt);
```

If the callback function is named (i.e. declared using the `function foo () {}` syntax), you can also remove it from the callback using:

```js
Telescope.callbacks.remove("posts.edit.sync", "setEditedAt");
```

Methods support four distinct types of callbacks, each with their own hook:

- `client` callbacks are only called on the client, before the actual method is called.
- `method` callbacks are called within the body of the method, and they run both on the client and server.
- `sync` callbacks are called in the mutator, and can run either on both client and server, *or* on the server only if the mutator is called directly.
- `async` callbacks are called in the mutator, and only run on the server in an async non-blocking way. 

## Posts Parameters

In order to filter posts by category, keyword, view, etc. Nova uses a system of successive callbacks to translate filtering options into MongoDB database queries. 

For example, here is how the `nova:search` package adds a callback to handle the `query` parameter:

```js
function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    var parameters = Telescope.utils.deepExtend(true, parameters, {
      selector: {
        $or: [
          {title: {$regex: terms.query, $options: 'i'}},
          {url: {$regex: terms.query, $options: 'i'}},
          {body: {$regex: terms.query, $options: 'i'}}
        ]
      }
    });
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addSearchQueryParameter);
```

The callback takes two arguments: the current MongoDB `parameters` (an object with a `selector` and `options` properties), and the `terms` extracted from the URL. 

It then tests for the presence of a `query` property in the `terms`, and if it finds one it then extends the `parameter` object with a MongoDB RegEx search query.

Finally, it then returns `parameters` to pass it on to the next callback (or to the database itself if this happens to be the last callback).

The `view`, `category`, `after`, `before`, etc. URL parameters are all handled using their own similar callbacks.

## Forms

See [nova:forms](https://github.com/TelescopeJS/Telescope/tree/nova/packages/nova-forms) package readme.

## Methods

You can use regular Meteor methods, or [Smart Methods](https://github.com/meteor-utilities/smart-methods).

## Cheatsheet

You can access a dynamically generated cheatsheet of Nova's main functions at [http://localhost:3000/cheatsheet](/cheatsheet) (replace with your own development URL).