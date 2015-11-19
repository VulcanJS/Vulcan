
//better add a select option with default one FSGrid and two others S3,...
//then when S3 is selected the filed for API key are shown! PS: better add a doc page for explaining how to set up S3 and CORS

Settings.addField([
  {
    fieldName: 's3',
    fieldSchema: {
      type: String,
      optional: true,
      autoform: {
        group: 'upload'
      }
    }
  },
  {
    fieldName: 's3APIKey',
    fieldSchema: {
      type: String,
      optional: true,
      private: true,
      autoform: {
        group: 'upload'
      }
    }
  },
  {
    fieldName: 's3APISecret',
    fieldSchema: {
      type: String,
      optional: true,
      private: true,
      autoform: {
        group: 'upload'
      }
    }
  }
]);

//FSGrid : not only it can be used to upload images but also video, audio and or any kind of files... 
//Note this is stored on MongoDB!! so better add a note in the setting to people using this as default like "If you intend to use FSGrid for your files upload please not it will take space in your MongoDB so better use S3 for unlimitted uploads and space!"

/**
 * Created by ucefkh on 5/26/2015.
 */

Files = new FS.Collection("files", {
  stores: [new FS.Store.GridFS("files",{path: "~/uploads"})],
  filter: {
    maxSize: 1048576, // in bytes  = 1 MB
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
      //TODO : retrict to spcific type of images since there is plenty of them and some file might be considred image yet contain some executables...
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        alert(message);
      } else {
        console.log(message);
      }
    }
  }
});

Files.allow({
  insert: function (userId, party) {
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  },
  download: function(userId, fileObj) {
    return true
  }
});

