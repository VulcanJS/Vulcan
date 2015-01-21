importRelease = function (number) {
  var releaseNotes = Assets.getText("releases/" + number + ".md");

  if (!Releases.findOne({number: number})) {

    release = {
      number: number,
      notes: releaseNotes,
      createdAt: new Date(),
      read: false
    }
    Releases.insert(release);

  } else {

    // if release note already exists, update its content in case it's been updated
    Releases.update({number: number}, {$set: {notes: releaseNotes}})
  
  }
};

Meteor.startup(function () {
  
  importRelease('0.11.0');
  importRelease('0.11.1');
  importRelease('0.12.0');
  importRelease('0.13.0');
  importRelease('0.14.0');
  
  // if this is before the first run, mark all release notes as read to avoid showing them
  if (!Events.findOne({name: 'firstRun'})) {
    var r = Releases.update({}, {$set: {read: true}}, {multi: true});
  }

});