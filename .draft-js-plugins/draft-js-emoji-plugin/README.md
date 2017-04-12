# DraftJS Emoji Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin provides consistent Emoji display across all platforms, independent of the host system.

## Usage

```js
import createEmojiPlugin from 'draft-js-emoji-plugin';

const emojiPlugin = createEmojiPlugin();
```
## Advanced Usage

```js
const emojiPlugin = createEmojiPlugin({
  priorityList: {
    ':see_no_evil:': ["1f648"],
    ':raised_hands:': ["1f64c"],
    ':100:': ["1f4af"],
  }
});
// emojis in priorityList will show up after user typed ':'
```
## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-emoji-plugin/lib/plugin.css`.

### Webpack Usage

Follow the below steps to import the css file by using Webpack's `style-loader` and `css-loader`. 

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
    import 'draft-js-emoji-plugin/lib/plugin.css';
    ```
4. Restart Webpack.


### Browserify Usage

TODO: PR welcome
