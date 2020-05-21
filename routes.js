const express = require('express')
const routes = express.Router()     //declarando que a variavel routes irá gerenciar as rotas
const teachers = require('./teachers')

routes.get('/', function(req, res){
    return res.redirect("/teachers")
})

routes.get('/teachers', function(req, res){
    return res.render('teachers/index')
})

routes.get('/teachers/create', function(req, res){
    return res.render('teachers/create')
})

routes.post('/teachers', teachers.post)

module.exports = routes