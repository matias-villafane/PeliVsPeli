const connection = require('../commons/dbConnection');
const logger = require('../commons/logger');

function getActores(req, res) {
    logger('INFO',req);
    
    let sql = 'SELECT id, nombre FROM actor';
    console.log(`SQL:${sql}`);

    connection.query(sql, function(err, resultado) {
        if (err){
            let msg = `Error obteniendo generos ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        // modifique el front para que lea el array desde resultado -> resultado:[]
        res.send(resultado);
    });
}

module.exports = {
    getActores
}