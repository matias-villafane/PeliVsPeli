const connection = require('../commons/dbConnection');
const logger = require('../commons/logger');

function getCompetencias(req, res) {
    logger('INFO',req);
    
    let sql = 'SELECT id, nombre FROM competencias';
    logger('DEBUG',sql);

    connection.query(sql, function(err, resultado) {
        if (err){
            let msg = `Error obteniendo competencias ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        res.send(resultado);
    });
}


function getCompetenciasById(req, res){
    logger('INFO',req);

    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sql = `SELECT c.nombre, g.nombre as genero_nombre, a.nombre as actor_nombre, d.nombre as director_nombre 
        FROM competencias c 
        LEFT OUTER JOIN genero g ON c.id_genero = g.id
        LEFT OUTER JOIN actor a ON c.id_actor = a.id
        LEFT OUTER JOIN director d ON c.id_director = d.id 
        WHERE c.id = ${req.params.id}`;
    
    logger('DEBUG',sql);

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
        res.send(resultado[0]);
    });
}


function getCompetenciaRandom(req, res) {
    logger('INFO',req);
    
    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlCompetencias = `SELECT * FROM competencias WHERE id = ${req.params.id}`;
    logger('DEBUG',sqlCompetencias);

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

        let competencia = competencias[0];
        let sqlWhere = '';

        Object.keys(competencia).forEach(key => {
            if (competencia[key]){
                switch (key) {
                    case "id_actor":
                        sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                        sqlWhere += `p.id in (SELECT pelicula_id FROM actor_pelicula WHERE actor_id = ${competencia.id_actor})`;
                        break;
                    case "id_genero":
                        sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                        sqlWhere += `p.genero_id = ${competencia.id_genero}`;
                        break;
                    case "id_director":
                        sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                        sqlWhere += `p.director in (SELECT nombre FROM director WHERE id = ${competencia.id_director})`;
                        break;
                    default:
                        break;
                }
            }
        });
        
        let sqlPeliculas = `SELECT DISTINCT p.id, p.titulo, p.poster FROM pelicula p${sqlWhere}\nORDER BY RAND() LIMIT 2`;
        logger('DEBUG',sqlPeliculas);

        connection.query(sqlPeliculas, function(err, peliculas) {
            if (err){
                let msg = `Error obteniendo peliculas ${err.message}`;
                console.log(msg);
                return res.status(500).send(msg);
            }
            res.send({
                competencia: competencia.nombre,
                peliculas
            });
        });
    });
}

function postCompetencias (req, res) {
    logger('INFO',req);

    if (!req.body.nombre || req.body.nombre == ""){
        let msg = `Error nombre invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let competencia = {
        id_genero: !req.body.genero || req.body.genero == 0 ? null : req.body.genero,
        id_director: !req.body.director || req.body.director == 0 ? null : req.body.director,
        id_actor: !req.body.actor || req.body.actor == 0 ? null : req.body.actor
    }

    // TODO Validación al crear una competencia: Para crear una competencia se valida que existan al menos dos competencias con los filtros.
    let sqlWhere = '';
    Object.keys(competencia).forEach(key => {
        if (competencia[key]){
            switch (key) {
                case "id_actor":
                    sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                    sqlWhere += `p.id in (SELECT pelicula_id FROM actor_pelicula WHERE actor_id = ${competencia.id_actor})`;
                    break;
                case "id_genero":
                    sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                    sqlWhere += `p.genero_id = ${competencia.id_genero}`;
                    break;
                case "id_director":
                    sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                    sqlWhere += `p.director in (SELECT nombre FROM director WHERE id = ${competencia.id_director})`;
                    break;
                default:
                    break;
            }
        }
    });
    
    let sqlCompetencia = `SELECT count(p.id) as total FROM pelicula p${sqlWhere}`;
    logger('DEBUG',sqlCompetencia);

    let sqlInsert = `INSERT INTO competencias (nombre, id_genero, id_director, id_actor) 
            VALUES ('${req.body.nombre}',${competencia.id_genero},${competencia.id_director},${competencia.id_actor})`;
    logger('DEBUG',sqlInsert);

    connection.query(sqlCompetencia, function(err, resultado) {
        if (err){
            let msg = `Error al consultar posible competencia ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        if (resultado[0].total < 2){
            let msg = `No hay suficientes peliculas para generar la competencia con los filtros ingresados`;
            console.log(msg);
            return res.status(422).send(msg);
        }
        connection.query(sqlInsert, function(err, resultado) {
            if (err) {
                let msg = err.code == 'ER_DUP_ENTRY' ? `Ya existe una competencia con el nombre: ${req.body.nombre}` : `Error dando de alta competencia ${err.message}`;
                let status = err.code == 'ER_DUP_ENTRY' ? 422 : 500;
                console.log(msg);
                return res.status(status).send(msg);
            }
            return res.status(202).send();
        });
    });
}


function eliminarCompetencias (req, res) {
    logger('INFO',req);

    if (!req.params.id){
        let msg = `Error ID invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlVotos = `DELETE FROM votos WHERE id_competencia = ${req.params.id}`;
    let sqlCompetencias = `DELETE FROM competencias WHERE id = ${req.params.id}`;
    // TODO cambiar a baja logica (requiere modificar las tablas)
    
    logger('DEBUG',sqlVotos);
    logger('DEBUG',sqlCompetencias);

    connection.query(sqlVotos, function(err, resultado) {
        if (err){
            let msg = `Error al eliminar votos ${err.message}`;
            console.log(msg);
            return res.status(500).send(msg);
        }
        connection.query(sqlCompetencias, function(err, resultado) {
            if (err) {
                let msg = `Error al eliminar competencias ${err.message}`;
                console.log(msg);
                return res.status(500).send(msg);
            }
            return res.status(202).send();
        });
    });
}


function updateCompetencia (req, res) {
    logger('INFO',req);

    if (!req.body.nombre || req.body.nombre == ""){
        let msg = `Error nombre invalido`;
        console.log(msg);
        return res.status(400).send(msg);
    }

    let sqlUpdate = `UPDATE competencias 
    SET nombre = '${req.body.nombre}',
        id_genero = ${req.body.genero || null},
        id_director = ${req.body.director || null},
        id_actor = ${req.body.actor || null}
    WHERE id = ${req.params.id}`;
    
    logger('DEBUG',sqlUpdate);

    connection.query(sqlUpdate, function(err, resultado) {
        if (err) {
            let msg = err.code == 'ER_DUP_ENTRY' ? `Ya existe una competencia con el nombre: ${req.body.nombre}` : `Error dando de alta competencia ${err.message}`;
            let status = err.code == 'ER_DUP_ENTRY' ? 422 : 500;
            console.log(msg);
            return res.status(status).send(msg);
        }
        return res.status(202).send();
    });
}


module.exports = {
    getCompetencias,
    getCompetenciasById,
    getCompetenciaRandom,
    postCompetencias,
    eliminarCompetencias,
    updateCompetencia
}