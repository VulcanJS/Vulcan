# DraftJS Counter Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin adds character and word counting functionality to your editor!

## Usage

First instantiate the plugin:

```js
import createCounterPlugin from 'draft-js-counter-plugin';

const counterPlugin = createCounterPlugin();
```

Now get the `CharCounter`, `WordCounter`, and `LineCounter` components from the instance:

```JS
const { CharCounter, WordCounter, LineCounter } = counterPlugin;
```

Which take one prop:

1. `limit` (optional): a number in which the style of the text will change to reflect that the user is over the limit

Render them with those props and your editor now has counting functionality!

```HTML
<CharCounter editorState={ this.state.editorState } limit={200} />
<WordCounter editorState={ this.state.editorState } limit={30} />
<LineCounter editorState={ this.state.editorState } limit={10} />
```

## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-counter-plugin/lib/plugin.css`.

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
    import 'draft-js-counter-plugin/lib/plugin.css';
    ```
4. Restart Webpack.

### Browserify Usage

TODO: PR welcome
