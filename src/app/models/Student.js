const db = require('../../config/db')
const { date, grade } = require('../../lib/utils')

module.exports = {

    //Função para selecionar todos os Estudantes
    all(callback){

        db.query(`SELECT * from students ORDER BY name ASC`, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    },

    //Função para criar um novo Estudante
    create(data, callback){

        const query = `
            INSERT INTO students (
                AVATAR_URL,
                NAME,
                EMAIL,
                BIRTH_DATE,
                EDUCATION_LEVEL,
                WORKLOAD
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING ID
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            grade(data.schooling),
            data.workload
        ]

        db.query(query, values, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])   // retornando o instrutor criado
        })

    },

    //Função para retornar um Estudante específico
    find(id, callback){

        db.query(`
            SELECT * FROM students WHERE id = $1`, [id], (err, results) => {
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            })
    },

    //Função para atualizar um Estudante
    update(data, callback){

        const query = `
            UPDATE students SET
                AVATAR_URL = ($1),
                NAME = ($2),
                EMAIL = ($3),
                BIRTH_DATE = ($4),
                EDUCATION_LEVEL = ($5),
                WORKLOAD = ($6)
            WHERE ID = $7
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            grade(data.schooling),
            data.workload,
            data.id
        ]

        db.query(query, values, (err, values) => {
            if(err) throw `Database Error! ${err}`

            callback()
        })

    },

    //Função para apagar um Estudante
    delete(id, callback){

        db.query(`DELETE FROM students WHERE id = $1`, [id], (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    }
}