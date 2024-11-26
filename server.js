const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


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
