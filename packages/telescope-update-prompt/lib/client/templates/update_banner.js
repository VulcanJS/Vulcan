Template[getTemplate('updateBanner')].helpers({
  showBanner: function () {
    return Session.get('updateVersion');
  },
  version: function () {
    return Session.get('updateVersion');
  },
  currentVersion: function () {
    return telescopeVersion;
  },
  message: function () {
    return Session.get('updateMessage');
  }
});