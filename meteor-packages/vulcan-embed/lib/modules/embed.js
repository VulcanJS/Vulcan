import { registerSetting } from 'meteor/vulcan:core';

export const Embed = {};

registerSetting('thumbnailWidth', 400, 'Image thumbnails width');
registerSetting('thumbnailHeight', 300, 'Image thumbnails height');