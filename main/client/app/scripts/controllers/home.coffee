module.exports =
  ['$scope', ($scope) ->
    $scope.message = "HOME"

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#home").addClass("active")
      null

    null
  ]
