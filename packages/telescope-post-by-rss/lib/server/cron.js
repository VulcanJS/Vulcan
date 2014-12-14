SyncedCron.add({
  name: 'Post by RSS url',
  schedule: function(parser) {
    return parser.text('every 10 mins');
  }, 
  job: function() {
    fetchUrls();
  }
});
