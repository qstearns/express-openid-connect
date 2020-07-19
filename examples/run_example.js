const path = require('path');

require('dotenv').config();

const [, , example, port = 3000, providerPort = 3001] = process.argv;

// Configure and start a mock authorization server if no .env config is found
if (!process.env.CLIENT_ID) {
  const provider = require('../end-to-end/fixture/oidc-provider');
  console.log(
    `Starting a mock authorization server. You can login with any credentials.`
  );
  process.env = {
    ...process.env,
    ISSUER_BASE_URL: `http://localhost:${providerPort}`,
    CLIENT_ID: 'test-express-openid-connect-client-id',
    BASE_URL: `http://localhost:${port}`,
    SECRET: 'LONG_RANDOM_VALUE',
    CLIENT_SECRET: 'test-express-openid-connect-client-secret',
  };
  provider.listen(providerPort, () =>
    console.log(
      `Authorization server started at http://localhost:${providerPort}`
    )
  );
}

const app = require(path.join(__dirname, example));

app.listen(port, () =>
  console.log(`Example app started at http://localhost:${port}`)
);
