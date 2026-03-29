const { Worker } = require('bullmq');
const { connection } = require('../config/queue');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker('document-processing', async (job) => {
    const processingTime = Math.floor(Math.random() * (20000 - 10000 + 1) + 10000);
    await delay(processingTime);

    if (Math.random() < 0.2) {
        throw new Error('Simulated network timeout during processing.');
    }

    return {
        word_count: Math.floor(Math.random() * 5000) + 500,
        entities_extracted: ['BP Optima', 'Async API', 'Node.js'],
        processing_time_seconds: (processingTime / 1000).toFixed(2),
        completed_at: new Date().toISOString()
    };
}, { connection, concurrency: 5 }); 

module.exports = worker;