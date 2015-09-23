Meteor.startup(function () {

  FastRender.onAllRoutes(function(path) {

    var fr = this;

    Telescope.subscriptions.forEach(function (sub) {

      if (typeof sub === 'object'){

        fr.subscribe(sub.subName, sub.subArguments);

      }else{

        fr.subscribe(sub);

      }

    });

  });

});