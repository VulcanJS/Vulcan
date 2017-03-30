# nova-upload
🏖🔭 Vulcan package extending `vulcan:forms` to upload images to Cloudinary from a drop zone.


![Screenshot](https://res.cloudinary.com/xavcz/image/upload/v1471534203/Capture_d_e%CC%81cran_2016-08-17_14.22.14_ehwv0d.png)

Want to add this to your Vulcan instance? Read below:

# Installation

### 1. Meteor package
I would recommend that you clone this repo in your vulcan's `/packages` folder.

Then, open the `.meteor/packages` file and add at the end of the **Optional packages** section:
`xavcz:nova-forms-upload` 

> **Note:** This is the version for Nova 1.0.0, running with GraphQL. *If you are looking for a version compatible with Nova "classic", you'll need to change the package's branch, like below. Then, refer to [the README for `nova-forms-upload` on Nova Classic](https://github.com/xavcz/nova-forms-upload/blob/nova-classic/README.md#installation)*

```bash
# only for Nova classic users (v0.27.5)
cd nova-forms-upload
git checkout nova-classic
```

### 2. NPM dependency
This package depends on the awesome `react-dropzone` ([repo](https://github.com/okonet/react-dropzone)), you need to install the dependency:
```
npm install react-dropzone isomorphic-fetch
```

### 3. Cloudinary account
Create a [Cloudinary account](https://cloudinary.com) if you don't have one.

The upload to Cloudinary relies on **unsigned upload**:

> Unsigned upload is an option for performing upload directly from a browser or mobile application with no authentication signature, and without going through your servers at all. However, for security reasons, not all upload parameters can be specified directly when performing unsigned upload calls.

Unsigned upload options are controlled by [an upload preset](http://cloudinary.com/documentation/upload_images#upload_presets), so in order to use this feature you first need to enable unsigned uploading for your Cloudinary account from the [Upload Settings](https://cloudinary.com/console/settings/upload) page.

When creating your **preset**, you can define image transformations. I recommend to set something like 200px width & height, fill mode and auto quality. Once created, you will get a preset id.

It may look like this:

![Screenshot-Cloudinary](https://res.cloudinary.com/xavcz/image/upload/v1471534183/Capture_d_e%CC%81cran_2016-08-18_17.07.52_tr9uoh.png)

### 4. Nova Settings
Edit your `settings.json` and add inside the `public: { ... }` block the following entries with your own credentials:

```json
public: {


  "cloudinaryCloudName": "YOUR_APP_NAME",
  "cloudinaryPresets": {
    "avatar": "YOUR_PRESET_ID",
    "posts": "THE_SAME_OR_ANOTHER_PRESET_ID"
  }


}
```

Picture upload in Nova is now enabled! Easy-peasy, right? 👯

### 5. Your custom package & custom fields

Make your custom package depends on this package: open `package.js` in your custom package and add `xavcz:nova-forms-upload` as a dependency, near by the other `nova:xxx` packages.

You can now use the `Upload` component as a classic form extension with [custom fields](https://www.youtube.com/watch?v=1yTT48xaSy8) like `nova:forms-tags` or `nova:embedly`.

**⚠️ Note:** Don't forget to update your query fragments wherever needed after defining your custom fields, else they will never be available!

## Image for posts
Let's say you want to enhance your posts with a custom image. In your custom package, your new custom field could look like this:

```js
// ... your imports
import { getComponent, getSetting } from 'meteor/nova:lib';
import Posts from 'meteor/nova:posts';

// extends Posts schema with a new field: 'image' 🏖
Posts.addField({
  fieldName: 'image',
  fieldSchema: {
    type: String,
    optional: true,
    control: getComponent('Upload'),
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
    form: {
      options: {
        preset: getSetting('cloudinaryPresets').posts // this setting refers to the transformation you want to apply to the image
      },
    }
  }
});
```

## Avatar for users
Let's say you want to enable your users to upload their own avatar. In your custom package, your new custom field could look like this:
```js
// ... your imports
import { getComponent, getSetting } from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// extends Users schema with a new field: 'avatar' 👁
Users.addField({
  fieldName: 'avatar',
  fieldSchema: {
    type: String,
    optional: true,
    control: getComponent('Upload'),
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
    preload: true, // ⚠️ will preload the field for the current user!
    form: {
      options: {
        preset: getSetting('cloudinaryPresets').avatar // this setting refers to the transformation you want to apply to the image
      },
    }
  }
});
```

Adding the opportunity to upload an avatar comes with a trade-off: you also need to extend the behavior of the `Users.avatar` methods. You can do this by adding this snippet, in `custom_fields.js` for instance:

```js
const originalAvatarConstructor = Users.avatar;

// extends the Users.avatar function
Users.avatar = {
  ...originalAvatarConstructor,
  getUrl(user) {
    url = originalAvatarConstructor.getUrl(user);

    return !!user && user.avatar ? user.avatar : url;
  },
};
```

Now, you also need to update the query fragments related to `User` when you want the custom avatar to show up :)

## S3? Google Cloud?
Feel free to contribute to add new features and flexibility to this package :)

You are welcome to come chat about it [on the Nova Slack chatroom](http://slack.telescopeapp.org)

## What about `nova:cloudinary` ?
This package and `nova:cloudinary` share a settings in common: `cloudinaryCloudName`. They are fully compatible.

Happy hacking! 🚀
