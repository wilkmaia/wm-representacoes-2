var express = require('express')

var Model = require('../models/models')

var router = express.Router()

// Set routes
// List all representeds
router.get('/', function(req, res) {
  Model.Represented.find({}, function(err, representeds) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(representeds)
    }
  })
})

// Add new represented
router.post('/add', function(req, res) {
  data = req.body

  var represented = new Model.Represented(data)

  if (represented.empresa.cnpj === null || represented.empresa.cnpj === undefined) {
    res.status(500).send({
      status: 'failed',
      message: 'no cnpj registered to represented'
    })
  }
  else {
    Model.Represented.find({'empresa.cnpj': represented.empresa.cnpj}, function(err, found) {
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
          represented.save(function(err) {
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

// Delete represented
router.delete('/delete/:id', function(req, res) {
  var id = req.params.id
  Model.Represented.remove({_id: id}, function(err) {
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

// Update represented
router.put('/update', function(req, res) {
  var id = req.body._id
  Model.Represented.findById(id, function(err, represented) {
    if (err) {
      res.status(500).send(err)
    }
    else {
      represented.update(req.body, function(err) {
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

// Make new represented with default values
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

  default_represented = {
    empresa: empresa,
    endereco: endereco,
    contato: [contato],
    comissao: 5
  }

  console.log(default_represented.empresa.cnpj)

  Model.Represented.find({'empresa.cnpj': default_represented.empresa.cnpj}, function(err, found) {
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
      var represented = new Model.Represented(default_represented)
      represented.save(function(err) {
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
