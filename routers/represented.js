var express = require('express')

var router = express.Router()

// Set routes
router.get('/', function(req, res) {
  res.status(200).send('Hello, represented!')
})

module.exports = router