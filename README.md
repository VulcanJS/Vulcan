# DraftJS Plugins

![Draft JS Plugins Logo](http://static.nikgraf.com/draft-js-plugins/draft-js-plugins.svg)

High quality plugins with great UX on top of [DraftJS](https://github.com/facebook/draft-js).

[![Build Status](https://travis-ci.org/draft-js-plugins/draft-js-plugins.svg?branch=master)](https://travis-ci.org/draft-js-plugins/draft-js-plugins)

## Important Note

We are currently preparing for a 2.0 release. The `master` branch contains these features. All the packages are already published with a beta tag. Install it via `$ npm install <plugin>@2.0.0-beta10 --save`.

## Roadmap

In case you are interested in helping [Issue #329](https://github.com/draft-js-plugins/draft-js-plugins/issues/329) contains a roadmap of what's coming in 2.0 and beyond.

## Available Plugins (incl. Docs)

- [Emoji](https://www.draft-js-plugins.com/plugin/emoji)
- [Stickers](https://www.draft-js-plugins.com/plugin/sticker)
- [Hashtags](https://www.draft-js-plugins.com/plugin/hashtag)
- [Linkify](https://www.draft-js-plugins.com/plugin/linkify)
- [Mentions](https://www.draft-js-plugins.com/plugin/mention)
- [Counter](https://www.draft-js-plugins.com/plugin/counter)
- [Undo](https://www.draft-js-plugins.com/plugin/undo)
- or build your own … :)

### Built by the community

- [Autolist](https://github.com/icelab/draft-js-autolist-plugin) by [Max Wheeler/Icelab](https://github.com/makenosound)
- [Block Breakout](https://github.com/icelab/draft-js-block-breakout-plugin) by [Max Wheeler/Icelab](https://github.com/makenosound)
- [Markdown Shortcuts](https://github.com/ngs/draft-js-markdown-shortcuts-plugin/) by [Atsushi Nagase](https://github.com/ngs)
- [Single Line](https://github.com/icelab/draft-js-single-line-plugin) by [Max Wheeler/Icelab](https://github.com/makenosound)
- [RichButtons](https://github.com/jasonphillips/draft-js-richbuttons-plugin) by [jasonphillips](https://github.com/jasonphillips)
- [Katex](https://github.com/letranloc/draft-js-katex-plugin) by [letranloc](https://github.com/letranloc)

## Live Example & Documentation

Checkout [the website](https://www.draft-js-plugins.com/)!

## Usage

First, install the editor with `npm`:

```
$ npm install draft-js-plugins-editor --save
```

To try out the beta version of 2.0.0 run

```
$ npm install draft-js-plugins-editor@2.0.0-beta10 --save
```

Then import the editor somewhere in your code and you're ready to go!

```js
import Editor from 'draft-js-plugins-editor';
```

## Documentation

### draft-js-plugins-editor

#### Editor

An editor component accepting plugins. [see source](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-plugins-editor/src/Editor/index.js#L16)

| Props                                          | Description  | Required
| -----------------------------------------------|:------------:| -------:|
| editorState                                    | [see here](https://facebook.github.io/draft-js/docs/api-reference-editor-state.html#content)| * |
| onChange                                       | [see here](https://facebook.github.io/draft-js/docs/api-reference-editor.html#onchange)| * |
| plugins                                        | an array of plugins |  |
| decorators                                     | an array of custom decorators |  |
| defaultKeyBindings                             | bool |  |
| defaultBlockRenderMap                          | bool |  |
| all other props accepted by the DraftJS Editor except decorator | [see here](https://facebook.github.io/draft-js/docs/api-reference-editor.html#props) |  |

Usage:

```js
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import { EditorState } from 'draft-js';

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();

const plugins = [
  hashtagPlugin,
  linkifyPlugin,
];

export default class UnicornEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }
}
```

#### How to write a Plugin

Feel free to copy any of the existing plugins as a starting point.In this repository you can also find a [Guide](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/HOW_TO_CREATE_A_PLUGIN.md) on how to create a plugin, including a description of the supported features. In addition you can contact [@nikgraf](https://github.com/nikgraf) directly in case you need help or simply open a Github Issue!

## Discussion and Support
Join the channel #draft-js-plugins after signing into the DraftJS [Slack organization](https://draftjs.herokuapp.com) or check out our collection of frequently asked questions here: [FAQ](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md).

## Development

Check out our [Contribution Guide](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/CONTRIBUTING.md).

## Learn about why Draft.js and how to use DraftJS Plugins

In this talk Nik Graf explained the ContentState structure of a Draft.js Editor as well as explained how to use plugins.

[<img width="450" src="http://img.youtube.com/vi/gxNuHZXZMgs/maxresdefault.jpg" >](https://www.youtube.com/watch?v=gxNuHZXZMgs)

## License

MIT
