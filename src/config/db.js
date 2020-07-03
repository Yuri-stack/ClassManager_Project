const { Pool } = require("pg")  //Pool é uma forma de carregar as credenciais para executar as queries

module.exports = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "my_teacher"
})

