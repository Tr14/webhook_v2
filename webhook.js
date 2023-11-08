const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')
const port = process.env.PORT || 1337; // Use the port of your choice

const VERIFY_TOKEN = 'lmaoez1234';
const APP_SECRET = 'ae1c496169b0349a4b365bd4d60097d9';
let client_id = "310979735068127"
let redirect_uri = "https://dev.akadigital.net/facebook-authorization"
var received_updates = [];

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  require("log-timestamp");
  console.log("\u001b[1;32m" + "dev.akadigital.net: " + "\u001b[0m" + req);
  res.send('Welcome to AKA webhook');
});

app.get('/authorization', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/authorization.html'));
});

app.get('/facebook-authorization', (req, res) => {
  var facebook_authorization_code = req.query.code;
  require("log-timestamp");
  console.log("\u001b[1;32m" + "Facebook Authorization: " + "\u001b[0m" + facebook_authorization_code);

  const axios = require('axios');

  let config_usertoken = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${APP_SECRET}&code=${facebook_authorization_code}`,
    headers: {},
    data: {}
  };

  axios.request(config_usertoken)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });


  res.sendFile(path.join(__dirname, 'public', '/authorization.html'));
  res.send(facebook_authorization_code);
});

app.get('/webhook', (req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == VERIFY_TOKEN
  ) {
    require("log-timestamp");
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "OK");
    res.send(req.query['hub.challenge']);
  } else {
    require("log-timestamp");
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "Bad Request");
    res.sendStatus(400);
  }
});

app.post('/webhook', (req, res) => {
  require("log-timestamp");
  console.log("\u001b[1;32m" + "Data: " + "\u001b[0m" + 'Facebook request body:', req.body);

  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  require("log-timestamp")
  console.log("\u001b[1;32m" + "Node: " + "\u001b[0m" + `Facebook Messenger webhook is running on port ${port}`);
});