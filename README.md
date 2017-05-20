# What's Lesswrong2?

Lesswrong2 is a clean-slate overhaul of the [lesswrong](http://lesswrong.com) discussion platform. We're hoping that it will replace the current site and become the discourse infrastructure for the rationality community.

The old lesswrong is [famously](http://www.telescopeapp.org/blog/using-telescope-as-a-reddit-alternative/) one of the only successful extensions of the reddit codebase (forked circa 2008). While reddit's code served us as a stable platform while our community was in its initial stages, it has become hard to extend because of its age, complexity and monolithic design.

Lesswrong2 on the other hand is based on [contemporary](http://vulcanjs.org/) [web](https://facebook.github.io/react/) [technologies](http://genomearchitect.github.io/) designed to make rapid development much easier. It solves the problems that caused the old codebase to stagnate by being written with tools that are meticulously well-documented. We hope that this will allow us to rapidly improve the site and bring it up to date with what tools for [creating](https://medium.com/) [intellectual](https://www.quora.com/) [progress](https://stackexchange.com/) look like in 2017.

# Technologies

Lesswrong2 is built on top of four major open-source libraries.

1. [Vulcan](http://vulcanjs.org/) is a framework for designing social applications like forums and news aggregators. We use it to handle many facets of the LW2 functionality such as data-loading, authentication and search.

2. [React](https://facebook.github.io/react/) is a user interface programming library developed by Facebook that lets us define interface elements declaratively in the form of components. We use it to define how to render and manage state for all parts of the site.

3. [GraphQL](http://graphql.org/) is a query language for the Mongo datastore. Vulcan mostly deals with GraphQL for us, but occasionally we use it to define APIs for accessing and mutating our data.

4. [Draft](https://draftjs.org/) is a framework developed by Facebook for creating text editors. The content and message editors on Lesswrong2 are implemented on top of Draft.

# Contributing

Despite being unstable and not yet at the stage where it can be operated by end users, Lesswrong2 is feature complete and ready for public development.

## Read the Docs

The best way to get familiar with our stack is to read the Vulcan and GraphQL documentation pages.
1. Read about [Vulcan's architecture](http://docs.vulcanjs.org/architecture.html)
2. Learn how to [customize and extend Vulcan](http://docs.vulcanjs.org/example-customization.html)
3. Understand [components and theming](http://nova-docs.telescopeapp.org/theming.html)
4. Understand [Vulcan's data layer](http://docs.vulcanjs.org/schemas.html)
5. Complete the [GraphQL tutorial](http://graphql.org/learn/)

## Understand the Package System

The Lesswong2 project uses "package" in two different and related ways. In a Vulcan application, each package is a _standalone feature_ which provides some functionality to the site, and can be toggled on or off. All of the features that come with Vulcan out-of-the-box are generally found in the `packages` directory.

In addition to the default Vulcan packages, we've extended the platform with our own packages which are stored in the `packages/lesswrong/lib` directory. All of the features that we've added to Vulcan in order to make it suitable for running lesswrong reside in this directory.

### Vulcan Packages
Vulcan packages have the following properties:

* They are conceptual (e.g. "posts", "votes"), rather than semantic (e.g. "homepage"), organization.
* The app works whether a given non-core package is toggled on or off. For example, if I disable upvoting functionality, the page should load as usual, except the posts will not have upvoting buttons.
* They can be toggled on/off by importing the package in the parent feature's "package.js" file.

Packages usually have a directory structure that looks like this:
```
.
├── package.js -- sets the package name and version, and defines the set of other packages imported by your package
└── lib -- the core functionality of your package
|   └── containers -- higher-order-components which give access to some data (e.g. the current user) in the props of a wrapped component
|       └── ...
|   ├── server -- contains routing information
|       └── ...
|   ├── collection.js -- GraphQL collection (e.g. Users or Posts) which is where all instances of your package's data model (e.g. User) will be accessible
|   ├── fragments.js -- some reusable GraphQL queries for convenience
|   ├── mutations.js -- GraphQL mutators for your collection (new, edit, remove)
|   ├── permissions.js -- permissions for accessing data from the GraphQL collection
|   ├── resolvers.js -- GraphQL resolvers for your collection (list, single, total)
|   ├── schema.js -- GraphQL schema for your package's feature (e.g. fields of a User)
|   └── server.js -- re-exports files in server/*
```
You'll notice some packages are missing some of the above or have additional files. Do not worry, this simply means the package does not require that functionality (e.g. some features don't define new data to store). Also, string searches for specific functions are your friend here.

### Lesswrong2 Packages

Lesswrong2 packages are Vulcan packages, but they have a slightly different default directory structure. Each feature we've extended Vulcan with resides in a top level folder in the `packages/lesswrong/lib` directory. In addition to the package folders, there are these special folders that store cross-cutting aspects of our code.

To create your own package, create a folder named after the concept it's associated with. For example, we currently have folders for `voting`, `messages`, and `subscriptions`. Then place any cross-cutting files in the folders listed below:

```
.
├── collections -- GraphQL collections for each of the modules
├── component-replacements -- Contains React components that replace existing components from various Vulcan packages.
├── modules -- Contains utility files that interact with GraphQL, Apollo or Vulcan that don't really fit anywhere else.
├── stylesheets -- Custom stylesheets for components defined by packages in this directory.
...
├── helpers.js -- Some collections have helper functions which are stored here. These are operations you might want to perform on a collection which aren't just mutations and resolvers.
├── routes.js -- contains routing information.
├── components.js -- contains imports for all of the components corresponding to our packages.
...
```

## Development Tips
### Iteration
* Prefer `_.range(n).forEach(i => my_function())` over `for (var i=0; i<n; i++)...`
* If the body of a for loop performs a stateful action (i.e. modifies a variable outside the scope of the for body), use `forEach`. Else, use `map`. 
* Use underscore.js when possible.

### Style guide

* [Syntax rules](https://github.com/Khan/style-guides/blob/master/style/javascript.md#syntax)
* [Comments and documentation](https://github.com/Khan/style-guides/blob/master/style/javascript.md#comments-and-documentation) 
* [ES6 rules](https://github.com/Khan/style-guides/blob/master/style/javascript.md#es67-rules)

### Debugging

* Use google chrome. Its debugging tools are superior.
* Use 'debugger' in code. Then Ctrl+Shift+J on your open page, and you can interactively step through the breakpoint. You can also interact with variables in scope at each step using the console at the bottom. 
* Use `console.warn(variable)` when you want to see the stacktrace of `variable`
* Add the [react dev tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) extension to chrome, and switch to the "React" tab after pressing Ctrl+Shift+J. You can see the react component tree. Once you click on a component in the tree, you will have access to it in the console as the variable `$r`. For example, you can check the props or state using `$r.props` or `$r.state`.
* If you think a previous commit broke your feature, use [git's builtin debugging tools](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git)
* If you fix a bug, **write a test for it**.

## CFAR Hackathon: Feature Roadmap

If you want to help with making LessWrong 2.0 happen, here are some of the features that we think are particularly well-suited to be built by newcomers to the project. If you want to work on any of these, feel free to ping either Oliver Habryka, Harmanas Chopra or Matthew Graves, or simply leave a message in our Slack. 

If you are working on this during a hackathon, just ping Oliver to help you get set up with everything, and he will be happy to help you figure out how you can help. 

### Editor Keyboard Shortcuts

Add keyboard shortcuts to our editor component.

For our editor we are using draft.js, which is the editor framework that Facebook has developed for their internal editor. Specifically we are using the open-source project [draft-js-plugins](https://www.draft-js-plugins.com/) , which is a plugin-based implementation of draft-js that allows us to easily add features to LessWrong as we need them, either by using a community-developed plugin or develop a small plugin ourselves. 

Right now our editor does not have the basic keyboard shortcuts implemented, i.e. italicizing text if you press CTRL+i or bolding text if you press CTRL+b. But this is obviously an important piece of functionality for the final page to have. 

To implement keyboard shortcuts we want to develop a very small draft-js plugin. draft-js-plugins comes with a complete keyboard shortcut interface and rich-text interface that should make it very easy for you to add keyboard shortcut functionality for basic rich-text formats such as bold and italic. 

To implement the functionality, you will want to get familiar with the code in the `lesswrong/library/editor` directory in the codebase. Basically the only important component is the EditorWrapper.jsx file. You then want to create a new file that defines a new draft-js plugin. How to do that is documented here: 

[](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/HOW_TO_CREATE_A_PLUGIN.md)

To figure out how the keyboard input interface works, you want to take a look at the documentation for Key bindings in draft.js: 

[](https://draftjs.org/docs/advanced-topics-key-bindings.html#content)

To format text, you probably want to make calls to `RichUtils.handleKeyCommand` which should be documented in the draft-js-plugins documentation. 

### Automatic Profile Pictures

Vulcan JS has some functionality that automatically helps you give new users profile-pictures that resemble their initials (similar to what Google does for documents). We want this to be the basic way avatars are handled all across the page. But at the moment every new user is simply given the same placeholder image. 

To implement this feature, you will want to understand how the user-creation process works, and how we are generating the current profile images. You should then figure out the utility functions functions that Vulcan provides to create initials-based profile images. Most of the relevant code should be in `vulcan-users/lib/avatar.js` , which seems to provide some way for us to active initial-based profile pictures, though I haven't gotten it to work yet. There is some code in `lesswrong/library/modules/settings.js` that I hoped would do the trick, but it only broke the profile pictures. So maybe that's where you want to start. 

I would put must of the code for this into a new folder in `lesswrong/lib` with the name `avatars` or something like that. 

Working on this feature should make you quite familiar with the basics of react, the basics of vulcan and the basics of Apollo, so if you are interested in learning these technologies, this might be a decent opportunity. 

### Message Read Indicators 

Create a new UI-element for messages that indicates whether the message has been read, and how many unread messages you have in a conversation.

We already keep track of whether a user has read a private message, but currently don't display that information to the user. You can create a new react-component that is displayed next to private messages that indicates whether the user the message was sent to has read the message. 

To achieve this, you will want to read the code in the `lesswrong/lib/inbox` folder, and figure out where in `messageItem.jsx` you want to add your new component (and which information it will need access to). 

To add the number of unread messages a user has in a conversation thread, you have to create a new component and call it from `inboxNavigation.jsx` . 

This feature will probably make you familiar with graphQL, Apollo and the Data Layer aspect of Vulcan, so this might be a good place to start if you want to get more familiar with those. You will also have to write some react code. 

### New Favicon

If you are more artistically inclined, then there are a ton of small UI things that need to get done. One of these is to create a new favicon that will show up in the tab-bar of your browser when you have the new LessWrong page open. Just ping Oliver to send you all the illustrator and photoshop files we used for the logo and designs so far if you are interested in working on this. 

### User Mentions

Implement mentions using draft-js-plugins.

It would be cool if people could tag other users in comments and posts. Draft-js-plugins comes with a `mentions` plugin that we can just use, but the plugin needs to be set up appropriately. To do so, you will need to query the server for a list of users to pass the component, and make sure the UI for the component will work well. 

To implement this feature, you probably want to check out how the editor is implemented under `lesswrong/lib/editor` and then take a look at the draft-js-plugins documentation, in particular the mentions plugin: 

[](https://www.draft-js-plugins.com/plugin/mention)

This feature should be a reasonable first task in react or Apollo (GraphQL), so if you want to learn either of these, this might be a good place to start. It will also require some interaction with draft.js. 

### Pentesting

We want to import all the old data from the old Lesswrong page, including people's private messaging history, passwords and emails. But before we can do that, we want to make sure that our system is secure and won't allow anyone to get access to that private data. 

You can create some of your own user accounts, send messages back and forth, and see whether you can get access to these messages, or any other private information, from an account that doesn't have the necessary privileges. 

The first place I would start here is probably the GraphQL interface, which you can find under `[localhost:3000/graphiQL](http://localhost:3000/graphiQL)` , if you have your local server running, and which allows you to submit graphQL queries to the server. To figure out how to structure queries, the [GraphQL](http://graphql.com) documentation should help you out.
