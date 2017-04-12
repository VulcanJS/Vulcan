# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## To Be Released

### Added

- The plugin now accepts a `component` config and if provided this component will be rendered instead of the default Anchor tag. Thanks to @antoinerey.

## 1.0.1 - 2016-04-29

### Fix

- Linkify link email addresses or websites when they are placed inside parenthesis [#244](https://github.com/draft-js-plugins/draft-js-plugins/issues/244)

## 1.0.0 - 2016-04-20

### Changed

- Moved to a flat configuration. Instead of plugin properties (decorators & hooks) being stored within pluginProps they now moved to the root object. See the changes here [#150](https://github.com/draft-js-plugins/draft-js-plugins/pull/150/files) as well as the initial discussion here [#143](https://github.com/draft-js-plugins/draft-js-plugins/issues/143)
- Moved the option `theme` from an Immutable Map to a JavaScript object. This is more likely to become a standard.

### Added

- Added the ability to set a target attribute through `config.target`. The default value is `_self`.

### Fix

- Utilize the [linkify-it](https://github.com/markdown-it/linkify-it) library to generate smart href values for the resulting component e.g. `www.draft-js-plugins.com` will result in `http://www.draft-js-plugins.com`.

## 0.0.3 - 2016-03-25
### Released the first working version of DraftJS Linkify Plugin

It's not recommended to use the version 0.0.0 - 0.0.2
