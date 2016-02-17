Template.post_info.helpers({
  pointsUnitDisplayText: function(){
    return this.upvotes === 1 ? i18n.t('point') : i18n.t('points');
  }
});
