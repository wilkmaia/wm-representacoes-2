var express = require('express')

var Model = require('../models/models')

var router = express.Router()

// Set routes
// List all states
router.get('/states', function(req, res) {
  Model.State.find({}, function(err, states) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(states)
    }
  })
})


// List all cities from given state
router.get('/cities/:id', function(req, res) {
  var id = req.params.id
  Model.City.find({estado: id}, function(err, cities) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(cities)
    }
  })
})


// Export router
module.exports = router
