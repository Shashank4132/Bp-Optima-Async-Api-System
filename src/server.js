require('dotenv').config();
const app = require('./app');
const { documentQueue, connection } = require('./config/queue');
const worker = require('./workers/documentWorker'); 

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Adding the gracefull shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    
    // Closing http server 
    server.close(() => console.log('HTTP server closed.'));
    
    // Close the worker after it's finish the job completely
    await worker.close();
    console.log('Worker closed gracefully.');

    // Disconnect from Redis
    await connection.quit();
    console.log('Redis connection closed.');
    
    process.exit(0);
};

// Will signal if use ctrl+c abrudtly
process.on('SIGINT', () => gracefulShutdown('SIGINT')); 