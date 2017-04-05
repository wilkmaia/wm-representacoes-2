// Define AngularJS module
var app = angular.module('app', ['ngRoute'])


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'MainController',
      controllerAs: 'vm'
    })
    .when('/representatives', {
      templateUrl: 'templates/representatives.html',
      controller: 'RepresentativesController',
      controllerAs: 'vm'
    })
    .when('/representeds', {
      templateUrl: 'templates/representeds.html',
      controller: 'RepresentedsController',
      controllerAs: 'vm'
    })
    .when('/clients', {
      templateUrl: 'templates/clients.html',
      controller: 'ClientsController',
      controllerAs: 'vm'
    })
    .when('/orders', {
      templateUrl: 'templates/orders.html',
      controller: 'OrdersController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    })
}])
