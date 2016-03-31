

function addThumbnailClass (postClass, post) {
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
}
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.add("postClass", addThumbnailClass);

function checkIfPreviouslyPosted (data) {
  Meteor.call("checkForDuplicates", data.url, function (error, result) {
    if (error) {
      Messages.flash(error.reason + '. <a href="'+FlowRouter.path("postPage", {_id: error.details})+'">'+__("go_to_post")+'</a>');  
    }
  });
  return data;
}
Telescope.callbacks.add("afterEmbedlyPrefill", checkIfPreviouslyPosted);


// Settings.addField([
//   {
//     fieldName: 'embedlyKey',
//     fieldSchema: {
//       type: String,
//       optional: true,
//       private: true,
//       autoform: {
//         group: 'embedly',
//         class: 'private-field'
//       }
//     }
//   },
//   {
//     fieldName: 'thumbnailWidth',
//     fieldSchema: {
//       type: Number,
//       optional: true,
//       autoform: {
//         group: 'embedly'
//       }
//     }
//   },
//   {
//     fieldName: 'thumbnailHeight',
//     fieldSchema: {
//       type: Number,
//       optional: true,
//       autoform: {
//         group: 'embedly'
//       }
//     }
//   }
// ]);