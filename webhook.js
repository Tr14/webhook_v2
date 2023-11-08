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

require("log-timestamp");

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
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
  let user_id;
  let page_access_token;
  let page_id;
  let subscribed_apps;
  let app_id;
  let app_name;

  async function fetchData() {
    //get user token
    let config_usertoken = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${APP_SECRET}&code=${facebook_authorization_code}`,
      headers: {},
      data: {}
    };

    let res_usertoken = await axios(config_usertoken);
    user_access_token = res_usertoken.data.access_token;

    //get user id
    let config_userid = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v18.0/me?fields=id%2Cname&access_token=${user_access_token}`,
      headers: {},
      data: {}
    };

    let res_userid = await axios(config_userid);
    user_id = res_userid.data.id;

    //get page token
    let config_pagetoken = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${user_id}/accounts?access_token=${user_access_token}`,
      headers: {},
      data: {}
    };

    let res_pagetoken = await axios(config_pagetoken);
    page_access_token = res_pagetoken.data.data[0].access_token;

    //get page id
    page_id = res_pagetoken.data.data[0].id;

    //subcribe app
    let config_installapp = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${page_id}/subscribed_apps?subscribed_fields=messaging_in_thread_lead_form_submit&access_token=${page_access_token}`,
      headers: {},
      data: {}
    };

    let res_installapp = await axios(config_installapp);
    subscribed_apps = res_installapp.data.success.toString();

    //get app info
    let config_appinfo = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${page_id}/subscribed_apps?access_token=${page_access_token}`,
      headers: {},
      data: {}
    };

    let res_appinfo = await axios(config_appinfo);
    app_name = res_appinfo.data.data[0].name;
    app_id = res_appinfo.data.data[0].id;

  };

  fetchData().then(() => {
    // You can access responseData here, once the request has completed
    console.log("\u001b[1;32m" + "User Access Token: " + "\u001b[0m", user_access_token);
    console.log("\u001b[1;32m" + "Page Access Token: " + "\u001b[0m", page_access_token);
    console.log("\u001b[1;32m" + "Subscribe App: " + "\u001b[0m", subscribed_apps);
    console.log("\u001b[1;32m" + "App Name: " + "\u001b[0m", app_name);
    console.log("\u001b[1;32m" + "App ID: " + "\u001b[0m", app_id);
    res.sendFile(path.join(__dirname, 'public', '/authorization.html'));
    let json = {
      authorization_code: facebook_authorization_code,
      user_access_token: user_access_token,
      page_access_token: page_access_token,
      subscribed_apps: subscribed_apps,
      app_info: {
        app_name: app_name,
        app_id: app_id
      }
    };
    let newlineJson = JSON.stringify(json, null, '\t');
    res.status(200).send(`<pre>${newlineJson}</pre>`);
  });
});

app.get('/webhook', (req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == VERIFY_TOKEN
  ) {
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "OK");
    res.send(req.query['hub.challenge']);
  } else {
    console.log("\u001b[1;32m" + "Hub Challenge: " + "\u001b[0m" + "Bad Request");
    res.sendStatus(400);
  }
});

app.post('/webhook', (req, res) => {
  console.log("\u001b[1;32m" + "Data: " + "\u001b[0m" + 'Facebook request body:', req.body);
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("\u001b[1;32m" + "Node: " + "\u001b[0m" + `Facebook Messenger webhook is running on port ${port}`);
});