// Define AngularJS module
var app = angular.module('app', ['ngRoute'])

// Set app's controller for home.html page
app.controller('MainController', function($scope, $http) {
  var vm = this
  vm.clients = []
  client = {}
  vm.states = []
  vm.cities = []
  vm.detailed = false

  /**
   * Gets all clients on database
   */
  vm.getAll = function() {
    $http.get('/api/client/').then(function(res) {
      vm.clients = res.data
    })
  }

  /**
   * Add new client to database
   * @param client
   */
  vm.add = function(client) {
    if (client) {
      if (!vm.endereco_cobranca_needed) {
        delete client.endereco_cobranca
      }

      if (!vm.endereco_entrega_needed) {
        delete client.endereco_entrega
      }

      $http.post('/api/client/add/', client).then(function(res) {
        if (res.data.status === 'success') {
          vm.getAll()
          vm.client = {}
          vm.addFlag = false
        }
        else {
          console.log(res)
        }
      })
    }
  }

  /**
   * Remove client from database
   * @param client
   */
  vm.remove = function(client) {
    if (client) {
      if (confirm('Realmente deseja remover o representante >> ' + client.nome + ' << ?') === false) {
        return
      }
      $http.delete('/api/client/delete/' + client._id).then(function(res) {
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
   * Update client's data on database
   * @param client
   */
  vm.update = function(client) {
    if (client) {
      for (var idx = 0; idx < client.contato.length; ++idx) {
        el = client.contato[idx]

        if (Object.keys(el).length === 0) {
          client.contato.splice(idx, 1)
        }
      }

      if (!vm.endereco_cobranca_needed) {
        client.endereco_cobranca = {}
      }

      if (!vm.endereco_entrega_needed) {
        client.endereco_entrega = {}
      }

      $http.put('/api/client/update', client).then(function(res) {
        if (res.data.status !== 'success') {
          console.log(res)
        }
        else {
          vm.detailed = false
          vm.currentClient = {}
          vm.maxContacts = 1
        }
      })
    }
  }

  /**
   * Gets details of specific client
   * @param client
   */
  vm.showDetails = function(client) {
    vm.detailed = true
    client.endereco.estado = String(client.endereco.estado)
    vm.getCities(client.endereco.estado, 0)
    client.endereco.cidade = String(client.endereco.cidade)


    vm.endereco_cobranca_needed = false
    vm.endereco_entrega_needed = false

    if (client.endereco_cobranca && Object.keys(client.endereco_cobranca).length > 1) {
      client.endereco_cobranca.estado = String(client.endereco_cobranca.estado)
      vm.getCities(client.endereco_cobranca.estado, 1)
      client.endereco_cobranca.cidade = String(client.endereco_cobranca.cidade)

      vm.endereco_cobranca_needed = true
    }

    if (client.endereco_entrega  && Object.keys(client.endereco_entrega).length > 1) {
      client.endereco_entrega.estado = String(client.endereco_entrega.estado)
      vm.getCities(client.endereco_entrega.estado, 2)
      client.endereco_entrega.cidade = String(client.endereco_entrega.cidade)

      vm.endereco_entrega_needed = true
    }

    client.contato.forEach(function(contact) {
      contact.tipo = String(contact.tipo)
    })


    vm.maxContacts = client.contato.length

    vm.currentClient = client
    vm.currentClient._previousMaxContacts = vm.maxContacts
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
  vm.getCities = function(state_code, type) {
    $http.get('/api/geo/cities/' + state_code).then(function(res) {
      switch (type) {
        case 0:
          vm.cities = res.data
          break

        case 1:
          vm.cities_cobranca = res.data
          break

        case 2:
          vm.cities_entrega = res.data
          break

        default:
          vm.cities = res.data
      }
    })
  }

  /**
   * Defines current state and lists cities accordingly
   * @param state_code
   */
  vm.setCurrentState = function(state_code, type) {
    vm.getCities(state_code, type)
  }

  /**
   * Checks if the Add button should be enabled or not for client "o"
   * @param o
   * @returns true if enable button should be enabled
   */
  vm.enableAddButton = function(o) {
    if (o === undefined || o.contato === undefined || o.endereco === undefined)
      return false

    var cobranca = true
    var entrega = true

    // Check if required fields are ok
    if (vm.endereco_cobranca_needed) {
      if (!o.endereco_cobranca) {
        o.endereco_cobranca = {}
      }
      var _tmp = o.endereco_cobranca
      cobranca = _tmp.principal && _tmp.bairro && _tmp.cep && _tmp.estado && _tmp.cidade
    }
    if (vm.endereco_entrega_needed) {
      if (!o.endereco_entrega) {
        o.endereco_entrega = {}
      }
      var _tmp = o.endereco_entrega
      entrega = _tmp.principal && _tmp.bairro && _tmp.cep && _tmp.estado && _tmp.cidade
    }
    return o.empresa.nome_fantasia && o.empresa.cnpj && o.empresa.razao_social && o.endereco.principal &&
      o.endereco.bairro && o.endereco.cep && o.endereco.estado && o.endereco.cidade && cobranca && entrega
  }

  /**
   * Remove contact number "n" from client "o"
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
    vm.endereco_cobranca_needed = false
    vm.endereco_entrega_needed = false
    vm.currentClient.contato.splice(vm.currentClient._previousMaxContacts)
    vm.currentClient = {}
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
  // Get list of states and all clients' data
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
