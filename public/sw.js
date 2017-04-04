var cacheName = '2017-04-04-18_wm_site'

var filesToCache = [
  '/',
  'clientes/',
  'pedidos/',
  'representadas/',
  'representantes/',
  '/home.html',
  'clientes/home.html',
  'pedidos/home.html',
  'representadas/home.html',
  'representantes/home.html',
  '/app.js',
  'clientes/app.js',
  'pedidos/app.js',
  'representadas/app.js',
  'representantes/app.js',
  'img/wm_192x192.png',
  'img/wm_192x192.svg',
  'img/wm_compressed.png',
  'lib/idb.js',
  '/manifest.json',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.3/angular.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.3/angular-route.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2'
]

var DEBUG = function(msg) {
  return // NOT DEBUGGING
  console.log(msg)
}


self.addEventListener('install', function(e) {
  DEBUG('[SW] Install')

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      DEBUG('[SW] Caching ' + cacheName)
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', function(e) {
  DEBUG('[SW] Activate')
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          DEBUG('Removing old cache: ' + key)
          return caches.delete(key)
        }
      }))
    })
  )

  return self.clients.claim()
})

self.addEventListener('fetch', function(e) {
  DEBUG('[SW] Fetch ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function(res) {
      return res || fetch(e.request)
    })
  )
})


