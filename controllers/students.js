//Variavéis

const fs = require('fs')                                //fs é um módulo que permite para interagir com o sistema de arquivos 
const data = require('../data.json')
const { grade, date } = require('../utils')        //desestruturando o objeto e só pegando o que é necessário
const Intl = require('intl')                            //importando o INTL para arrumar a data

//Função para LISTAR
exports.index = function(req, res){
    return res.render('students/index', { students: data.students })
}

//Função para redirecionar para a pagína Create
exports.redirectCreate =  function(req, res){
    return res.render('students/create')
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

    let { avatar_url, name, email, birth, schooling, workload} = req.body   //desestruturando o req.body

    let id = 1
    birth = Date.parse(birth)                                       //transforma o campo req.body.birth em um campo Date
    const lastStudents = data.students[data.students.length - 1]    //pega o último item do array 

    if(lastStudents){
        id = lastStudents.id + 1                        //pega o id do último item do array         
    }

    data.students.push({        //aqui add os dados enviados pelo req.body para dentro do array chamado Instructors
        id,
        avatar_url,
        name,
        email,
        birth,
        schooling: grade(schooling),
        workload,
    })    

    let infoData = JSON.stringify(data, null, 2)

    // fs.writeFile("data.json", JSON.stringify(data, null, 2), function(){}    //a forma inline da função abaixo 

    fs.writeFile(                                               //writeFile é um metodo do file system(fs) para escrever arquivos, que no caso serve para salvar as info.
        "data.json",                                            //primeiro parametro pede o nome do arquivo a ser gerado
        infoData,                                               //segundo parametro pede o tipo do arquivo, usamos o constructor JSON com o metodo stringify para transformar as info carregadas no data.json em JSON. Dentro do stringify o 2º é o null por enquanto, e o 3º é o espaçamento entre as linhas do Array                                                        
        function(err){                                          //terceiro parametro pede uma CallBack, função que executa após certo tempo e é passada como parametro dentro de outra função
            if(err) return res.send("Write file error!")        //no caso, usamos a CallBack para verificar se algum erro ocorreu, assim o processo do Programa não trava. 
        
            return res.redirect("/students")
        }
    )
}

//Função para MOSTRAR
exports.show = function(req, res){

    const { id } = req.params

    const foundStudent = data.students.find(function(student){  
        return student.id == id

        /*
            para cada item(professor/student) do Array Data, 
            nós usamos o método Find que pega cada item(professor/student)
            e verifica se o id dele é igual ao id enviado pelo URL
        */

    })

    if(!foundStudent) return res.send('Student not found')
    
    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).birthDay,
    }

    return res.render('students/show', { student : student })
}

//Função para CARREGAR INFORMAÇÕES PARA EDITAR
exports.edit = function(req, res){

    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if(!foundStudent) return res.send('Student not found')

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render('students/edit', { student })

}

//Função para ATUALIZAR
exports.update = function(req, res){

    const { id } = req.body
    let index = 0 

    const foundStudent = data.students.find(function(student, foundIndex){  //vai procurar o instrutor e a posição dele no array
        if(id == student.id){
            index = foundIndex
            return true

            /* 
                verificamos se o professor procurado existe, e se existe pegamos seus dados e 
                também atualizamos a variavel index com a posição desse instrutor no array 
            */

        }
    })

    if(!foundStudent) return res.send('Student not found')

    const student = {
        ...foundStudent,                    //usando o operador Spread Operator onde ele armazena os campos do foundInstructor que não serão alterados
        ...req.body,                        //usando o operador Spread Operator onde ele armazena os dados vindo do req.body
        id: Number(id),
        schooling: grade(req.body.schooling),
        birth: Date.parse(req.body.birth)   //chamanda a função e passando como paramentro o nasc. do instrutor pego pelo req.body
    }

    data.students[index] = student
     /* pegamos as informações que foram alteradas e as que não foram relacionadas 
    ao instrutor e atualizamos os dados desse instrutor na posição dele */

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect(`/students/${id}`)

    })
}

//Função para APAGAR
exports.delete = function(req, res){
    
    const { id } = req.body
    
    const filteredStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Error in delete student")

        return res.redirect(`/students`)
    })

    /* Para cada professor dentro do array, o método Filter faz um filtro verificando se 
        o ID informado pelo req.body é diferente do ID que o método está verificando no Array.
     
        Quando o ID é diferente, ele é armazenado na constante filteredInstructors e quando 
        for igual, ou seja, é o ID do professor que queremos apagar ele é retirado do Array.
     */

}