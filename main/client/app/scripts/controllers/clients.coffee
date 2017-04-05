module.exports =
  ['$scope', ($scope) ->
    $scope.message = "CLIENTES"

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#clients").addClass("active")
      null

    null
  ]
