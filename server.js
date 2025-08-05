const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Proxy for GET requests
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    const apiKey = req.query.apiKey;
    const queryParams = { ...req.query };

    delete queryParams.url;
    delete queryParams.apiKey;

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            params: queryParams
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Proxy for POST requests
app.post('/proxy', async (req, res) => {
    const targetUrl = req.body.url;
    const apiKey = req.body.apiKey;
    const bodyData = req.body.data;  // Extracting body data from the request

    try {
        const response = await axios.post(targetUrl, bodyData, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Proxy for POST requests
app.post('/proxyListaFirme', async (req, res) => {
    const targetUrl = req.body.url;
    const apiKey = req.body.apiKey;
    const bodyData = req.body.data;  // Extracting body data from the request

    console.log(targetUrl)
    console.log(apiKey)
    console.log(bodyData)

    try {
        const response = await axios.post(targetUrl, bodyData, {
            params: { key: apiKey, data: JSON.stringify(bodyData) }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`CORS Proxy Server running on port ${PORT}`);
});
