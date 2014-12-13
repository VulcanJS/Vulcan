Template.parserPage.events
  'submit #parser-form': (e) ->
    e.preventDefault()
    input = $('#parser-json-feed')
    jsonFeed = input.val()

    Meteor.call 'parseFacebookFeed', jsonFeed, (error, result) ->
      if error?
        alert "Something went wrong: #{error.reason}"
      else
        alert "Done!\n- New users: #{result.newUsers}\n- Updated users: #{result.updatedUsers}\n- New posts: #{result.newPosts}\n- Updated posts: #{result.updatedPosts}\n- Changed/new comments: #{result.changedComments}"
      input.val ''