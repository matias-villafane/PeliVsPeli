const connection = require('../commons/dbConnection');

function getCompetencias(req, res) {
    console.log(`/competencias`);
    
    let sql = 'SELECT * FROM competencias';
    console.log(`SQL:${sql}`);

    connection.query(sql, function(err, resultado) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        // modifique el front para que lea el array desde resultado -> resultado:[]
        res.send({
            resultado
        });
    });
}
function getCompetenciasById(req, res){
    console.log(`/competencias/${req.params.id}`);
    
    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sql = `SELECT * FROM competencias WHERE id = ${req.params.id}`;
    console.log(`SQL:${sql}`);

    connection.query(sql, function(err, resultado) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        if (resultado == []) {
            let msg = `No se encontraron resultados`;
            console.log(msg);
            return res.status(404).send(msg);
        }
        res.send({
            resultado
        });
    });
}

function getCompetenciaRandom(req, res) {
    
    console.log(`/competencias/${req.params.id}/resultados`);
    
    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlCompetencias = `SELECT * FROM competencias WHERE id = ${req.params.id}`;
    let sqlPeliculas = `SELECT id, titulo, poster FROM pelicula ORDER BY RAND() LIMIT 2`;
    
    console.log(`SQL:${sqlPeliculas}\nSQL:${sqlCompetencias}`);

    connection.query(sqlCompetencias, function(err, competencias) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        if (competencias == []) {
            let msg = `No se encontraron competencias`;
            console.log(msg);
            return res.status(404).send(msg);
        }
        connection.query(sqlPeliculas, function(err, peliculas) {
            if (err){
                let msg = `Error obteniendo peliculas ${err.message}`;
                console.log(msg);
                return res.status(500).send(msg);
            }
            let response = {
                competencias: competencias[0].nombre,
                peliculas
            }
            res.send(response);
        });
    });
}



module.exports = {
    getCompetencias,
    getCompetenciasById,
    getCompetenciaRandom
}