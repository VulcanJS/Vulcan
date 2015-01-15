Meteor.methods({
  humanizeUrl: function (url) {
    return Meteor.npmRequire('humanize-url')(url);
  },
  prependHttp: function(url){
    return Meteor.npmRequire('prepend-http')(url);
  },
});
