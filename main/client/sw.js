var DEBUG = function(msg) {
  // return // NOT DEBUGGING
  console.log(msg)
}


self.addEventListener('install', function(e) {
  DEBUG('[SW] Install')
})

