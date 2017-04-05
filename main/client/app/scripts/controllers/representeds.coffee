module.exports =
  ['$scope', ($scope) ->
    $scope.message = "REPRESENTADAS"

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#representeds").addClass("active")
      null

    null
  ]
