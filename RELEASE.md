# Release process

## Updating

We try to respect semantic versioning as much as possible. Going from 1.13.1 to 1.13.2 should cause almost no breaking changes, except for packages version update, small tweaks, etc. Going from 1.13 to 1.14 could cause multiple breaking changes. Going from 1.x to 2.x is a full rework. 

Changes will be tracked in the changelog file.


### In Vulcan core repository

- If updating to a minor or major with non trivial breaking changes (1.13 to 1.14 for example), create a branch for the previous version based on master (1.13 in this example).
- Go to a `release/your-version` branch.
- Cleanup and reinstall everything 
- Run unit tests, and apply relevant fixes 
- Test that Storybook runs correctly
- Run tests, apply fixes if necessary

```sh
meteor reset && rm -Rf node_modules &&  meteor npm install
meteor npm run test
meteor npm run storybook
```

- Update packages versions in each package.
- Update package.json version.
- Update the CHANGELOG.md.

```sh
meteor npm run generate-changelog
```

- Merge release branch into `devel` (so that fixes from the release branch are shared) and then `master`.
- Go to `master` branch
- Create a tag for this version `git tag 1.x.x`.
- Push with `--tags` option: `git push && git push --tags`
- Deploy on Atmosphere

### In Vulcan-Starter

No need to maintain specific branches for versions, as the Starter is only meant to be used once for new projects initialization. 
We only use `devel` and `master` branches.

- Go to `devel` branch.
- Update Vulcan packages versions in `.meteor/packages`.
- Check that the packages are working as expected, solve breaking changes.
- Check that `package.json` versions matches Vulcan's `package.json`.
- Cleanup and reinstall everything 
- Run unit tests, and apply relevant fixes 
- Test that Storybook runs correctly

```sh
meteor reset && rm -Rf node_modules &&  meteor npm install
METEOR_PACKAGE_DIRS="X/Vulcan/packages" meteor npm run test
METEOR_PACKAGE_DIRS="X/Vulcan/packages" meteor npm run storybook
```

- Test different example packages.
- Merge devel in to  `master`.
- Update version `npm version patch` (for 1.16.1 > 1.16.2) or `npm version minor` for 1.16 > 1.17
- Push with `--tags`: `git push && git push --tags`.

### In the docs

- If updating to a minor or major with non trivial breaking changes (1.13 to 1.14 for example), create a branch for the previous version based on master (1.13 in this example).
- Do relevant updates on `devel` branch
- Merge into `master`
- Update the docs after packages are releved