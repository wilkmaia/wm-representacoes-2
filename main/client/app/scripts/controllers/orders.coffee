module.exports =
  ['$scope', ($scope) ->
    $scope.message = "PEDIDOS"

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#orders").addClass("active")
      null

    null
  ]
