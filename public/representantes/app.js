// Define AngularJS module
var app = angular.module('app', ['ngRoute'])

// Set app's controller for home.html page
app.controller('MainController', function($scope, $http) {
  var vm = this
  vm.representatives = []
  representative = {}
  vm.states = []
  vm.cities = []
  vm.detailed = false

  vm.getAll = function() {
    $http.get('/api/representative/').then(function(res) {
      vm.representatives = res.data
    })
  }

  vm.add = function(representative) {
    if (representative) {
      representative.contato.nome = representative.nome
      representative.acesso = Number(representative.acesso)
      $http.post('/api/representative/add/', representative).then(function(res) {
        if (res.data.status === 'success') {
          vm.getAll()
          vm.representative = {}
          vm.addFlag = false
        }
        else {
          console.log(res)
        }
      })
    }
  }

  vm.remove = function(representative) {
    if (representative) {
      if (confirm('Realmente deseja remover o representante >> ' + representative.nome + ' << ?') === false) {
        return
      }
      $http.delete('/api/representative/delete/' + representative._id).then(function(res) {
        if (res.data.status === 'success') {
          vm.getAll()
        }
        else {
          console.log(res)
        }
      })
    }
  }

  vm.update = function(representative) {
    if (representative) {
      for (var idx = 0; idx < representative.contato.length; ++idx) {
        el = representative.contato[idx]

        if (Object.keys(el).length === 0) {
          representative.contato.splice(idx, 1)
        }
      }

      $http.put('/api/representative/update', representative).then(function(res) {
        if (res.data.status !== 'success') {
          console.log(res)
        }
        else {
          vm.detailed = false
          vm.currentRepresentative = {}
          vm.maxContacts = 1
        }
      })
    }
  }

  vm.showDetails = function(representative) {
    vm.detailed = true
    representative.senha2 = representative.senha
    representative.acesso = String(representative.acesso)
    representative.endereco.estado = String(representative.endereco.estado)
    vm.getCities(representative.endereco.estado)
    representative.endereco.cidade = String(representative.endereco.cidade)
    representative.contato.forEach(function(contact) {
      contact.tipo = String(contact.tipo)
    })

    vm.maxContacts = representative.contato.length

    vm.currentRepresentative = representative
    vm.currentRepresentative._previousMaxContacts = vm.maxContacts
  }

  vm.getStates = function() {
    $http.get('/api/geo/states').then(function(res) {
      vm.states = res.data
    })
  }

  vm.getCities = function(state_code) {
    $http.get('/api/geo/cities/' + state_code).then(function(res) {
      vm.cities = res.data
    })
  }

  vm.setCurrentState = function(state_code) {
    vm.getCities(state_code)
  }

  vm.enableAddButton = function(o) {
    if (o === undefined || o.contato === undefined || o.endereco === undefined)
      return false

    // Check for required fields and password match
    return o.nome && o.cpf && o.acesso && o.senha && o.endereco.principal && o.endereco.bairro && o.endereco.cep &&
      o.endereco.estado && o.endereco.cidade && o.senha2 && o.senha === o.senha2
  }

  vm.removeContact = function(o, n) {
    // if (n === vm.maxContacts) {
    //   o.contato.splice(n-1, 1)
    //   --vm.maxContacts
    // }
    // else {
    //   for (var i = n; i < vm.maxContacts; ++i) {
    //     o.contato[i-1] = o.contato[i]
    //   }
    //   o.contato.splice(i-1, 1)
    //   --vm.maxContacts
    // }

    o.contato.splice(n-1, 1)
    --vm.maxContacts
  }

  vm.cancelDetailedView = function() {
    vm.detailed = false
    vm.currentRepresentative.contato.splice(vm.currentRepresentative._previousMaxContacts)
    vm.currentRepresentative = {}
    vm.maxContacts = 1
  }

  vm.getStates()
  vm.getAll()


  // Scope functions and variables
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  }
})


app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'MainController',
    controllerAs: 'vm',
    templateUrl: 'home.html'
  })
})
