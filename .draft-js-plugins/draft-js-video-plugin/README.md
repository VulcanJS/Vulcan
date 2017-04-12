# DraftJS Video Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin allows you to copy a video url and paste the Videos to your editor!
but default it handles youtube and vimeo, but you can always write your own logic to handle you desired video source see more details at advanced usage.
###Getting Started

npm install draft-js-video-plugin --save

Basic Usage:

```js
import createVideoPlugin from 'draft-js-video-plugin';

const videoPlugin = createVideoPlugin();
```