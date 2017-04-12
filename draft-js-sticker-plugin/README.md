# DraftJS Sticker Plugin

[![Unicorn Approved](https://img.shields.io/badge/draft--js-%E2%99%A5_unicorns-ff69b4.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACLlBMVEUAAAAAAAAA%2F%2F%2F%2F%2F%2F8AgICAgID%2FgP9VqlWqqqpAQEBAQICAgIC%2Fv78AAACZZpn%2FzP8AAABVVYBNTU0AAAAAAAAAAAAAAAAAABQAAAAAAAAAAAA8PEpXQ0oAAABpYmJ5c3kAAAAAAAAAAAAAAACZe6a7rr8ASxubeKKPj4tjTU1XKVdMfIFTM2xgQnihpZ9%2BWE7Jtc1CR3pbOWZTOVNWI1ZkiW54e3WHaFmbjnuUr69%2BW12cc3evi4%2B%2BmsHjx%2BWcv8SikK9JQmDWvNixiJDApL%2F14fVZRmuZiqaZkqediKTUudW0jaGEmJGwg4qxho6tt8RrT3WCUYG4mqR5i5rexd9gV4R5VHjNsdLOrtL%2F%2F%2F%2Bgiqahmba%2Fvr7Hv8LXwNfbz%2BH5%2Bvz5%2B%2Fz7%2FPz%2F%2F%2F%2Bvk7Szr7rFqco7PDzSuNHb1%2BX9%2Fv2OkLOSg52TgZ%2Bci6ehfa%2Bke5KotKawpre6ucG7qsTFxsXGpJnIxcDYzN7d2ufd4t%2Fk5Ozm6e7u8O7y9PL19fX3%2BPv%2B%2Fv3%2F%2F%2F99Vn2ZkbCdZpqil5aki6ulgrCpq8Wup8SysL62nZK9mbvBrMrCscjCytfGr87HqJnHwNjH18zH2dDLqL3OprrOz%2BPSrcLTutnVt9LV0%2BLX0cvX0uPX0uXYuNLZ1eTcu%2BDc6Ove4%2Bnk4efl5eXl5%2Bnl5%2Broy%2Bnpzerp6PLt7fbt7vTuz%2FD39%2Fj3%2BPf6%2B%2Fv84fz8%2FPz9%2Ff39%2F%2F79%2F%2F%2F%2B%2Fv7%2F%2F%2F7%2F%2F%2F%2Bs7OxmAAAAg3RSTlMAAQEBAgICAwMEBAQEBQUFBgYKCxESFRkaHB8mJicnKisxMjw8PEFCRF1ea293d32JjJSZoLO1tbfDzM7P0dHU2Nng4eLi4%2BPj4%2BPm5%2Bfo6%2Bzt7fDx9fX1%2BPr7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2FPz8%2Ff39%2Ff7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2FheBNM0AAAEESURBVHgBHclje5thAIDRO8uyZVtmu7Zt27Zt201t27aRPv%2Bu79Xz9cC%2F%2FzxT8fvrH2PkL5B8d7AAHJ0sR41ACQp%2BhHnqf3DbjJlO9zDkPbziV%2Byye0Fdf0PjcaIektdoR%2FfVtHesVadcJ1khUWE%2Fm78nREtZ3nYc8BKDOXWn0GjEQcW5DyDHWaQVXopbcVF%2B5A9vMN3J3a%2B%2F0VzdHdYOhPCcn5H33UIIddvkbtdIAEqsF5MfSnKyzoZKV1tPg%2BCTd29x9snGTGr88FbzeiB8iRqsHPcyN9OymcpsmghGgW1Pgt03wGQso2jFDxlvdf%2FCu4%2FoVC3NL4TyRCGT4rNLhG%2B46yMRykvKLgts6QAAAABJRU5ErkJggg%3D%3D)](https://www.youtube.com/watch?v=9auOCbH5Ns4)

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin allows you to add stickers to your editor!

Usage:

```js
import createStickerPlugin from 'draft-js-sticker-plugin';

const stickerPlugin = createStickerPlugin({ stickers });
const { StickerSelect } = stickerPlugin;
```

## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-sticker-plugin/lib/plugin.css`.

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
    import 'draft-js-sticker-plugin/lib/plugin.css';
    ```
4. Restart Webpack.

### Browserify Usage

TODO: PR welcome

## Exported functions

| Props                                          | Description
| -----------------------------------------------|------------:|
| add(editorState: Object, stickerId: any) | add a Sticker ContentBlock after the current Selection|
| remove(editorState: Object, blockKey: String) | removes a Sticker ContentBlock|
| Sticker | the default Sticker Component |
| StickerSelect | a basic StickerSelector |
