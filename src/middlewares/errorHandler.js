const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${statusCode}`);
    console.error(err.stack);

    const errorTitles = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        429: 'Too Many Requests',
        500: 'Internal Server Error'
    };

    res.status(statusCode).json({
        error: errorTitles[statusCode] || 'Error',
        message: err.message || 'An unexpected error occurred'
    });
};

module.exports = errorHandler;