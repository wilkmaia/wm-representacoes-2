HomeController = require 'controllers/home'
RepresentativesController = require 'controllers/representants'
RepresentedsController = require 'controllers/representeds'
ClientsController = require 'controllers/clients'
OrdersController = require 'controllers/orders'


app = angular.module 'wm-app', ['ngRoute']

app.config [
  '$routeProvider', ($routeProvider) ->
    $routeProvider
      .when '/home',
        templateUrl: 'partials/home.html'
        controller: HomeController
      .when '/representants',
        templateUrl: 'partials/representants.html'
        controller: RepresentativesController
      .when '/representeds',
        templateUrl: 'partials/representeds.html'
        controller: RepresentedsController
      .when '/clients',
        templateUrl: 'partials/clients.html'
        controller: ClientsController
      .when '/orders',
        templateUrl: 'partials/orders.html'
        controller: OrdersController
      .otherwise
        redirectTo: '/home'
]
