var Model = require('./models/models')

states = ['ac', 'al', 'am', 'ap', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mg', 'ms',
  'mt', 'pa', 'pb', 'pe', 'pi', 'pr', 'rj', 'rn', 'ro', 'rr', 'rs', 'sc',
  'se', 'sp', 'to']

var setup_cities = Model.City.findOne({}, function(err, city) {
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
          estado: state_code + 1,
          codigo: codigo
        }

        city = Model.City(new_city)
        city.save(function(err) {
          if (err) {
            console.log('[ERROR]')
            console.log('Couldn\'t save city ' + c.name + ' (' + codigo - 1 + ') of state ' + s)
          }
        })
      })
    })

    console.log('Cities added to database')
  }
})

var setup_states = Model.State.findOne({}, function(err, state) {
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

module.exports = {
  cities: setup_cities,
  states: setup_states
}
