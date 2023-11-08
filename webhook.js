const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337; // Use the port of your choice
var moment = require('moment-timezone');

const VERIFY_TOKEN = 'lmaoez1234';


var gmt7moment = moment().tz("GMT+07").toString();
const regex = /[Moment<>]+/g;
var gmt7timestamp = gmt7moment.replace(regex, '');

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send("Welcome to AKA webhook");
});

app.get('/webhook', (req, res) => {
  const hubChallenge = req.query['hub.challenge'];
  res.status(200).send(hubChallenge);
  /*Use the verification token you set during webhook setup
  const hubMode = req.query['hub.mode'];
  console.log(hubMode);

  if (hubMode === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(hubChallenge);
  } else {
    res.sendStatus(403);
  }
  */
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
  console.log("\u001b[1;32m" + "[" + gmt7timestamp + "]" + "\u001b[0m" + ` Facebook Messenger webhook is running on port ${port}`);
});