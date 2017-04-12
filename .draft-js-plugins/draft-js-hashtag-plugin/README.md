# DraftJS Hashtag Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin highlights hashtags in the text!

## Usage

```js
import createHashtagPlugin from 'draft-js-hashtag-plugin';

const hashtagPlugin = createHashtagPlugin();
```

## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-hashtag-plugin/lib/plugin.css`.

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
    import 'draft-js-hashtag-plugin/lib/plugin.css';
    ```
4. Restart Webpack.


### Browserify Usage

TODO: PR welcome
