// Import requirements
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')

var settings = require('./settings')

var clientRouter = require('./routers/client')
var representedRouter = require('./routers/represented')
var representativeRouter = require('./routers/representative')
var orderRouter = require('./routers/order')
var geoRouter = require('./routers/geo')


// ============================================================
// Set server port
var SERVER_PORT = 3000;


// ============================================================
// Connect to MongoDB
var db = 'mongodb://localhost/wm-representacoes'
mongoose.connect(db, function(err, res) {
  if (err) {
    console.log('Failed to connect to ' + db)
    console.log(err)
    console.log(res)
  }
  else {
    console.log('Connected to ' + db)
  }
})


// ============================================================
// Set express object
var app = express()

// Use body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Connection routers
// API
app.use('/api/client', clientRouter)
app.use('/api/represented', representedRouter)
app.use('/api/representative', representativeRouter)
app.use('/api/order', orderRouter)
app.use('/api/geo', geoRouter)

// Use Morgan for development
app.use(morgan('dev'))

// Start express' static paging
app.use(express.static(__dirname + '/public'))

// Start server
app.listen(SERVER_PORT, function(err) {
  if (err) {
    console.log('[ERROR]')
    console.log('Couldn\'t listen on port ' + SERVER_PORT)
  }
  else {
    console.log('Listening on port ' + SERVER_PORT)
  }
})


// ============================================================
// Set cities and states on database if needed
settings.cities
settings.states
