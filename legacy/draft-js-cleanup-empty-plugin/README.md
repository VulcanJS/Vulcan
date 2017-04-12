# DraftJS Cleanup Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

Usage:

```js
import createCleanupEmptyPlugin from `draft-js-cleanup-empty-plugin`;

const cleanupPlugin = createCleanupEmptyPlugin({
  types: []
});
```

Dependencies:

This plugin requires that the `draft-js-entity-props-plugin` is also applied to the `Editor`;
