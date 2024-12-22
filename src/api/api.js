const express = require('express');
const router = express.Router();
const { createShortUrl, getOriginalUrl } = require('./urlShortener');

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Add URL validation
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const shortCode = await createShortUrl(url);
    const shortUrl = `${process.env.BASE_URL}/s/${shortCode}`;

    res.json({ shortUrl, originalUrl: url });  // Include original URL in response
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect from short URL
router.get('/s/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Add code validation
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid short code' });
    }

    const originalUrl = await getOriginalUrl(code);

    if (!originalUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Add security headers before redirect
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    
    res.redirect(originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;