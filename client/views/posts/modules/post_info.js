Template[getTemplate('postInfo')].helpers({
  pointsUnitDisplayText: function(){
    return this.upvotes == 1 ? i18n.t('point') : i18n.t('points');
  },
  can_edit: function(){
    return canEdit(Meteor.user(), this);
  },
  ago: function(){
    // if post is approved show submission time, else show creation time.
    time = this.status == STATUS_APPROVED ? this.postedAt : this.createdAt;
    return time;
  },
  getTemplate: function() {
    return getTemplate("postAuthor");
  }
});