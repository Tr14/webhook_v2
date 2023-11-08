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
  console.log("\u001b[1;32m" + "Facebook Authorization Code: " + "\u001b[0m" + facebook_authorization_code);

  let user_access_token;

  async function fetchUserToken() {
    let config_usertoken = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${APP_SECRET}&code=${facebook_authorization_code}`,
      headers: {},
      data: {}
    };

    let res_usertoken = await axios(config_usertoken);
    user_access_token = res_usertoken.data.access_token;
  };

  fetchData().then(() => {
    // You can access responseData here, once the request has completed
    console.log('Data outside async function:', responseData);
  });


  res.sendFile(path.join(__dirname, 'public', '/authorization.html'));
  res.send({ authorization_code: facebook_authorization_code, user_access_token: user_access_token });
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