require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jose = require('jose');

const app = express();
const port = process.env.PORT || 4000;

// IMPORTANT: In production, you should restrict this to your actual frontend domain.
const allowedOrigins = [
  'http://localhost:3000', 
  'https://localhost:3000', 
  'http://192.168.137.1:3000', 
  'https://172.28.9.26:3000',
  'https://verichat-1.vercel.app', // Your actual Vercel URL
  /\.vercel\.app$/ // Allow all Vercel preview deployments
];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      return allowedOrigin.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const keyId = 'verichat-key-v2';

// Endpoint to serve the JWKS
app.get('/.well-known/jwks.json', async (req, res) => {
  try {
    const publicKeyPath = path.join(__dirname, 'public.key');
    if (!fs.existsSync(publicKeyPath)) {
      console.error('FATAL: public.key not found.');
      return res.status(500).json({ error: 'Server configuration error: public key not found.' });
    }
    const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');
    
    const publicKey = await jose.importSPKI(publicKeyPem, 'RS256');
    const jwk = await jose.exportJWK(publicKey);

    const jwks = {
      keys: [
        {
          ...jwk,
          kid: keyId,
          use: 'sig',
        }
      ]
    };

    res.json(jwks);
  } catch (error) {
    console.error('Error generating JWKS:', error);
    res.status(500).json({ error: 'Failed to generate JWKS.' });
  }
});

app.get('/api/generate-jwt', (req, res) => {
  console.log('Request received for /api/generate-jwt');
  try {
    const privateKeyPath = path.join(__dirname, 'private.key');
    if (!fs.existsSync(privateKeyPath)) {
      console.error('FATAL: private.key not found. Please generate keys and place it in the /backend directory.');
      return res.status(500).json({ error: 'Server configuration error: signing key not found.' });
    }
    const privateKey = fs.readFileSync(privateKeyPath);

    // This must be your actual Partner ID.
    // For this to work, you must start the server with the environment variable set:
    // VITE_AIRKIT_PARTNER_ID=your-id-goes-here node server.js
    const partnerId = process.env.VITE_AIRKIT_PARTNER_ID;
    if (!partnerId) {
      console.error('FATAL: VITE_AIRKIT_PARTNER_ID environment variable not set for the backend server.');
      return res.status(500).json({ error: 'Server configuration error: Partner ID not configured.' });
    }

    const payload = {
      partnerId: partnerId,
      exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutes expiry
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      header: {
        // This is a unique name for your key. AIR Kit uses it to find the
        // corresponding public key from your JWKS endpoint.
        kid: keyId
      }
    });

    console.log('Successfully signed JWT.');
    res.json({ token });

  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({ error: 'Failed to generate authentication token.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`JWKS endpoint available at /.well-known/jwks.json`);
});
