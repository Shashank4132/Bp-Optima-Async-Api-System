const { queueDocument, getJobDetails } = require('../services/jobService');

const createJob = async (req, res, next) => {
    try {
        const { document_url } = req.body;
        
        const jobId = await queueDocument(document_url);
        
        res.status(202).json({ message: 'Job queued successfully', job_id: jobId });
    } catch (error) {
        next(error); 
    }
};

const getJobStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jobDetails = await getJobDetails(id);

        if (!jobDetails) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json(jobDetails);
    } catch (error) {
        next(error);
    }
};

module.exports = { createJob, getJobStatus };