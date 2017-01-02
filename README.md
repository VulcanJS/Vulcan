# Telescope Nova

<<<<<<< HEAD
<<<<<<< HEAD
Version 0.27.5
=======
### Looking for the Apollo/GraphQL version? Check out the [devel](https://github.com/TelescopeJS/Telescope/tree/devel) branch. 

There are currently two distinct versions of Telescope: **Nova** and **Legacy**.

**Nova** is the new, React-based version and all development will happen on this version going forward. It's used by the [master](https://github.com/TelescopeJS/Telescope/tree/master) and [devel](https://github.com/TelescopeJS/Telescope/tree/devel) branches. 

Note that as of December 2016, the devel branch now uses [GraphQL](http://graphql.org) as its data layer while the master branch is still on the previous, non-GraphQL version. It is recommended you use the devel branch for any new projects if possible. 

**Legacy** is the old, Blaze-powered version of Telescope and you can find it on the [legacy](https://github.com/TelescopeJS/Telescope/tree/legacy) and [legacy-devel](https://github.com/TelescopeJS/Telescope/tree/legacy-devel) branches.

Note that both versions use the same data format, so you can go back and forth between them on the same app and the same database.

## Table Of Contents

  - [Getting Started](#getting-started)
  - [Updating](#updating)
  - [Resources](#resources)
  - [Settings](#settings)
  - [Deployment](#deployment)
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
  - [Routes](#routes)
  - [Groups & Permissions](#groups--permissions)
  - [Internationalization](#internationalization)
  - [Cheatsheet](#cheatsheet)
  - [Third-Party packages](#third-party-packages)

## Getting Started

### First Steps

Install the latest version of Node and NPM. We recommend the usage of [NVM](http://nvm.sh).

[Install Meteor](https://www.meteor.com/install):

```sh
curl https://install.meteor.com/ | sh
```

Clone this repository locally:

```sh
git clone git@github.com:TelescopeJS/Telescope.git
```

(or `https://github.com/TelescopeJS/Telescope.git`)

Install the necessary NPM packages:

```sh
npm install
```

Then run the app with:

```sh
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

## Settings

Settings can be configured in your `settings.json` file. For legacy compatibility reasons, settings can also be specified in your database, but note that settings specified in `settings.json` take priority over those stored in the database.

Settings can be public (meaning they will be published to the client) or private (they will be kept on the server). Public settings should be set on the `public` object. You can find a full example in `sample_settings.json`.

To use your `settings.json` file:

- Development: `meteor --settings settings.json`
- Production: specify the path to `settings.json` in the tool you use to deploy (i.e. `mup deploy --settings settings.json`, see below)

## Deployment

The recommended way to deploy Nova is by using [Mup](https://github.com/kadirahq/meteor-up/), at least v1.0.3.

#### Configuration

You should have a Linux server online, for instance [a Digital Ocean droplet running with Ubuntu](https://www.digitalocean.com).

Install globally the latest `kadirahq/meteor-up`.

``` 
npm install -g mup
```

Create Meteor Up configuration files in your project directory with `mup init`. In the example below, the configuration files are created in a `.deploy` directory at the root of your app. 

```
cd my-app-folder
mkdir .deploy
cd .deploy
mup init
```

This will create two files :

```
mup.js - Meteor Up configuration file
settings.json - Settings for Meteor's settings API
```

Then, replace the content of the newly created `settings.json` with your own settings (you can use the content of `sample_settings.json` as a starter).

Fill `mup.js` with your credentials and optional settings (check the [Mup repo](https://github.com/kadirahq/meteor-up) for additional docs). 

**Note:** the `ROOT_URL` field should be the absolute url of your deploy ; and you need to explicitly point out to use `abernix/meteord:base` docker image with a `docker` field within the `meteor` object.

```
...
meteor: {
  ...
  path: '../' // relative path of the app considering your mup config files
  env: {
        ROOT_URL: 'http://nova-app.com', // absolute url of your deploy
        ...
  }, 
  ...
  docker: {
        image:'abernix/meteord:base' // docker image working with meteor 1.4 & node 4
  },
  ...
},
...
```

You can take inspiration (or copy/paste) on this [`mup.js` example](https://gist.github.com/xavcz/6ddc2bb6f67fe0936c8328ab3314641d).

#### Setup your server

From this folder, you can now setup Docker & Mongo your server with:
```
mup setup 
```

#### Deploy your app to your server

Still in the same folder, to deploy your app with your settings file:

```
mup --settings settings.json
```

## Categories

Just like Settings, you can specify categories either via the in-app UI or via `settings.json`. Note that if you want to delete a category, you'll have to both delete it via the UI and also remove it from `settings.json`.

## Social Login

To add new social login options, you'll first need to add your API keys to your `settings.json` file. For example:

```json
"oAuth": {
  "twitter": {
    "consumerKey": "foo",
    "secret": "bar"
  },
  "facebook": {
    "appId": "foo",
    "secret": "bar"
  }
}
```

(Make sure these are not in the `public` block of `settings.json`)

Then, add the relevant Meteor package:

```sh
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
- `methods.js`: collection methods.
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
>>>>>>> TelescopeJS/master

This is the Apollo/GraphQL version of Telescope Nova. [You can find the documentation here](http://nova-docs.telescopeapp.org/).
=======
### Looking for the Apollo/GraphQL version? Check out the [devel](https://github.com/TelescopeJS/Telescope/tree/devel) branch. 

There are currently two distinct versions of Telescope: **Nova** and **Legacy**.

**Nova** is the new, React-based version and all development will happen on this version going forward. It's used by the [master](https://github.com/TelescopeJS/Telescope/tree/master) and [devel](https://github.com/TelescopeJS/Telescope/tree/devel) branches. 

Note that as of December 2016, the devel branch now uses [GraphQL](http://graphql.org) as its data layer while the master branch is still on the previous, non-GraphQL version. It is recommended you use the devel branch for any new projects if possible. 
>>>>>>> TelescopeJS/master

### Other Versions

You can find the older, non-Apollo version of Telescope Nova on the [nova-classic](https://github.com/TelescopeJS/Telescope/tree/nova-classic) branch. 

You can find the even older, non-React version of Telescope on the [legacy](https://github.com/TelescopeJS/Telescope/tree/legacy) branch.