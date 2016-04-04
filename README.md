# Telescope Nova

**Nova** is a top-secret, highly unstable experimental branch of Telescope with a really cool name. 

## Install

1. Clone this branch to your local machine
2. Run `npm install`
3. Run `meteor`

Note: the `nova:*` packages are *not* currently published to Atmosphere.  

## Resources

The best way to get support is the #nova channel in the [Telescope Slack Chatroom](http://slack.telescopeapp.org).

You can also check out the [Nova roadmap on Trello](https://trello.com/b/dwPR0LTz/nova-roadmap) to see what needs to be done. 

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

## Loading Data

To load data and display it as a list of documents (or a single document), Nova uses the [React List Container](https://github.com/meteor-utilities/react-list-container) package. 

## Forms

See [nova:forms](https://github.com/TelescopeJS/Telescope/tree/nova/packages/nova-forms) package readme.

## Methods

You can use regular Meteor methods, or [Smart Methods](https://github.com/meteor-utilities/smart-methods).

## Cheatsheet

You can access a dynamically generated cheatsheet of Nova's main functions at [http://localhost:3000/cheatsheet](/cheatsheet) (replace with your own development URL).