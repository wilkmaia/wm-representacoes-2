// Import requirements
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')

var clientRouter = require('./routers/client')
var representedRouter = require('./routers/represented')
var representativeRouter = require('./routers/representative')
var orderRouter = require('./routers/order')

// ============================================================
// Set express object
var app = express()


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
// User body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// ============================================================
// Connection routers

// API
app.use('/api/client', clientRouter)
app.use('/api/represented', representedRouter)
app.use('/api/representative', representativeRouter)
app.use('/api/order', orderRouter)


// ============================================================
// Use Morgan for development
app.use(morgan('dev'))


// ============================================================
// Start express' static paging
app.use(express.static(__dirname + '/public'))


// ============================================================
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
// First time settings
var Model = require('./models/models')
states = ['ac', 'al', 'am', 'ap', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mg', 'ms',
          'mt', 'pa', 'pb', 'pe', 'pi', 'pr', 'rj', 'rn', 'ro', 'rr', 'rs', 'sc',
          'se', 'sp', 'to']

Model.City.findOne({}, function(err, city) {
  if (err) {
    console.log('[ERROR]')
    console.log('Couldn\'t communicate with mongodb on Model.City.findOne')
  }
  else if (city === null) {
    // No cities on database
    codigo = 0

    // Get list of cities for each state
    states.forEach(function(s) {
      state_code = states.indexOf(s)

      // Load cities for that state
      cities = require('./cities/' + s)

      // Insert cities on database
      cities.forEach(function(c) {
        ++codigo
        new_city = {
          nome: c.name,
          estado: state_code+1,
          codigo: codigo
        }

        city = Model.City(new_city)
        city.save(function(err) {
          if (err) {
            console.log('[ERROR]')
            console.log('Couldn\'t save city ' + c.name + ' (' + codigo-1 + ') of state ' + s)
          }
        })
      })
    })

    console.log('Cities added to database')
  }
})

Model.State.findOne({}, function(err, state) {
  if (err) {
    console.log('[ERROR]')
    console.log('Couldn\'t communicate with mongodb on Model.State.findOne')
  }
  else if (state === null) {
    // No states on database
    codigo = 0

    // Insert state on DB
    states.forEach(function(s) {
      ++codigo
      new_state = {
        uf: states[codigo-1],
        codigo: codigo
      }

      state = Model.State(new_state)
      state.save(function(err) {
        if (err) {
          console.log('[ERROR]')
          console.log('Couldn\'t save state ' + s + ' (' + codigo-1 + ')')
        }
      })
    })

    console.log('States added to database')
  }
})
