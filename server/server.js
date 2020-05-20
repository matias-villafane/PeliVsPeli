const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const commonsError = require('./commons/errorHandler')
const competencias = require('./controllers/competencias');
const votos = require('./controllers/votos');
const generos = require('./controllers/generos');
const directores = require('./controllers/directores');
const actores = require('./controllers/actores');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.get('/generos',generos.getGeneros);
app.get('/directores',directores.getDirectores);
app.get('/actores', actores.getActores);    

app.get('/competencias', competencias.getCompetencias);
app.get('/competencias/:id', competencias.getCompetenciasById);
app.get('/competencias/:id/peliculas', competencias.getCompetenciaRandom);
app.get('/competencias/:id/resultados',votos.getResultados);

app.put('/competencias/:id',competencias.updateCompetencia);

app.post('/competencias/:id/voto', votos.postVotoCompetencia);
app.post('/competencias',competencias.postCompetencias);

app.delete('/competencias/:id/votos', votos.deleteVotacion);
app.delete('/competencias/:id',competencias.eliminarCompetencias);

app.listen(port, function () {
    console.log(`Escuchando en el puerto ${port}`);
});

app.use(commonsError.errorHandler);
