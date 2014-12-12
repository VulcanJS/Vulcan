Template.parserPage.events
  'submit #parser-form': (e) ->
    e.preventDefault()
    jsonFeed = $('#parser-json-feed').val()

    Meteor.call 'parseFacebookFeed', jsonFeed

