var express = require('express')

var Model = require('../models/models')

var router = express.Router()

// Set routes
// List all clients
router.get('/', function(req, res) {
  Model.Client.find({}, function(err, clients) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(clients)
    }
  })
})

// Get client given its id
router.get('/:id', function(req, res) {
  _id = req.params.id

  Model.Client.findById(_id, function(err, client) {
    if (err) {
      res.status(500).send({
        status: 'failed',
        message: 'client not found'
      })
    }
    else {
      if (client === undefined) {
        res.status(404).send({
          status: 'failed',
          message: 'client not found'
        })
      }
      else {
        res.status(201).send(client)
      }
    }
  })
})

// Add new client
router.post('/add', function(req, res) {
  data = req.body

  var client = new Model.Client(data)

  if (client.empresa.cnpj === null || client.empresa.cnpj === undefined) {
    res.status(500).send({
      status: 'failed',
      message: 'no cnpj registered to client'
    })
  }
  else {
    Model.Client.find({'empresa.cnpj': client.empresa.cnpj}, function(err, found) {
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
          client.save(function(err) {
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

// Delete client
router.delete('/delete/:id', function(req, res) {
  var id = req.params.id
  Model.Client.remove({_id: id}, function(err) {
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

// Update client
router.put('/update', function(req, res) {
  var id = req.body._id
  Model.Client.findById(id, function(err, client) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      client.update(req.body, function(err) {
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

// Make new client with default values
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
  empresa = {
    nome_fantasia: 'WM Representações',
    razao_social: 'Não sei',
    cnpj: '06.517.387/0001-34',
    insc_estadual: '0000000000'
  }
  
  default_client = {
    empresa: empresa,
    endereco: endereco,
    contato: [contato]
  }

  console.log(default_client.empresa.cnpj)

  Model.Client.find({'empresa.cnpj': default_client.empresa.cnpj}, function(err, found) {
    if (err) {
      res.status(500).send(err)
    }

    console.log(found)

    if (found.length !== 0) {
      res.status(201).send({
        status: 'failed',
        message: 'user already in database'
      })
    }
    else {
      var client = new Model.Client(default_client)
      client.save(function(err) {
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
