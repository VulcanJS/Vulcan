Migrations.add
  version: 1
  name: "Just a test."
  up: -> console.log "Inside migrations"

# @todo description field is still not being added
Migrations.add
  version: 2
  name: "Just a test."
  up: ->
    Posts.update
      description:
        $exists: false
      url: 
        $exists: true
    ,
      $set:
        description: 'Lorum Ipsum'
      $unset:
        url: 1
      multi: true

Meteor.startup ->
  # code to run on server at startup
  Migrations.migrateTo "latest"