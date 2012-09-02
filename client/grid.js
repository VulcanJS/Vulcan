Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');
Meteor.subscribe('comments');

MyVotes = new Meteor.Collection('myvotes');
Meteor.subscribe('myvotes');

Session.set('state', 'list');



if (Meteor.is_client) {
    Meteor.startup(function () {
        $(document).ready(function (){
        	console.log($('#mobile-menu'));
	      $('#mobile-menu').pageslide({
		    iframe: false
		  });
		  
		  if($(window).width()>400){ //do not load social media plugin on mobile
		  	console.log($('.share-replace'));
		    $('.share-replace').sharrre({
		      share: {
		        googlePlus: true,
		        facebook: true,
		        twitter: true,
		      },
		      buttons: {
		        googlePlus: {size: 'tall'},
		        facebook: {layout: 'box_count'},
		        twitter: {count: 'vertical'},
		      },
		      enableHover: false,
		      enableCounter: false,
		      enableTracking: true
		    });
		  }
        });
    });
}
