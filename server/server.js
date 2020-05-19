const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const commonsError = require('./commons/errorHandler')
const competencias = require('./controllers/competencias');
const votos = require('./controllers/votos');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.get('/competencias', competencias.getCompetencias);
app.get('/competencias/:id', competencias.getCompetenciasById);
app.get('/competencias/:id/peliculas', competencias.getCompetenciaRandom);
app.get('/competencias/:id/resultados',votos.getResultados);

app.post('/competencias/:id/voto', votos.postVotoCompetencia);


app.listen(port, function () {
    console.log(`Escuchando en el puerto ${port}`);
});

app.use(commonsError.errorHandler);
