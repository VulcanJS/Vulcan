importRelease = function (number) {
  if (!Releases.findOne({number: number})) {
    var releaseNotes = Assets.getText("releases/" + number + ".md");
    release = {
      number: number,
      notes: releaseNotes,
      createdAt: new Date(),
      read: false
    }
    Releases.insert(release);
  }
};

Meteor.startup(function () {
  
  importRelease('0.11.0');
  importRelease('0.11.1');
  importRelease('0.11.2');

  // if this is before the first run, mark all release notes as read to avoid showing them
  if (!Events.findOne({name: 'firstRun'})) {
    var r = Releases.update({}, {$set: {read: true}}, {multi: true});
  }

});