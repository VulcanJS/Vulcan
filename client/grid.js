Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');
Meteor.subscribe('comments');

MyVotes = new Meteor.Collection('myvotes');
Meteor.subscribe('myvotes');

Session.set('state', 'list');

if (Meteor.is_client) {
	SimpleRouter = FilteredRouter.extend({
		initialize: function() {
			FilteredRouter.prototype.initialize.call(this);
			this.filter(this.require_login, {only: ['submit']});
		},
		require_login: function(page) {
		  var username = Session.get('username');
		  if (username) {
		    return page;
		  } else {
		    return 'signin';
		  }
		},
		routes: {
		  '': 'top',
		  'test':'test',
		  'signin':'signin',
		  'signup':'signup',
		  'submit':'submit'
		},
		top: function() { console.log("top"); this.goto('top'); },
		test: function() {console.log("test");  this.goto('test'); },		
		signup: function() {console.log("signup");  this.goto('signup'); },
		signin: function() {console.log("signin");  this.goto('signin'); },
		submit: function() {console.log("submit");  this.goto('submit'); }
	});
  
	var Router = new SimpleRouter();
	Meteor.startup(function() {
		Backbone.history.start({pushState: true});
	});
}
  // Template.sign_in.events = {
  //   'submit form': function(e) {
  //     e.preventDefault();
  //     Session.set('username', $(event.target).find('[name=username]').val())
  //   }
  // }
  
  // Template.home.events = {
  //   'click .welcome': function(e) {
  //     e.preventDefault();
  //     Router.navigate('welcome', {trigger: true});
  //   }
  // }
  
  // Template.welcome.username = function() { return Session.get('username'); }
  // Template.welcome.events = {
  //   'click .logout': function(e) {
  //     e.preventDefault();
  //     Session.set('username', false);
  //   },
  //   'click .home': function(e) { 
  //     e.preventDefault();
  //     Router.navigate('', {trigger: true});
  //   }
  // }





// if (Meteor.is_client) {
//     Meteor.startup(function () {
//         $(document).ready(function (){
//         	console.log($('#mobile-menu'));
// 	      $('#mobile-menu').pageslide({
// 		    iframe: false
// 		  });
		  
// 		  if($(window).width()>400){ //do not load social media plugin on mobile
// 		  	console.log($('.share-replace'));
// 		    $('.share-replace').sharrre({
// 		      share: {
// 		        googlePlus: true,
// 		        facebook: true,
// 		        twitter: true,
// 		      },
// 		      buttons: {
// 		        googlePlus: {size: 'tall'},
// 		        facebook: {layout: 'box_count'},
// 		        twitter: {count: 'vertical'},
// 		      },
// 		      enableHover: false,
// 		      enableCounter: false,
// 		      enableTracking: true
// 		    });
// 		  }
//         });
//     });
// }
