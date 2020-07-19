const { assert } = require('chai');
const puppeteer = require('puppeteer');
const provider = require('./fixture/oidc-provider');
const {
  baseUrl,
  start,
  runExample,
  stubEnv,
  checkContext,
  goto,
  login,
  logout,
} = require('./fixture/helpers');

describe('basic login with default configuration', async () => {
  let authServer;
  let appServer;

  beforeEach(async () => {
    stubEnv();
    authServer = await start(provider, 3001);
    appServer = await runExample('basic');
  });

  afterEach(async () => {
    authServer.close();
    appServer.close();
  });

  it('should login and logout with default configuration', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await goto(baseUrl, page);
    assert.match(
      page.url(),
      /http:\/\/localhost:3001\/interaction/,
      'User should have been redirected to the auth server to login'
    );
    await login('username', 'password', page);
    assert.equal(
      page.url(),
      `${baseUrl}/`,
      'User is returned to the original page'
    );
    const authenticatedResponse = await checkContext(await page.cookies());
    assert.isOk(authenticatedResponse.isAuthenticated);
    assert.equal(authenticatedResponse.user.sub, 'username');
    assert.empty(
      authenticatedResponse.accessToken,
      "default response_type doesn't include code"
    );

    await logout(page);

    const unauthenticatedResponse = await checkContext(await page.cookies());
    assert.isNotOk(unauthenticatedResponse.isAuthenticated);
  });
});
