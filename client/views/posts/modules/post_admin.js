Template[getTemplate('postMeta')].helpers({
  postsMustBeApproved: function () {
    return !!getSetting('requirePostsApproval');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  },
  short_score: function(){
    return Math.floor(this.score*1000)/1000;
  }, 
});