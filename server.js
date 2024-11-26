const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          margin: 0;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(120deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Server is Running</h1>
        <p>Your server is up and running smoothly!</p>
      </div>
    </body>
    </html>
  `);
});


app.post('/webhook', (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { headers, body: requestBody } = req;

    console.log('Received webhook. Request details:');
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Parsed JSON data:', JSON.stringify(requestBody, null, 2));

    try {
        console.log('Processing webhook...');
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Webhook received successfully' });
});

app.use((req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
