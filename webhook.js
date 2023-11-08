const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337; // Use the port of your choice

const VERIFY_TOKEN = 'lmaoez1234';

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (req, res) => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "dev.akadigital.net: " + "\u001b[0m" + "Welcome to AKA webhook")
  res.status(200).send("Welcome to AKA webhook");
});

app.get('/webhook', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const verify_token = req.query['hub.verify_token'];

  if (verify_token === VERIFY_TOKEN) {
    require("log-timestamp")
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + challenge)
    return res.status(200).send(challenge);  // Just the challenge
  } else {
    require("log-timestamp")
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "Bad request")
    return res.status(400).send({ message: "Bad request!" });
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  //console.log(body.entry[0].changed_fields);

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Handle incoming messages here
      // You can implement your logic to respond to messages

    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "Node: " + "\u001b[0m" + `Facebook Messenger webhook is running on port ${port}`);
});