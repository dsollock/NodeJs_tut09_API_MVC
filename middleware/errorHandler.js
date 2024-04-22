const { logEvent } = require('./logEvents');

const errorHandler = function (err, req, res, next) {
    logEvent(`${err.name}: ${err.message}`, 'errorLog.txt');
    //logEvent('Error Message!!!', 'errorLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
};

module.exports = errorHandler;