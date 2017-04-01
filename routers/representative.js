var express = require('express')
var Model = require('../models/models')

var router = express.Router()

// Set routes
router.get('/', function(req, res) {
  res.status(200).send('Hello, representative!')
})

router.get('/make_default', function(req, res) {
  endereco = {
    principal: 'Quadra 39, Casa 02',
    bairro: 'Saci',
    cep: '64020-240',
    estado: 17,
    cidade: 3582
  }
  contato = {
    nome: 'Wilson de Carvalho Maia',
    telefone: '(98) 98224-7301',
    tipo: 3,
    email: 'wc.maia64@gmail.com',
    principal: true
  }
  representante = {
    nome: 'Wilson de Carvalho Maia',
    cpf: '216.649.603-25',
    endereco: endereco,
    contato: contato,
    acesso: 0
  }

  Model.Representative.find({cpf: representante.cpf}, function(err, rep) {
    if (err) {
      res.status(404).send(err)
    }

    if (rep.length !== 0) {
      res.status(201).send({
        status: 'failed',
        message: 'user already in database'
      })
    }
    else {
      var representative = new Model.Representative(representante)
      representative.save(function(err, rep) {
        if (err) {
          res.status(500).send(err)
        }
        else {
          res.status(201).send(rep)
        }
      })
    }
  })
})

module.exports = router