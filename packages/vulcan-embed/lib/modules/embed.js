import { registerSetting } from 'meteor/vulcan:core';

const Embed = {};

registerSetting('thumbnailWidth', 400, 'Image thumbnails width');
registerSetting('thumbnailHeight', 300, 'Image thumbnails height');

export default Embed;