# DraftJS Table Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

Usage:

```js
import createTablePlugin from 'draft-js-table-plugin';
import Editor from 'draft-js-plugins-editor';

const tablePlugin = createTablePlugin({
  Editor
});
```

Dependencies:

This plugin requires that the `draft-js-entity-props-plugin` is also applied to the `Editor`;
