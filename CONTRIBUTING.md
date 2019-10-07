## Etiquette

- **All PRs should be made to the `devel` branch, not `master`.**

- Come check-in in the [Vulcan Slack channel](http://slack.telescopeapp.org/). 👋

- Completely new features should be shipped as external packages with their own repos (see [3rd party packages](https://docs.vulcanjs.org/plugins.html)). Don't hesitate to come by the [Slack channel](http://slack.telescopeapp.org/) to speak about it.

- ~~We don't have test at the moment, and Travis integration is broken. If you know how to fix it, you are welcome (see [#1253](https://github.com/TelescopeJS/Telescope/issues/1253)!~~ We are making progress on testing! Running `npm run test` will trigger client side and server side unit tests. Running `npm run test-client` or `npm run test-server` will run tests for a specific environnement. Using the `MOCHA_GREP` environment variable, you can run only tests matching some regular expression (eg `MOCHA_GREP="vulcan:core" npm run test-server`). Pull requests coming with automated tests will be greatly appreciated!

- Be nice 😉

## Branches

- `master` branch matches the latest version published on Atmosphere
- `devel` branch is the bleeding edge
- 1.X branch tracks a previous version of Vulcan (eg 1.13 may correspond to 1.13.2, 1.11 to 1.11.6, etc.). Those branches are only meant for publishing critical security fixes.
