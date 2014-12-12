Template.parserPage.events
  'submit #parser-form': (e) ->
    e.preventDefault()
    jsonFeed = $('#parser-json-feed').val()

    Meteor.call 'parseFacebookFeed', jsonFeed, (error, result) ->
      if error?
        console.log 'Something went wrong.'
      else
        $('#parser-json-feed').val ''

