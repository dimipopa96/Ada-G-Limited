const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tracking Proxy Server is running!', 
    timestamp: new Date().toISOString(),
    endpoints: ['/track']
  });
});

// Tracking endpoint
app.get('/track', async (req, res) => {
  try {
    const { carrier_reference, postcode } = req.query;
    
    console.log('Tracking request:', { carrier_reference, postcode });
    
    // Validate required parameters
    if (!carrier_reference) {
      return res.status(400).json({ 
        error: 'carrier_reference is required' 
      });
    }
    
    if (!postcode) {
      return res.status(400).json({ 
        error: 'postcode is required' 
      });
    }
    
    // Get API key from environment variable
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured' 
      });
    }
    
    // Build the tracking API URL
    const apiUrl = `https://adag.gsit.co.uk/_portal/api/_tracking/?key=${API_KEY}&carrier_reference=${encodeURIComponent(carrier_reference)}&postcode=${encodeURIComponent(postcode)}`;
    
    console.log('Calling tracking API...');
    
    // Make the request to the tracking API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Tracking-Proxy/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.text();
    console.log('API response received');
    
    // Return the XML response
    res.set('Content-Type', 'text/xml');
    res.send(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tracking data',
      details: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Tracking endpoint: http://localhost:${PORT}/track`);
});
