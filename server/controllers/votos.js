const connection = require('../commons/dbConnection');

function postVotoCompetencia (req, res) {
    console.log(`/competencias/${req.params.id}/voto`);
    
    if (!req.params.id || !req.body.idPelicula){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlCompetencias = `SELECT * FROM competencias WHERE id = ${req.params.id}`;
    let sqlPeliculas = `SELECT * FROM pelicula WHERE id = ${req.body.idPelicula}`;
    let sqlInsertVotos = `INSERT INTO votos VALUES (${req.body.idPelicula}, ${req.params.id})`;
    
    console.log(`SQL:${sqlPeliculas}\nSQL:${sqlCompetencias}\nSQL:${sqlInsertVotos}`);

    connection.query(sqlCompetencias, function(err, competencias) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        if (competencias == []) {
            let msg = `Invalid competencia`;
            console.log(msg);
            return res.status(400).send(msg);
        }
        connection.query(sqlPeliculas, function(err, peliculas) {
            if (err){
                let msg = `Error obteniendo peliculas ${err.message}`;
                console.log(msg);
                return res.status(500).send(msg);
            }
            if (peliculas == []){
                let msg = `Invalid pelicula`;
                console.log(msg);
                return res.status(400).send(msg);
            }
            connection.query(sqlInsertVotos,function (error, resultado) {
                if (err) {
                    let message = `Error votando pelicula ${req.body.idPelicula} en competencia ${req.params.id}`;
                    console.log(message);
                    return res.status(500).send(message);
                }
                return res.send('OK')
            })
        });
    });
}


function getResultados (req, res) {
    console.log(`/competencias/${req.params.id}/resultados`);
    
    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlCompetencias = `SELECT * FROM competencias WHERE id = ${req.params.id}`;
    let sqlVotacion = `SELECT p.id as pelicula_id, p.poster, p.titulo, count(v.id_pelicula) as votos 
        FROM votos v JOIN pelicula p ON v.id_pelicula = p.id 
        WHERE v.id_competencia = ${req.params.id}
        GROUP BY v.id_pelicula 
        ORDER BY votos DESC
        LIMIT 3`;
    
    console.log(`SQL:${sqlCompetencias}\nSQL:${sqlVotacion}`);

    connection.query(sqlCompetencias, function(err, competencias) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        if (competencias == []) {
            let msg = `Invalid competencia`;
            console.log(msg);
            return res.status(400).send(msg);
        }
        connection.query(sqlVotacion, function(err, peliculas) {
            if (err){
                let msg = `Error obteniendo peliculas ${err.message}`;
                console.log(msg);
                return res.status(500).send(msg);
            }
            if (peliculas == []){
                let msg = `Invalid pelicula`;
                console.log(msg);
                return res.status(404).send(msg);
            }
            return res.send({
                competencia: competencias[0].nombre,
                resultados: peliculas
            })
        });
    });
}

module.exports = {
    postVotoCompetencia,
    getResultados
}