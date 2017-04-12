# DraftJS Linkify Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin turns hyperlinks in the text to highlighted, clickable anchor tags!

## Usage

```js
import createLinkifyPlugin from 'draft-js-linkify-plugin';

const linkifyPlugin = createLinkifyPlugin();
```

You may also optionally set the target value for the resulting `<a>` tag:

```js
const linkifyPlugin = createLinkifyPlugin({
  target: '_blank'  // default is '_self'
});
```

## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-linkify-plugin/lib/plugin.css`.

### Webpack Usage

### Webpack Usage
Follow the steps below to import the css file by using Webpack's `style-loader` and `css-loader`. 

1. Install Webpack loaders: `npm install style-loader css-loader --save-dev`
2. Add the below section to Webpack config (if your Webpack already has loaders array, simply add the below loader object(`{test:foo, loaders:bar[]}`) as an item in the array).

    ```js
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: [
          'style', 'css'
        ]
      }]
    }
    ```

3. Add the below import line to your component to tell Webpack to inject style to your component.

    ```js
    import 'draft-js-linkify-plugin/lib/plugin.css';
    ```
4. Restart Webpack.


### Browserify Usage

TODO: PR welcome
