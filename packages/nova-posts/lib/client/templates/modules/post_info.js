Template.post_info.helpers({
  pointsUnitDisplayText: function(){
    return this.upvotes === 1 ? __('point') : __('points');
  }
});
