var express = require('express')
var crypto = require('crypto')

var Model = require('../models/models')

var router = express.Router()

// Set routes
// List all representatives
router.get('/', function(req, res) {
  Model.Representative.find({}, function(err, representatives) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(representatives)
    }
  })
})

// Get representative given its id
router.get('/:id', function(req, res) {
  _id = req.params.id

  Model.Representative.findById(_id, function(err, representative) {
    if (err) {
      res.status(500).send({
        status: 'failed',
        message: 'representative not found'
      })
    }
    else {
      if (representative === undefined) {
        res.status(404).send({
          status: 'failed',
          message: 'representative not found'
        })
      }
      else {
        res.status(201).send(representative)
      }
    }
  })
})

// Add new representative
router.post('/add', function(req, res) {
  data = req.body
  var hash = crypto.createHash('sha256').update(data.senha).digest('base64')
  data.senha = hash

  var representative = new Model.Representative(data)

  if (representative.cpf === null || representative.cpf === undefined) {
    res.status(500).send({
      status: 'failed',
      message: 'no cpf registered to representative'
    })
  }
  else {
    Model.Representative.find({cpf: representative.cpf}, function(err, found) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        if (found.length !== 0) {
          res.status(201).send({
            status: 'failed',
            message: 'user already registered'
          })
        }
        else {
          representative.save(function(err) {
            if (err) {
              res.status(500).send(err)
            }
            else {
              res.status(201).send({
                status: 'success',
                message: 'default user added to database'
              })
            }
          })
        }
      }
    })
  }
})

// Delete representative
router.delete('/delete/:id', function(req, res) {
  var id = req.params.id
  Model.Representative.remove({_id: id}, function(err) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send({
        status: 'success',
        message: 'user deleted'
      })
    }
  })
})

// Update representative
router.put('/update', function(req, res) {
  var id = req.body._id
  Model.Representative.findById(id, function(err, representative) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      representative.update(req.body, function(err) {
        if (err) {
          res.status(500).send(err)
        }
        else {
          res.status(201).send({
            status: 'success',
            message: 'user updated on database'
          })
        }
      })
    }
  })
})

// Make new representative with default values
router.get('/make_default', function(req, res) {
  endereco = {
    principal: 'Quadra 39, Casa 02',
    bairro: 'Saci',
    cep: '64020-240',
    estado: 17,
    cidade: 3183
  }
  contato = {
    nome: 'Wilson de Carvalho Maia',
    telefone: '(98) 98224-7301',
    tipo: 3,
    email: 'wc.maia64@gmail.com',
    principal: true
  }

  var password = '123'
  var hash = crypto.createHash('sha256').update(password).digest('base64')
  representante = {
    nome: 'Wilson de Carvalho Maia',
    cpf: '216.649.603-25',
    senha: hash,
    endereco: endereco,
    contato: [contato],
    acesso: 0
  }

  Model.Representative.find({cpf: representante.cpf}, function(err, found) {
    if (err) {
      res.status(500).send(err)
    }

    if (found.length !== 0) {
      res.status(201).send({
        status: 'failed',
        message: 'user already in database'
      })
    }
    else {
      var representative = new Model.Representative(representante)
      representative.save(function(err) {
        if (err) {
          res.status(500).send(err)
        }
        else {
          res.status(201).send({
            status: 'success',
            message: 'default user added to database'
          })
        }
      })
    }
  })
})


// Export router
module.exports = router
