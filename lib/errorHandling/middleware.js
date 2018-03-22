module.exports = (log) => {
    return (err, req, res, next) => {
        log.error(err);
        const errorMessages = {
            "400": 'Bad Request',
            "401": 'Unauthorized',
            "500": 'Internal Server Error'
        }
        // default status code
        let status = 500;
        if(err.statusCode && errorMessages[err.statusCode.toString()]) {
            status = err.statusCode;
        }
        res.status(status).json({ok: false, error: errorMessages[status.toString()]});
    }
}