const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337; // Use the port of your choice

const VERIFY_TOKEN = 'lmaoez1234';

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send("Welcome to AKA webhook");
});

app.get('/webhook', (req, res) => {
  console.log(req.body)
  // Use the verification token you set during webhook setup
  const hubChallenge = req.query['hub.challenge'];
  const hubMode = req.query['hub.mode'];
  console.log(hubMode);

  if (hubMode === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(hubChallenge);
  } else {
    res.sendStatus(403);
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
  console.log(`Facebook Messenger webhook is running on port ${port}`);
});