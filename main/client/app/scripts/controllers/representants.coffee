module.exports =
  ['$scope', ($scope) ->
    socket = io('http://localhost:4444/')
    $scope.message = socket.ids



    $scope.$on '$destroy', () ->
      socket.close()
      null

    # Highlight navbar item
    $ ->
      $(".navbar-nav li").removeClass("active")
      $("#representants").addClass("active")
      null

    null
  ]
