const validateJobCreation = (req, res, next) => {
    const { document_url } = req.body;

    if (!document_url || typeof document_url !== 'string') {
        return res.status(400).json({ 
            error: 'Validation Error', 
            details: '"document_url" is required and must be a text string.' 
        });
    }

    try {
        new URL(document_url);
    } catch (err) {
        return res.status(400).json({ 
            error: 'Validation Error', 
            details: '"document_url" must be a valid, fully qualified web address.' 
        });
    }

    next(); 
};

module.exports = { validateJobCreation };