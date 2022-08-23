Package.describe({
  name: 'vulcan:forms-upload',
  summary: 'Vulcan package extending vulcan:forms to upload images to Cloudinary from a drop zone.',
  version: '1.16.9',
  git: 'https://github.com/xavcz/nova-forms-upload.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.9', 'vulcan:forms@=1.16.9', 'fourseven:scss@4.12.0']);

  api.addFiles(['lib/Upload.scss'], 'client');

  api.mainModule('lib/modules.js', ['client', 'server']);
});
