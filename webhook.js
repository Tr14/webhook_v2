const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1337; // You can change this to your desired port

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Define a route for the webhook endpoint
app.post('/webhook', (req, res) => {
  const payload = req.body; // Data received from the webhook

  // Do something with the data (e.g., log it)
  console.log('Received webhook data:', payload);

  // Respond with a success status code (e.g., 200 OK)
  res.status(200).send('Webhook received successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Webhook server is running on port ${port}`);
});