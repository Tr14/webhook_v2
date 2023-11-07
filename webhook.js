const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1337; // You can change this to your desired port

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send("Welcome to AKA webhook");
});

// Define a route for the webhook endpoint
app.post('/webhook', (req, res) => {
  console.log("Data", req.body)
  var url = req.url
  const regex = /(?<=\?code=).*/gm
  if (url.match(regex) == null) {
    let challenge = req.query['hub.challenge'];
    res.send(challenge);
  }
    
  res.status(200).send('Webhook received successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Webhook server is running on port ${port}`);
});