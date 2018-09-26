# Change Log
All notable changes to this project will be documented in this file. [*File syntax*](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0]
- New API, only providing a `getUser()` function on the server. Docs for setting up Apollo Server 2.0 and `apollo-boost`.

## [2.0.0]
- Basic support for Apollo Client 2.0 with `createApolloClient`, and drop support for Apollo Client 1.0

## [1.0.0] - 2017-07-27
### BREAKING CHANGE
- This package doesn't depend anymore on `graphql-server-express` but `apollo-server-express`. See this [blog post](https://dev-blog.apollodata.com/apollo-server-1-0-a-graphql-server-for-all-node-js-frameworks-2b37d3342f7c) 🚀

### Added
- Add support for an asynchronous context [#105](https://github.com/apollographql/meteor-integration/pull/105)

## [0.9.1] - 2017-05-27
### Changed
- Fix [#101](https://github.com/apollographql/core-docs/issues/101): return an empty object from `getUserContext` when nobody is authenticated.
- Fixes lint issue on `package.js` (from previous version)
- Automatic update of `.version` from latest Meteor version.

## [0.9.0] - 2017-05-27
### Changed
- Allow `context` option to be a function that accepts context with the current user, and returns final context.

## [0.8.0] - 2017-05-16
### Changed
- Remove NPM warnings: just make it fail early if you don't have dependencies installed.

## [0.7.2] - 2017-03-30
### Changed
- Invite the package's users to install `apollo-client@1.0.0`!

## [0.7.1] - 2017-03-30
### Changed
- Update dependencies: `apollo-client@1.0.0-rc.9` & `graphql-tools@0.11.0`

## [0.7.0] - 2017-03-22
### Changed
- No more `dataIdFromObject` pre-configuration: `apollo-client` does it for us.
- Fix accounts client-side: the login token is handled per request and not per client, by looking for it directly in the middleware.
- Fix options server-side (issue [#90](https://github.com/apollographql/core-docs/issues/90)).

# Removed
- Breaking: Subscriptions configuration are not any more handled in this package: this package is intended to *provide easy configuration of an Apollo client and its network interface to communicate with a GraphQL Express Server*. A new package is going to be created to configure GraphQL subscriptions in a Meteor context.

## [0.6.1] - 2017-03-18
### Changed
- Depends on latest `apollo-client`: version 1.0.0-rc.3. Also update `graphql-subscriptions` (note: dependency on this latter package should be removed on next release, see [discussion](https://github.com/apollographql/core-docs/pull/260)).

## [0.6.0] - 2017-03-16
### Changed
- Move logic code to `/src`.
- Use `rawCollection` method on `Meteor.users` for the current user lookup, to allow the tests to pass (also no need to wrap the GraphQL server in `Meteor.bindEnvironment` as it no more a Fibers-aware code). 

### Added
- Set up ESLint with prettier & Meteor settings.
- Provide `handleDone` utility for asynchronous tests which to catch errors.
- Handle GraphQL subscriptions client-side with the option `enableSubscriptions` on `createMeteorNetworkInterface` & start a websocket server if a `pubsub` mechanism is passed along the `schema` to `createApolloServer`.

## [0.5.0] - 2017-03-03
### Changed
- Breaking: Use latest NPM dependencies, especially `apollo-cient@1.0.0-rc.0`.
- Provide a middleware handling (`apply(Batch)Middleware`), related to  `apollo-client@1.0.0-rc.0`.
- In tests, use `print` from `graphql` itself and not from `graphql-tag`, related to `graphql-tag@1.3` & upcoming `graphql-tag@2.0`.


## [0.4.1] - 2017-02-27
### Changed
- Pass `batchingInterval` to the batching network interface if configured to used it in `createMeteorNetworkInterface`.
- Move `networkInterface` configuration with `createMeteorNetworkInterface()` from the `defaultClientConfig` to the `meteorClientConfig` function, so that it's only executed when needed and not on startup too...

## [0.4.0] - 2017-02-26
### Changed

- The argument to `meteorClientConfig()` was changed: `meteorClientConfig(networkInterfaceConfig)` -> `meteorClientConfig(customClientConfig)`. If you previously did `meteorClientConfig({ batchingInterface: false })`, it should be changed to:
- Don't force `meteor/apollo` to update their NPM dependencies on Graphql-related packages, clean-up the User Accounts middleware [#74](https://github.com/apollographql/meteor-integration/pull/74)

```js
meteorClientConfig({
  networkInterface: createMeteorNetworkInterface({ batchingInterface: false })
});
```

### Added

-  Make it possible to extend the default Apollo Client & network interface configuration objects with any Apollo Client & interface options (+ some tests) [#70](https://github.com/apollographql/meteor-integration/pull/70)


- Don't force `meteor/apollo` to update their NPM dependencies on Graphql-related packages, clean-up the User Accounts middleware [#74](https://github.com/apollographql/meteor-integration/pull/74)

## [0.3.1]
### Fixed

- Fixed bug in `v0.3.0` [#69](https://github.com/apollographql/meteor-integration/issues/69)

## [0.3.0] - 2017-02-08
AKA The Xavier Release 👍

### Updated

- `apollo-client` [`^0.7.0 || ^0.8.0'`](https://github.com/apollographql/apollo-client/blob/master/CHANGELOG.md#080)
- `apollo-server-express` [`^0.5.0`](https://github.com/apollographql/graphql-server/blob/master/CHANGELOG.md#v050)

### Added

- Export `createMeteorNetworkInterface` and `meteorClientConfig` server-side to allow server-side rendering, accept a `loginToken` option in the config of Apollo Client (for example the cookie from `meteorhacks:fast-render` used for SSR) [#57](https://github.com/apollostack/meteor-integration/pull/57)
- Tests! [#63](https://github.com/apollographql/meteor-integration/pull/63) and [#68](https://github.com/apollographql/meteor-integration/pull/68)

## [0.2.1] - 2016-12-23
### Added

- Support for `v0.8.x` of `graphql` [#54](https://github.com/apollostack/meteor-integration/pull/54)
- When user is not logged in, provide `{}` as context [#55](https://github.com/apollostack/meteor-integration/pull/55)

## [0.2.0] - 2016-11-04
### Updated

- `apollo-client` [v0.5.x](https://github.com/apollostack/apollo-client/blob/master/CHANGELOG.md#v050)
- Updated createNetworkInterface call to match new signature ([@jasonphillips](https://github.com/jasonphillips) in [#43](https://github.com/apollostack/meteor-integration/pull/43)).
- `graphql-server` [v0.4.2](https://github.com/apollostack/graphql-server/blob/master/CHANGELOG.md#v042)

### Added

- Added the logged-in user's doc to `context.user`

## [0.1.2] - 2016-10-04
### Added

- Pass a function to configure the express server in createApolloServer ([@nicolaslopezj](https://github.com/nicolaslopezj) in [#32](https://github.com/apollostack/meteor-integration/pull/32)).
- Automatically pass Meteor authentication in GraphiQL ([@nicolaslopezj](https://github.com/nicolaslopezj) in [#35](https://github.com/apollostack/meteor-integration/pull/35)).

## [0.1.1] - 2016-09-21
### Fixed

- Fix userId persisting in options.context (reported in [#37](https://github.com/apollostack/meteor-integration/pull/37))

## [0.1.0] - 2016-09-09
### Updated

- `apollo-server` [v0.2.x](https://github.com/apollostack/apollo-server/blob/cc15ebfb1c9637989e09976c8416b4fd5c2b6728/CHANGELOG.md)
  - Updated interface to reflect `apollo-server` refactor.
- `apollo-client` [v0.4.x](https://github.com/apollostack/apollo-client/blob/master/CHANGELOG.md#v040)

## [0.0.4] - 2016-08-24
### Fixed

- Fixed global auth issue

## [0.0.2] - 2016-06-17
### Fixed

- Fix dependencies #17
