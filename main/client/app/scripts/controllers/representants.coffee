module.exports =
  ['$scope', ($scope) ->
    $scope.message = "REPRESENTANTES"

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#representants").addClass("active")
      null

    null
  ]
