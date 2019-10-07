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

## Updating

We try to respect semantic versioning as much as possible. Going from 1.13.1 to 1.13.2 should cause almost no breaking changes, except for packages version update, small tweaks, etc. Going from 1.13 to 1.14 could cause multiple breaking changes. Going from 1.x to 2.x is a full rework. 

Changes will be tracked in the changelog file.


### In Vulcan core repository

- If updating to a minor or major with non trivial breaking changes (1.13 to 1.14 for example), create a branch for the previous version based on master (1.13 in this example).
- Go to a `release/your-version` branch.
- Update packages versions in each package.
- Update the CHANGELOG.md.
- Update package.json version. 
- Merge `devel` into `master`.
- Run tests, apply fixes if necessary
- Create a tag for this version `git tag 1.x.x`.
- Push with `--tags` option: `git push --tags`
- Deploy on Atmosphere

### In Vulcan-Starter

No need to maintain specific branches for versions, as the Starter is only meant to be used once for new projects initialization. 
We only use `devel` and `master` branches.

- Go to `devel` branch.
- Update Vulcan packages versions in `.meteor/packages`.
- Check that the packages are working as expected, solve breaking changes.
- Check that `package.json` versions matches Vulcan's `package.json`.
- Merge devel in to  `master`.
- Create a tag for this version.
- Push with `--tags`.