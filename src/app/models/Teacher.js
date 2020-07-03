const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {

    all(callback){

        db.query(`SELECT * FROM teachers`, (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

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

    find(id, callback){

        db.query(`
            SELECT * FROM teachers WHERE id = $1`, [id], (err, results) => {
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            })
    },

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

    delete(id, callback){

        db.query(`DELETE FROM teachers WHERE id = $1`, [id], (err, results) => {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    }
}