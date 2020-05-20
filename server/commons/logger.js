let allowed = ['DEBUG','INFO','ERROR'];

function logger (level, req, status=200, err) {
    if (allowed.includes(level)){
        if (level === 'ERROR' && err) {
            level = status < 500 ? 'FAULT' : level;
            console.log(`${level}\t${status}\t${req.method} - ${req.url} <${err}>`);

        } else if (level === 'DEBUG') {
            console.log(`${level}\t<${req}>`);
            
        } else {
            console.log(`${level}\t${status}\t${req.method} - ${req.url}`);
        }
    }
}

module.exports = logger;