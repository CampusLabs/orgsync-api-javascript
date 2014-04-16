# OrgSync API Javascript Client

### WARNING: OrgSync API V3 is currently unstable

To install, simply use [Bower](https://github.com/twitter/bower) and add
`'orgsync-api'` to your `bower.json`. The same API is also duplicated
in Node.js via the npm package with the same name. On the browser you'll need
`jQuery` for generating XHR and JSONP requests. `superagent` is required for
generating requests in Node.js.

```js
// Create an API instance.
var api = new OrgSyncApi();

// Login (optionally pass {key: yourKey} to the OrgSyncApi constructor).
api.login({
  community_id: 123,
  username: 'example',
  password: 'example'
}, function (er) {

  // Use the `get` method to request data.
  api.get('/communities/2/orgs', function (er, data) {
    if (er) return alert('Failed with error: ' + er);
    alert('Everything went better than expected: ' + JSON.stringify(data));
  });

  // Or with parameters...
  api.get('/communities/2/orgs', {page: 2}, function (er, data) { ... });
});

```
