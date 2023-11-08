const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337; // Use the port of your choice

const VERIFY_TOKEN = 'lmaoez1234';
const APP_SECRET = 'ae1c496169b0349a4b365bd4d60097d9';
var received_updates = [];

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (req, res) => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "dev.akadigital.net: " + "\u001b[0m" + req)
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get('/webhook', (req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == VERIFY_TOKEN
  ) {
    require("log-timestamp")
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + challenge)
    res.send(req.query['hub.challenge']);
  } else {
    require("log-timestamp")
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "Bad Request")
    res.sendStatus(400);
  }
});

app.post('/webhook', (req, res) => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "Data: " + "\u001b[0m" + 'Facebook request body:', req.body.entry[0].changed_fields);

  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "Node: " + "\u001b[0m" + `Facebook Messenger webhook is running on port ${port}`);
});