//Variavéis

const fs = require('fs')                        //fs é um módulo que permite para interagir com o sistema de arquivos 
const data = require('./data.json')
const { graduation, age, date } = require('./utils')    //desestruturando o objeto e só pegando o que é necessário
const Intl = require('intl')                            //importando o INTL para arrumar a data

//Função CREATE
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
        schooling,
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

//Função SHOWS
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
        schooling: graduation(foundTeacher.schooling),
        age: age(foundTeacher.birth),
        acting: foundTeacher.acting.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at)
    }

    return res.render('teachers/show', { teacher : teacher })
}

//Função EDIT
exports.edit = function(req, res){

    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if(!foundTeacher) return res.send('Teacher not found')

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth)
    }

    return res.render('teachers/edit', { teacher })

}