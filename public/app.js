// Define AngularJS module
var app = angular.module('app', ['ngRoute'])

// Set app's controller for home.html page
app.controller('MainController', function($http) {
  var vm = this
  vm.spinning = true
})


app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'MainController',
    controllerAs: 'vm',
    templateUrl: 'home.html'
  })
})
