// Import mongoose
var mongoose = require('mongoose')

// Set Schema
var Schema = mongoose.Schema


// Database schemas
// The schemas' objects are in Brazilian Portuguese

// State Schema
var StateSchema = new Schema({
  uf: {
    type: String,
    required: true
  },
  codigo: {
    type: Number,
    required: true
  }
})

// City Schema
var CitySchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  estado: {
    type: Number,
    required: true
  },
  codigo: {
    type: Number,
    required: true
  }
})

// Address Schema
var AddrSchema = new Schema({
  principal: {
    type: String,
    required: true
  },
  complemento: {
    type: String,
    required: false
  },
  bairro: {
    type: String,
    required: true
  },
  cep: {
    type: String,
    required: true
  },
  estado: {
    type: Number,
    required: true
  },
  cidade: {
    type: Number,
    required: true
  },
  referencia: {
    type: String,
    required: false
  }
})

// Contact Schema
var ContactSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: false
  },
  tipo: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  principal: {
    type: Boolean,
    required: false
  }
})

// Company Schema
var CompanySchema = new Schema({
  nome_fantasia: {
    type: String,
    required: true
  },
  razao_social: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true
  },
  insc_estadual: {
    type: String,
    required: true
  }
})

// Represented Schema
var RepresentedSchema = new Schema({
  empresa: {
    type: CompanySchema,
    required: true
  },
  endereco: {
    type: AddrSchema,
    required: true
  },
  contatos: {
    type: Array,
    required: true
  },
  comissao: {
    type: Number,
    required: true
  }
})

// Clients Schema
var ClientSchema = new Schema({
  empresa: {
    type: CompanySchema,
    required: true
  },
  endereco: {
    type: AddrSchema,
    required: true
  },
  endereco_cobranca: {
    type: AddrSchema,
    required: false
  },
  endereco_entrega: {
    type: AddrSchema,
    required: false
  },
  contatos: {
    type: Array,
    required: true
  }
})

// Merchandise Schema
var MerchandiseSchema = new Schema({
  quantidade: {
    type: Number,
    required: true
  },
  referencia: {
    type: String,
    required: false
  },
  descricao: {
    type: String,
    required: true
  },
  valor_unitario: {
    type: Number,
    required: true
  }
})

// Representative Schema
var RepresentativeSchema = new Schema({
  nome: {
    type: String,
    requried: true
  },
  cpf: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  endereco: {
    type: AddrSchema,
    required: true
  },
  contato: {
    type: Array,
    required: true
  },
  acesso: {
    type: Number,
    required: true
  }
})

// Order Schema
var OrderSchema = new Schema({
  representada: {
    type: RepresentedSchema,
    required: true
  },
  cliente: {
    type: ClientSchema,
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  cond_pagamento: {
    type: String,
    required: false
  },
  transportadora: {
    type: String,
    required: false
  },
  mercadorias: {
    type: Array,
    required: true
  },
  descontos: {
    type: Number,
    required: false
  },
  observacoes: {
    type: String,
    required: false
  },
  condicoes_gerais: {
    type: String,
    required: false
  },
  representante: {
    type: RepresentativeSchema,
    required: true
  }
})


// Set schemas
var state = mongoose.model('State', StateSchema)
var city = mongoose.model('City', CitySchema)
var addr = mongoose.model('Addr', AddrSchema)
var contact = mongoose.model('Contact', ContactSchema)
var company = mongoose.model('Company', CompanySchema)
var represented = mongoose.model('Represented', RepresentedSchema)
var client = mongoose.model('Client', ClientSchema)
var merchandise = mongoose.model('Merchandise', MerchandiseSchema)
var representative = mongoose.model('Representative', RepresentativeSchema)
var order = mongoose.model('Order', OrderSchema)


// Export model
module.exports = {
  State: state,
  City: city,
  Addr: addr,
  Contact: contact,
  Company: company,
  Represented: represented,
  Client: client,
  Merchandise: merchandise,
  Representative: representative,
  Order: order
}
