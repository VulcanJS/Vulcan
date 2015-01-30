Template[getTemplate('user_friends')].helpers({
  // userProfileDisplay: function () {
  //   return userProfileDisplay;
  // },
  // getTemplate: function () {
  //   return getTemplate(this.template);
  // }
});

Template[getTemplate('user_friends')].rendered = function () {
	$('.ui.mini.statistic').popup();
	$('.friend-name-link').popup();

	$('.friends .card .dimmer').dimmer({ on: 'hover' });

	$('.avatar-hide-initials').each(function(a){
		var src = $('img.avatar-image').attr('src');
		$(this).replaceWith('<img src='+src+'>');
	});
};