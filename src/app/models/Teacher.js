const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {

    //Função para selecionar todos os Professores
    all(callback){

        db.query(`SELECT teachers.*, count(students) as total_students
                    FROM teachers 
                    LEFT JOIN students ON (teachers.id = students.teacher_id)
                    GROUP BY teachers.id
                    ORDER BY total_students DESC`, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
        
    },

    //Função para criar um novo Professor
    create(data, callback){

        const query = `
            INSERT INTO teachers (
                AVATAR_URL,
                NAME,
                BIRTH_DATE,
                EDUCATION_LEVEL, 
                CLASS_TYPE,
                SUBJECTS_TAUGHT,
                CREATED_AT
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING ID
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows[0])               //estamos retornando o instrutor criado
            
        })
        
    },

    //Função para mostrar os dados de um Professor específico
    find(id, callback){

        db.query(`
            SELECT * FROM teachers WHERE id = $1`, [id], (err, results) => {
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            })
    },

    //Função para fitrar um Professor no Index
    findBy(filter, callback){

        db.query(`SELECT teachers.*, count(students) as total_students
                    FROM teachers 
                    LEFT JOIN students ON (teachers.id = students.teacher_id)
                    WHERE teachers.name ILIKE '%${ filter }%'
                    OR teachers.subjects_taught ILIKE '%${ filter }%'
                    GROUP BY teachers.id
                    ORDER BY total_students DESC`, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    },

    //Função para atualizar um Professor
    update(data, callback){

        const query = `
            UPDATE teachers SET
                avatar_url = ($1),
                name = ($2),
                birth_date = ($3),
                education_level = ($4),
                class_type = ($5),
                subjects_taught = ($6)
            WHERE id = $7
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },

    //Função para apagar um Professor
    delete(id, callback){

        db.query(`DELETE FROM teachers WHERE id = $1`, [id], (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },

    //Função para criar a paginação
    paginate(params){

        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                    SELECT COUNT(*) FROM teachers
                ) AS total`

        if( filter ){

            filterQuery = `
                WHERE teachers.name ILIKE '%${filter}%'
                OR teachers.subjects_taught ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT COUNT(*) FROM teachers
                ${filterQuery}
            ) AS total`

        }

        query = `
            SELECT teachers.*, ${totalQuery}, 
            COUNT(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            ${filterQuery}
            GROUP BY teachers.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    }
}