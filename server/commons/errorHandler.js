function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Algo salio mal');
}

module.exports = { errorHandler };