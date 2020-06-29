const express = require('express');
const { auth, requiresAuth } = require('../../');

const app = express();

const port = 3000;
const providerPort = 3001;

app.use(auth({
  issuerBaseURL: `http://localhost:${providerPort}`,
  baseURL: `http://localhost:${port}`,
  clientID: 'test-express-openid-connect-client-id',
  clientSecret: 'test-express-openid-connect-client-secret',
  appSession: {
    secret: 'test-secret'
  },
  required: false,
  idpLogout: true
}));

app.get('/user', requiresAuth(), (req, res) => {
  res.send(`hello ${req.openid.user.sub}`);
});

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
