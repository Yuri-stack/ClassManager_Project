//Variavéis
const Student = require('../models/Student')
const { date, grade } = require('../../lib/utils')        //desestruturando o objeto e só pegando o que é necessário

module.exports = {

    index(req, res){    //Função para LISTAR

        Student.all(function( students ){
            return res.render('students/index', { students })
        })

    },

    redirectCreate(req, res){   //Função para redirecionar para a pagína CREATE
        return res.render('students/create')
    },

    post(req, res){     //Função para CREATE
                                                    //usando o metodo Post temos que pegar as info através do Req.Body
        const keys = Object.keys(req.body)          //a var KEY está pegando o nome dos campos(key) do formulário através do Constructor Object e dá função Keys

        for(key of keys){                           //verificando se cada key está preenchidas
            if(req.body[key] == ""){                //é o mesmo que fazer req.body.(cada item do vetor) == ""
                return res.send("Please, fill all fields")
            }
        }

        Student.create(req.body, function(student){
            return res.redirect(`/students/${ student.id }`)
        })

    },

    show(req, res){     //Função para MOSTRAR

        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found")

            student.birth = date(student.birth_date).format
            student.schooling = student.education_level

            //o que está na esquerda é o que vai para a tela
            //o que está na direita é o que vem do BD

            return res.render('students/show', { student })

        })

    },

    edit(req, res){     //Função para CARREGAR INFORMAÇÕES PARA EDITAR

        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found")

            student.birth = date(student.birth_date).iso
            student.schooling = student.education_level

            //o que está na esquerda é o que vai para a tela
            //o que está na direita é o que vem do BD

            return res.render("students/edit", { student })
        })

    },

    update(req, res){   //Função para ATUALIZAR

        const keys = Object.keys(req.body)                  

        for(key of keys){                                   
            if(req.body[key] == ""){                        
                return res.send('Please, fill all fields')
            }
        }

        Student.update(req.body, function(){
            return res.redirect(`/students/${req.body.id}`)
        })

    },

    delete(req, res){   //Função para APAGAR

        Student.delete(req.body.id, function(){
            return res.redirect(`/students`)
        })

    }   

}
