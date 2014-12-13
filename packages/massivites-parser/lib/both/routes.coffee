Meteor.startup ->

  Router.onBeforeAction Router._filters.isAdmin,
    only: ['parserPage']

  AdminParserController = RouteController.extend
    template: getTemplate 'parserPage'
    fastRender: true

  Router.route '/parser',
    name: 'parserPage'
    controller: AdminParserController