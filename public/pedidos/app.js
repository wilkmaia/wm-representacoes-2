// Define AngularJS module
var app = angular.module('app', ['ngRoute'])

// Set app's controller for home.html page
app.controller('MainController', function($scope, $http) {
  var vm = this
  vm.orders = []
  vm.representeds = []
  vm.clients = []
  vm.detailed = false
  vm._representative_id = '58e07988fae04c133014ea96'


  // Append leading 0s to compose number up to *width* characters
  function pad(n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  /**
   * Gets all orders on database
   */
  vm.getAll = function() {
    $http.get('/api/order/').then(function(res) {
      vm.orders = res.data
    })
  }

  /**
   * Gets all clients
   */
  vm.getAllClients = function() {
    $http.get('/api/client/').then(function(res) {
      vm.clients = res.data
    })
  }

  /**
   * Gets all representeds
   */
  vm.getAllRepresenteds = function() {
    $http.get('/api/represented/').then(function(res) {
      vm.representeds = res.data
    })
  }

  /**
   * Returns selected client object
   */
  vm.getClient = function() {
    var _id = vm.order._client_id

    $http.get('/api/client/' + _id).then(function(res) {
      vm.order.cliente = res.data
      if (Object.keys(vm.order.cliente.endereco_cobranca).length <= 1) {
        delete vm.order.cliente.endereco_cobranca
      }

      if (Object.keys(vm.order.cliente.endereco_entrega).length <= 1) {
        delete vm.order.cliente.endereco_entrega
      }
    })
  }

  /**
   * Returns selected represented object
   */
  vm.getRepresented = function() {
    var _id = vm.order._represented_id

    $http.get('/api/represented/' + _id).then(function(res) {
      vm.order.representada = res.data
    })
  }

  /**
   * Get current session representative
   */
  vm.getRepresentative = function() {
    $http.get('/api/representative/' + vm._representative_id).then(function(res) {
      vm.representante = res.data
    })
  }

  /**
   * Add new order to database
   * @param order
   */
  vm.add = function(order) {
    if (order) {
      $http.post('/api/order/', {'representada._id': vm.order.representada._id}).then(function(res) {
        vm.order.numero = pad(res.data.length + 1, 4)
        vm.order.numero = vm.order.numero + '/' + String(vm.order.data.getFullYear())

        vm.order.representante = vm.representante

        $http.post('/api/order/add/', order).then(function(res) {
          if (res.data.status === 'success') {
            vm.getAll()
            vm.order = {}
            vm.addFlag = false
          }
          else {
            console.log(res)
          }
        })
      })
    }
  }

  /**
   * Remove order from database
   * @param order
   */
  vm.remove = function(order) {
    if (order) {
      if (confirm('Realmente deseja remover o pedido "' + order.representada.empresa.nome_fantasia + ' ' +
          '- ' + order.numero + '"?') === false) {
        return
      }
      $http.delete('/api/order/delete/' + order._id).then(function(res) {
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
   * Update order's data on database
   * @param order
   */
  vm.update = function(order) {
    if (order) {
      for (var idx = 0; idx < order.mercadorias.length; ++idx) {
        el = order.mercadorias[idx]

        if (Object.keys(el).length === 0) {
          order.mercadorias.splice(idx, 1)
        }
      }

      $http.put('/api/order/update', order).then(function(res) {
        if (res.data.status !== 'success') {
          console.log(res)
        }
        else {
          vm.detailed = false
          vm.orders[vm.currentIdx] = JSON.parse(JSON.stringify(vm.currentOrder))
          vm.currentOrder = {}
          vm.maxMerchandise = 1
        }
      })
    }
  }

  /**
   * Gets details of specific order
   * @param order
   */
  vm.showDetails = function(order) {
    vm.detailed = true

    vm.maxMerchandise = order.mercadorias.length

    // Deep clone object
    vm.currentOrder = JSON.parse(JSON.stringify(order))
    vm.currentOrder.data = new Date(vm.currentOrder.data)

    vm.currentOrder._represented_id = order.representada._id
    vm.currentOrder._client_id = order.cliente._id
    vm.currentIdx = vm.orders.indexOf(order)
  }

  /**
   * Checks if the Add button should be enabled or not for order "o"
   * @param o
   * @returns true if enable button should be enabled
   */
  vm.enableAddButton = function(o) {
    if (o === undefined || o.mercadorias === undefined || o.mercadorias.length === 0)
      return false

    // Check if required fields are ok
    var _tmp = true
    o.mercadorias.forEach(function(merch) {
      if (merch.descricao === undefined || merch.quantidade === undefined || merch.valor_unitario === undefined) {
        _tmp = false
      }
    })

    return o.representada && o.cliente && o.data && _tmp
  }

  /**
   * Remove contact number "n" from order "o"
   * @param o
   * @param n
   */
  vm.removeMerchandise = function(o, n) {
    o.mercadorias.splice(n-1, 1)
    --vm.maxMerchandise
  }

  /**
   * Resets unsaved info from detailed view
   */
  vm.cancelDetailedView = function() {
    vm.detailed = false
    vm.currentOrder = {}
    vm.maxMerchandise = 1
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
  // Get list of states and all orders' data
  vm.getAll()
  vm.getAllClients()
  vm.getAllRepresenteds()
  vm.getRepresentative()
})


app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'MainController',
    controllerAs: 'vm',
    templateUrl: 'home.html'
  })
})
