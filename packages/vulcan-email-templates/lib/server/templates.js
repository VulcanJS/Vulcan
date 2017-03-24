import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addTemplates({
  test:                     Assets.getText("lib/server/emails/common/test.handlebars"),
  wrapper:                  Assets.getText("lib/server/emails/common/wrapper.handlebars"),
  newPost:                  Assets.getText("lib/server/emails/posts/newPost.handlebars"),
  newPendingPost:           Assets.getText("lib/server/emails/posts/newPendingPost.handlebars"),
  postApproved:             Assets.getText("lib/server/emails/posts/postApproved.handlebars"),
  newComment:               Assets.getText("lib/server/emails/comments/newComment.handlebars"),
  newReply:                 Assets.getText("lib/server/emails/comments/newReply.handlebars"),
  accountApproved:          Assets.getText("lib/server/emails/users/accountApproved.handlebars"),
  newUser:                  Assets.getText("lib/server/emails/users/newUser.handlebars"),
  newsletter:               Assets.getText("lib/server/emails/newsletter/newsletter.handlebars"),
  newsletterConfirmation:   Assets.getText("lib/server/emails/newsletter/newsletterConfirmation.handlebars"),
  postItem:                 Assets.getText("lib/server/emails/newsletter/postItem.handlebars"),
});