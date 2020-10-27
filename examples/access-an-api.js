const express = require('express');
const request = require('request-promise-native');
const { auth } = require('../');

const app = express();

const { API_PORT = 3002 } = process.env;

app.use(
  auth({
    authorizationParams: {
      response_type: 'code',
      audience: process.env.AUDIENCE,
      scope: 'openid profile email offline_access',
      prompt: 'consent',
    },
  })
);

app.get('/', (req, res, next) => {
  let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
  console.log('the refresh token is: ', req.oidc.refreshToken);
  res.send({ hello: 'world' });
  next();
});

module.exports = app;
