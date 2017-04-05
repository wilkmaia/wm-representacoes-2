var express = require('express')

var Model = require('../models/models')

var router = express.Router()

// Set routes
// List all orders
router.get('/', function(req, res) {
  Model.Order.find({}, function(err, orders) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(orders)
    }
  })
})

// List all orders with given filter
router.post('/', function(req, res) {
  _filter = req.body

  Model.Order.find(_filter, function(err, orders) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(orders)
    }
  })
})

// Get order given its id
router.get('/:id', function(req, res) {
  _id = req.params.id

  Model.Order.findById(_id, function(err, order) {
    if (err) {
      res.status(500).send({
        status: 'failed',
        message: 'order not found'
      })
    }
    else {
      if (order === undefined) {
        res.status(404).send({
          status: 'failed',
          message: 'order not found'
        })
      }
      else {
        res.status(201).send(order)
      }
    }
  })
})

// Add new order
router.post('/add', function(req, res) {
  data = req.body

  console.log(data)

  var order = new Model.Order(data)
  order.save(function(err) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send({
        status: 'success',
        message: 'new order registered'
      })
    }
  })
})

// Delete order
router.delete('/delete/:id', function(req, res) {
  var id = req.params.id
  Model.Order.remove({_id: id}, function(err) {
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

// Update order
router.put('/update', function(req, res) {
  var id = req.body._id
  Model.Order.findById(id, function(err, order) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      order.update(req.body, function(err) {
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

// Make new order with default values
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

  default_order = {
    empresa: empresa,
    endereco: endereco,
    contato: [contato],
    comissao: 5
  }

  console.log(default_order.empresa.cnpj)

  Model.Order.find({'empresa.cnpj': default_order.empresa.cnpj}, function(err, found) {
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
      var order = new Model.Order(default_order)
      order.save(function(err) {
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
