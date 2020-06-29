const Provider = require('oidc-provider');

const clientPort = 3000;
const port = 3001;

const config = {
  clients: [{
    client_id: 'test-express-openid-connect-client-id',
    client_secret: 'test-express-openid-connect-client-secret',
    application_type: 'web',
    token_endpoint_auth_method: 'none',
    response_types: ['id_token', 'code', 'code id_token'],
    grant_types: ['implicit', 'authorization_code', 'refresh_token'],
    redirect_uris: [`http://localhost:${clientPort}/callback`],
  }],
  findAccount(ctx, id) {
    return {
      accountId: id,
      claims(use, scope) { return { sub: id }; },
    };
  }
};

const provider = new Provider(`http://localhost:${port}`, config);

// Monkey patch the provider to allow localhost and http redirect uris
const { invalidate: orig } = provider.Client.Schema.prototype;
provider.Client.Schema.prototype.invalidate = function invalidate(message, code) {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return;
  }
  orig.call(this, message);
};

provider.listen(port, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
});
