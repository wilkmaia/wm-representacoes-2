// Define AngularJS module
var app = angular.module('app', ['ngRoute'])

// Set app's controller for home.html page
app.controller('MainController', function($scope, $http) {
  var vm = this
  vm.representeds = []
  represented = {}
  vm.states = []
  vm.cities = []
  vm.detailed = false

  /**
   * Gets all representeds on database
   */
  vm.getAll = function() {
    $http.get('/api/represented/').then(function(res) {
      vm.representeds = res.data
    })
  }

  /**
   * Add new represented to database
   * @param represented
   */
  vm.add = function(represented) {
    if (represented) {
      $http.post('/api/represented/add/', represented).then(function(res) {
        if (res.data.status === 'success') {
          vm.getAll()
          vm.represented = {}
          vm.addFlag = false
        }
        else {
          console.log(res)
        }
      })
    }
  }

  /**
   * Remove represented from database
   * @param represented
   */
  vm.remove = function(represented) {
    if (represented) {
      if (confirm('Realmente deseja remover a representada "' + represented.empresa.nome_fantasia + '"?') === false) {
        return
      }
      $http.delete('/api/represented/delete/' + represented._id).then(function(res) {
        if (res.data.status === 'success') {
          vm.getAll()
        }
        else {
          console.log(res)
        }
      })
    }
  }

  /**
   * Update represented's data on database
   * @param represented
   */
  vm.update = function(represented) {
    if (represented) {
      for (var idx = 0; idx < represented.contato.length; ++idx) {
        el = represented.contato[idx]

        if (Object.keys(el).length === 0) {
          represented.contato.splice(idx, 1)
        }
      }

      $http.put('/api/represented/update', represented).then(function(res) {
        if (res.data.status !== 'success') {
          console.log(res)
        }
        else {
          vm.detailed = false
          vm.representeds[vm.currentIdx] = JSON.parse(JSON.stringify(vm.currentRepresented))
          vm.currentRepresented = {}
          vm.maxContacts = 1
        }
      })
    }
  }

  /**
   * Gets details of specific represented
   * @param represented
   */
  vm.showDetails = function(represented) {
    vm.detailed = true

    represented.endereco.estado = String(represented.endereco.estado)
    vm.getCities(represented.endereco.estado)
    represented.endereco.cidade = String(represented.endereco.cidade)

    represented.contato.forEach(function(contact) {
      contact.tipo = String(contact.tipo)
    })


    vm.maxContacts = represented.contato.length

    // Deep clone object
    vm.currentRepresented = JSON.parse(JSON.stringify(represented))
    vm.currentIdx = vm.representeds.indexOf(represented)
  }

  /**
   * Gets list of states
   */
  vm.getStates = function() {
    $http.get('/api/geo/states').then(function(res) {
      vm.states = res.data
    })
  }

  /**
   * Gets list of cities from specific state
   * @param state_code
   */
  vm.getCities = function(state_code) {
    $http.get('/api/geo/cities/' + state_code).then(function(res) {
      vm.cities = res.data
    })
  }

  /**
   * Defines current state and lists cities accordingly
   * @param state_code
   */
  vm.setCurrentState = function(state_code) {
    vm.getCities(state_code)
  }

  /**
   * Checks if the Add button should be enabled or not for represented "o"
   * @param o
   * @returns true if enable button should be enabled
   */
  vm.enableAddButton = function(o) {
    if (o === undefined || o.contato === undefined || o.endereco === undefined)
      return false

    // Check if required fields are ok
    return o.empresa.nome_fantasia && o.empresa.cnpj && o.empresa.razao_social && o.endereco.principal && o.comissao &&
      o.endereco.bairro && o.endereco.cep && o.endereco.estado && o.endereco.cidade && o.empresa.insc_estadual
  }

  /**
   * Remove contact number "n" from represented "o"
   * @param o
   * @param n
   */
  vm.removeContact = function(o, n) {
    o.contato.splice(n-1, 1)
    --vm.maxContacts
  }

  /**
   * Resets unsaved info from detailed view
   */
  vm.cancelDetailedView = function() {
    vm.detailed = false
    vm.currentRepresented = {}
    vm.maxContacts = 1
  }

  /**
   * Range generator from "min" to "max" with step "step"
   * @param min
   * @param max
   * @param step
   * @returns range array
   */
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  }


  // Initialization
  // Get list of states and all representeds' data
  vm.getStates()
  vm.getAll()
})


app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'MainController',
    controllerAs: 'vm',
    templateUrl: 'home.html'
  })
})
