import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addTemplates({
  test:                     Assets.getText("lib/server/email/templates/common/test.handlebars"),
  wrapper:                  Assets.getText("lib/server/email/templates/common/wrapper.handlebars"),
  newPost:                  Assets.getText("lib/server/email/templates/posts/newPost.handlebars"),
  newPendingPost:           Assets.getText("lib/server/email/templates/posts/newPendingPost.handlebars"),
  postApproved:             Assets.getText("lib/server/email/templates/posts/postApproved.handlebars"),
  newComment:               Assets.getText("lib/server/email/templates/comments/newComment.handlebars"),
  newReply:                 Assets.getText("lib/server/email/templates/comments/newReply.handlebars"),
  accountApproved:          Assets.getText("lib/server/email/templates/users/accountApproved.handlebars"),
  newUser:                  Assets.getText("lib/server/email/templates/users/newUser.handlebars"),
  newsletter:               Assets.getText("lib/server/email/templates/newsletter/newsletter.handlebars"),
  newsletterConfirmation:   Assets.getText("lib/server/email/templates/newsletter/newsletterConfirmation.handlebars"),
  postItem:                 Assets.getText("lib/server/email/templates/newsletter/postItem.handlebars"),
});