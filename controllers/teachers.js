//Variavéis

const fs = require('fs')                        //fs é um módulo que permite para interagir com o sistema de arquivos 
const data = require('../data.json')
const { graduation, age, date } = require('../utils')    //desestruturando o objeto e só pegando o que é necessário
const Intl = require('intl')                            //importando o INTL para arrumar a data

//Função para LISTAR
exports.index = function(req, res){
    return res.render('teachers/index', { teachers: data.teachers })
}

//Função para redirecionar para a pagína Create
exports.redirectCreate =  function(req, res){
    return res.render('teachers/create')
}

//Função para CREATE
exports.post = function(req,res){               //Post é o nome da função, mas poderia ser qualquer outro
                                                //usando o metodo Post temos que pegar as info através do Req.Body
    const keys = Object.keys(req.body)          //a var KEY está pegando o nome dos campos(key) do formulário através do Constructor Object e dá função Keys

    for(key of keys){                           //verificando se cada key está preenchidas
        if(req.body[key] == ""){                //é o mesmo que fazer req.body.(cada item do vetor) == ""
            return res.send("Por favor, preencha todos os campos!")
        }
    }

    let { avatar_url, name, birth, schooling, type_class, acting } = req.body   //desestruturando o req.body

    birth = Date.parse(birth)                           //transforma o campo req.body.birth em um campo Date
    const created_at = Date.now()                       //add um campo chamado create_at com a data atual
    const id = Number(data.teachers.length + 1)         //add um campo chamado id no qual pega o número do tamanho do array instructors e add + 1, depois converte em Número 

    data.teachers.push({                                //aqui add os dados enviados pelo req.body para dentro do array chamado Instructors
        id,
        avatar_url,
        name,
        birth,
        schooling: graduation(schooling),
        type_class,
        acting,
        created_at,
    })    

    let infoData = JSON.stringify(data, null, 2)

    // fs.writeFile("data.json", JSON.stringify(data, null, 2), function(){}    //a forma inline da função abaixo 

    fs.writeFile(                                               //writeFile é um metodo do file system(fs) para escrever arquivos, que no caso serve para salvar as info.
        "data.json",                                            //primeiro parametro pede o nome do arquivo a ser gerado
        infoData,                                               //segundo parametro pede o tipo do arquivo, usamos o constructor JSON com o metodo stringify para transformar as info carregadas no data.json em JSON. Dentro do stringify o 2º é o null por enquanto, e o 3º é o espaçamento entre as linhas do Array                                                        
        function(err){                                          //terceiro parametro pede uma CallBack, função que executa após certo tempo e é passada como parametro dentro de outra função
            if(err) return res.send("Write file error!")        //no caso, usamos a CallBack para verificar se algum erro ocorreu, assim o processo do Programa não trava. 
        
            return res.redirect("/teachers")
        }
    )
}

//Função para MOSTRAR
exports.show = function(req, res){

    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){  
        return teacher.id == id

        /*
            para cada item(professor/teacher) do Array Data, 
            nós usamos o método Find que pega cada item(professor/teacher)
            e verifica se o id dele é igual ao id enviado pelo URL
        */

    })

    if(!foundTeacher) return res.send('Teacher not found')
    
    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        acting: foundTeacher.acting.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at)
    }

    return res.render('teachers/show', { teacher : teacher })
}

//Função para CARREGAR INFORMAÇÕES PARA EDITAR
exports.edit = function(req, res){

    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if(!foundTeacher) return res.send('Teacher not found')

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render('teachers/edit', { teacher })

}

//Função para ATUALIZAR
exports.update = function(req, res){

    const { id } = req.body
    let index = 0 

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){  //vai procurar o instrutor e a posição dele no array
        if(id == teacher.id){
            index = foundIndex
            return true

            /* 
                verificamos se o professor procurado existe, e se existe pegamos seus dados e 
                também atualizamos a variavel index com a posição desse instrutor no array 
            */

        }
    })

    if(!foundTeacher) return res.send('Teacher not found')

    const teacher = {
        ...foundTeacher,                    //usando o operador Spread Operator onde ele armazena os campos do foundInstructor que não serão alterados
        ...req.body,                        //usando o operador Spread Operator onde ele armazena os dados vindo do req.body
        id: Number(id),
        schooling: graduation(req.body.schooling),
        birth: Date.parse(req.body.birth)   //chamanda a função e passando como paramentro o nasc. do instrutor pego pelo req.body
    }

    data.teachers[index] = teacher
     /* pegamos as informações que foram alteradas e as que não foram relacionadas 
    ao instrutor e atualizamos os dados desse instrutor na posição dele */

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect(`/teachers/${id}`)

    })
}

//Função para APAGAR
exports.delete = function(req, res){
    
    const { id } = req.body
    
    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Error in delete teacher")

        return res.redirect(`/teachers`)
    })

    /* Para cada professor dentro do array, o método Filter faz um filtro verificando se 
        o ID informado pelo req.body é diferente do ID que o método está verificando no Array.
     
        Quando o ID é diferente, ele é armazenado na constante filteredInstructors e quando 
        for igual, ou seja, é o ID do professor que queremos apagar ele é retirado do Array.
     */

}