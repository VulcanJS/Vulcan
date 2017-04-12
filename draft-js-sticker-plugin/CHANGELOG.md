# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## To Be Released

### Added

- `blockRenderMap` for sticker custom block tyoe, the plugin should be responsible for its own block type rendering mapping.

## 1.0.0 - 2016-04-20

### Changed

- Moved to a flat configuration. Instead of plugin properties (decorators & hooks) being stored within pluginProps they now moved to the root object. See the changes here [#150](https://github.com/draft-js-plugins/draft-js-plugins/pull/150/files) as well as the initial discussion here [#143](https://github.com/draft-js-plugins/draft-js-plugins/issues/143)
- Moved the option `theme` from an Immutable Map to a JavaScript object. This is more likely to become a standard.

## 0.0.3 - 2016-03-25
### Released the first working version of DraftJS Sticker Plugin

It's not recommended to use the version 0.0.0 - 0.0.2
