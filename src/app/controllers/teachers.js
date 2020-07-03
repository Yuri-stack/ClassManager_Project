//Variavéis
const Teacher = require('../models/Teacher')
const { date, age, graduation } = require('../../lib/utils')  //desestruturando o objeto e só pegando o que é necessário

module.exports = {

    index(req, res){            //Função para LISTAR
        
        Teacher.all(function( teachers ){
            return res.render("teachers/index", { teachers })
        })
        
    },
    
    redirectCreate(req, res){   //Função para redirecionar para a pagína CREATE
        return res.render('teachers/create')
    },

    post(req, res){             //Função para CREATE 
                                                    //usando o metodo Post temos que pegar as info através do Req.Body
        const keys = Object.keys(req.body)          //a var KEY está pegando o nome dos campos(key) do formulário através do Constructor Object e dá função Keys

        for(key of keys){                           //verificando se cada key está preenchidas
            if(req.body[key] == ""){                //é o mesmo que fazer req.body.(cada item do vetor) == ""
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        Teacher.create(req.body, function(teacher){
            return res.redirect(`/teachers/${ teacher.id }`)
        })

    },

    show(req, res){             //Função para MOSTRAR

        Teacher.find(req.params.id, function(teacher){
            if(!teacher) return res.send("Teacher not found")

            teacher.subjects_taught = teacher.subjects_taught.split(',')
            teacher.acting = teacher.subjects_taught
            teacher.age = age(teacher.birth_date)
            teacher.schooling = graduation(teacher.education_level)
            teacher.created_at = date(teacher.created_at).format

            //o que está na esquerda é o que vai para a tela
            //o que está na direita é o que vem do BD

            return res.render('teachers/show', { teacher })
        })
       
    },

    edit(req, res){             //Função para CARREGAR INFORMAÇÕES PARA EDITAR
        
        Teacher.find( req.params.id, function( teacher ){
            if(!teacher) return res.send("Instructor not found")

            teacher.birth = date(teacher.birth_date).iso
            teacher.education_level = graduation(teacher.education_level)                      

            return res.render("teachers/edit", { teacher })
        })

    },

    update(req, res){           //Função para ATUALIZAR
        
        const keys = Object.keys(req.body)                  

        for(key of keys){                                   
            if(req.body[key] == ""){                        
                return res.send('Please, fill all fields')
            }
        }

        Teacher.update(req.body, function(){
            return res.redirect(`/teachers/${req.body.id}`)
        })

    },

    delete(req, res){           //Função para APAGAR
        
        Teacher.delete(req.body.id, function(){
            return res.redirect(`/teachers`)
        })

    }

}