const express = require('express');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json()); // Parses incoming JSON payloads

// Mount Routes
app.use('/api/v1', jobRoutes);
app.use(errorHandler);

module.exports = app;