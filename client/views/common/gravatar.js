Template[getTemplate('gravatar')].helpers({
  gravatarUrl: function () {
    return getAvatarUrl(this.email);
  },
  cssClass: function(){
    if (this.class){
        return this.class;
    }
    return 'user-avatar';
  }
});