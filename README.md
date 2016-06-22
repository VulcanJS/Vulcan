# Telescope Nova

There are currently two distinct versions of Telescope: **Nova** and **Legacy**. 

**Nova** is the new, React-based version and all development will happen on this version going forward. It's used by the [master](https://github.com/TelescopeJS/Telescope/tree/master) and [devel](https://github.com/TelescopeJS/Telescope/tree/devel) branches. 

**Legacy** is the old, Blaze-powered version of Telescope and you can find it on the [legacy](https://github.com/TelescopeJS/Telescope/tree/legacy) and [legacy-devel](https://github.com/TelescopeJS/Telescope/tree/legacy-devel) branches. 

Note that both versions use the same data format, so you can go back and forth between them on the same app and the same database. 

## Table Of Contents

  - [Getting Started](#getting-started)
  - [Updating](#updating)
  - [Resources](#resources)
  - [Deployment](#deployment)
  - [Settings](#settings)
  - [Categories](#categories)
  - [Social Login](#social-login)
  - [Packages](#packages)
  - [Application Structure](#application-structure)
  - [Files](#files)
  - [Customizing Components](#customizing-components)
  - [Customizing Emails](#customizing-emails)
  - [Custom Fields](#custom-fields)
  - [Publishing Data](#publishing-data)
  - [Subscribing](#subscribing)
  - [Loading Data](#loading-data)
  - [Callbacks](#callbacks)
  - [Posts Parameters](#posts-parameters)
  - [Forms](#forms)
  - [Methods](#methods)
  - [Internationalization](#internationalization)
  - [Cheatsheet](#cheatsheet)

## Getting Started

### First Steps

[Install Meteor](https://www.meteor.com/install):

```
curl https://install.meteor.com/ | sh
```

Clone this repository locally:

```
git clone git@github.com:TelescopeJS/Telescope.git
```

Install the necessary NPM packages:

```
npm install
```

Then run the app with:

```
meteor
```

You'll then be able to access it on [http://localhost:3000](http://localhost:3000).

### Creating An Admin Account

The first account you create (via Log In > Register) will automatically be given admin rights. 

### Deleting Dummy Content

On its first run, Nova seeds the site with a few dummy posts. You can remove them by opening the browser console and calling `Meteor.call('removeGettingStartedContent')` while logged in as admin. 

### Example Custom Package

This repo also includes an example of how to customize Nova using a custom package. To enable the custom package, simply uncomment the line `# my-custom-package` in `.meteor/packages` (remove the `#`). 

For more information on customizing Nova, refer to specific sections in this documentation. Note that **you should never customize core files directly** (files in `nova:*` packages). 

Instead, either extend the object you want to customize from your own package, or disable the initial package, clone it, and modify your own copy.

## Updating

#### Updating with Git

If you've cloned this repo and are using **local packages** (i.e. `nova:core`, `nova:posts`, etc. are in your `/packages` directory) you'll have to pull in the changes from this repo with `git pull origin master`. 

#### Updating with Meteor

Alternatively, if Meteor can't find a package in your local `/packages` directory it will look for it in the [Atmosphere](http://atmospherejs.com) package directory. This means you can also update the app by following these steps:

- Delete all `nova:*` packages from `/packages` to force Meteor to use remote versions instead. 
- Run `meteor update`.
- If that didn't work, delete the `.meteor/versions` file to force an update. 

If you're comfortable with Git workflows the first method is recommended, if not you can use the `meteor update` technique instead. 

#### Upgrading From Older Versions

To update to Nova from an earlier version of Telescope, I suggest you create a new repo and start from scratch. That being said you can use the same database seamlessly since Nova uses the same database schema. 

For local development, an easy way to do that is to simply copy the `.meteor/local` directory which contains your local database to your new repo. 

## Resources

The best ways to get support are [Telescope Meta](http://meta.telescopeapp.org) and the [Telescope Slack Chatroom](http://slack.telescopeapp.org).

## Deployment

The recommended way to deploy Nova is by using [MupX](https://github.com/arunoda/meteor-up/tree/mupx).

## Settings

Settings can be configured in your `settings.json` file. For legacy compatibility reasons, settings can also be specified in your database, but note that settings specified in `settings.json` take priority over those stored in the database.

Settings can be public (meaning they will be published to the client) or private (they will be kept on the server). Public settings should be set on the `public` object. You can find a full example in `sample_settings.json`.

To use your `settings.json` file:

- Development: `meteor --settings settings.json`
- Production: specify the path to `settings.json` in `mup.json`

## Categories

Just like Settings, you can specify categories either via the in-app UI or via `settings.json`. Note that if you want to delete a category, you'll have to both delete it via the UI and also remove it from `settings.json`. 

## Social Login

To add new social login options, you'll first need to add your API keys to your `settings.json` file. For example:

```
"oAuth": {
  "twitter": {
    "consumerKey": "foo",
    "secret": "bar"
  },
  "facebook": {
    "clientId": "foo",
    "secret": "bar"
  }
}
```

(Make sure these are not in the `public` block of `settings.json`)

Then, add the relevant Meteor package:

```
meteor add accounts-twitter accounts-facebook
```

## Packages

Nova's codebase is split across multiple packages, with the philosophy that you should be able to add and remove packages depending on which features you actually need. 

#### Core Packages

These packages are necessary for Nova to run. 

| Name | Description |
| --- | --- |
| `nova:lib` | Utility functions used by the app; also handles importing most external packages. |
| `nova:events` | Event tracking.|
| `nova:core` | Import previous core packages. |

#### Optional Packages

These packages are optional, although they might depend on each other. Note that dependencies on non-core packages should be `weak` whenever possible. 

| Name | Description |
| --- | --- |
| `nova:api` | Generate a JSON API for posts. |
| `nova:categories` | Posts categories. |
| `nova:comments` | Comments. |
| `nova:categories` | Posts categories. |
| `nova:email` | Send emails. |
| `nova:embedly` | Get metadata (thumbnails, origin, etc.) from [Embedly](http://embed.ly) when submitting new posts. |
| `nova:forms` | Generate forms for inserting and editing documents ([README](https://github.com/TelescopeJS/Telescope/tree/nova/packages/nova-forms)). |
| `nova:getting-started` | Generate dummy content on first run. |
| `nova:kadira` | [Kadira](http://kadira.io) integration. |
| `nova:newsletter` | Send an automated newsletter with [Mailchimp](http://mailchimp.com). |
| `nova:notifications` | Notifications. |
| `nova:posts` | Posts. |
| `nova:RSS` | RSS feeds for posts and comments. |
| `nova:search` | Search across posts. |
| `nova:settings` | Legacy support for publishing settings. |
| `nova:share` | Easy social sharing. |
| `nova:users` | Users. |
| `nova:voting` | Voting on posts and comments. |

#### Customizable Packages

These are the packages that you might commonly need to customize or replace to tweak your app's layout, design, and behavior. You can either clone these packages and modify them directly, or *extend* their contents (see the [Customizing Components](#customizing-components) section.), but you should **not** modify them directly.

| Name | Description |
| --- | --- |
| `nova:base-components` | The default components that make up the Nova front-end. |
| `nova:base-styles` | Default styles (includes Bootstrap).|
| `nova:base-routes` | Default routes.|
| `nova:email-templates` | Email templates.|
| `nova:i18n-en-us` | Contains English language strings.|

#### Extra Packages

These packages provide extra features but are not enabled out of the box.

| Name | Description |
| --- | --- |
| `nova:forms-tags` | A component for autofilled tags. |
| `nova:cloudinary` | Automatically upload posts thumbnails to [Cloudinary](http://cloudinary.com).|

#### Debug Packages

These packages are provided to help you when doing local development. 

| Name | Description |
| --- | --- |
| `nova:debug` | Provides routes and utility for debugging. |
| `nova:demo` | A demo of how to use custom collections.|

## Application Structure

Nova's application structure is a bit different than most other Meteor apps. Generally speaking, we can distinguish between three ways of organizing code in a Meteor app: default, module-based, and package-based (which is what Nova uses).

The **default** app structure is what legacy Meteor apps such as [Microscope](https://github.com/DiscoverMeteor/Microscope) use. Files are stored in `/client`, `/server`, `/lib`, etc. directories and imported automatically by Meteor. This approach requires the least work, but also gives you less control over load order. 

Starting with Meteor 1.3, the **module-based** approach is the pattern officially recommended by the [Meteor Guide](http://guide.meteor.com/structure.html). In it, all your files are stored in an `/imports` directory, with two `/client/main.js` and `/server/main.js` entry points that then import all other files. The main difference with the previous pattern is that files in `/imports` no longer run automatically. 

Finally, with the **package-based** technique, all your code is stored in [Meteor packages](http://guide.meteor.com/using-packages.html). Packages can be loaded from Meteor's package server, or stored locally in your `/packages` directory. Note that it is recommended you use modules within your packages.

When customizing Nova, you can use any of these three approaches for your own custom code. But if you can, I would recommend sticking with Nova's **package-based** approach just to maintain consistency between Nova's codebase and yours. 

Also, using packages for customization means you have an easy way to turn off any customization you've added if you need to track down the source of a problem. 

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
- `email_routes.js`: test routes for email templates.
- `server/publications.js`: publications.

## Customizing Components

Apart from a couple exceptions, almost all React components in Nova live inside the `nova:base-components` package. There are two main ways of customizing them.

### Override

If you only need to modify a single component, you can simply override it with a new one without having to touch the `nova:base-components` package. 

For example, if you wanted to use your own `CustomLogo` component you would do:

```js
const CustomLogo = (props) => {
  return (
    <div>/* custom component code */</div>
  )
}
Telescope.components.Logo = CustomLogo;
```

Or, if `Logo` is defined as an ES6 class:

```js
class CustomLogo extends Telescope.components.Logo{
  render() {
    return (
      <div>/* custom component code */</div>
    )
  } 
}
Telescope.components.Logo = CustomLogo;
```

Components are generally defined as functional stateless components, unless they contain extra logic (lifecycle methods, event handlers, etc.) in which case they'll be defined as ES6 classes. 

For components defined as ES6 classes, make sure you `extend` the original component. This will let you pick and choose which methods you actually need to replace, while inheriting the ones you didn't specify in your new component. 

You can make the override at any point, as long as it happens before the `<Telescope.components.Logo/>` component is called from a parent component. 

### Clone & Modify

For more in-depth customizations, you can also just clone the entire `nova:base-components` package and then make your modification directly there. 

Of course, keeping your own new `components` package up to date with any future `nova:base-components` modifications will then be up to you. 

### Naming Conventions

If a component deals with a collection (`Posts`, `Comments`, etc.) its name should start with the collection's capitalized name in plural form, followed by the component's function using camelCase formatting. 

For example: `PostsShare`. 

The outermost HTML element within the component will have a class of the same name, but with a dash instead: `posts-share`. If possible, classes for all other elements within the component will start with the component's class: `posts-share-button`, `posts-share-divider`, etc.  

## Customizing Emails

Unlike components, emails don't use React but Spacebars, a variant of the Handlebars templating language. 

All email templates live in the `nova:email-templates` package. In order to register a new template or override an existing one, first you must import it as a text asset in your `package.js` file (or store it in your `/public` directory):

```js
api.addAssets(['path/to/template/newReply.handlebars',], ['server']);
```

You'll then be able to load the contents of the file in your code with:

```js
Assets.getText("path/to/template/newReply.handlebars")
```

You can add a template with:

```js
Telescope.email.addTemplates({
  newReply: Assets.getText("path/to/template/newReply.handlebars")
});
```

Or override an existing one with:

```js
Telescope.email.templates.newReply = Assets.getText("path/to/template/newReply.handlebars");
});
```

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

In order to make data available to the client, you need to **publish** it. Out of the box, Nova includes the following publications:

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

## Subscribing

If you create your own new subscription, you can tell Nova to preload it (and wait for it to be loaded) with:

```js
Telescope.subscriptions.preload(subscriptionName, subscriptionArguments);
```

For example:

```js
Telescope.subscriptions.preload("posts.featured", {featuredPostId: "foo123"});
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

Methods support three distinct types of callbacks, each with their own hook:

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

See [nova:forms](https://github.com/TelescopeJS/Telescope/tree/devel/packages/nova-forms) package readme.

## Methods

You can use regular Meteor methods, or [Smart Methods](https://github.com/meteor-utilities/smart-methods).

## Internationalization

Nova is internationalized using [react-intl](https://github.com/yahoo/react-intl/). To add a new language, you need to:

1. Create a new package containing the internationalized strings (you can use `nova:i18n-en-us` as a model).
2. Publish that package to Atmosphere and then add it to your app using `meteor add username:packagename.
3. Set `locale` to the locale name (`fr`, `en`, `ru`, etc.) in your settings. 

Note: make sure the locale you set matches the language package you're adding. 

If you create a new internationalization package, let us know so we can add it here!

- [fr_FR](https://github.com/TelescopeJS/nova-i18n-fr-fr)

## Cheatsheet

You can access a dynamically generated cheatsheet of Nova's main functions at [http://localhost:3000/cheatsheet](/cheatsheet) (replace with your own development URL).

## Third-Party Plugins

- [Post By Feed](https://github.com/xavcz/nova-post-by-feed): register RSS feeds that will be fetched every 30 minutes to create new posts automatically.
- [Nova-Slack](https://github.com/xavcz/nova-slack): A package that automatically sends your posts as messages to any connected Slack Team.

