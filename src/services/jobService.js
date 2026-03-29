const { documentQueue } = require('../config/queue');

const queueDocument = async (documentUrl) => {
    // Will create job with 3 attempts and a 5-second delay
    const job = await documentQueue.add('process-doc', { 
        document_url: documentUrl, 
        created_at: new Date().toISOString() 
    }, {
        attempts: 3,
        backoff: { type: 'fixed', delay: 5000 }
    });

    return job.id;
};

const getJobDetails = async (jobId) => {
    const job = await documentQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return {
        job_id: job.id,
        status: state,
        created_at: job.data.created_at,
        result: job.returnvalue || null,
        error: job.failedReason || null
    };
};

module.exports = { queueDocument, getJobDetails };