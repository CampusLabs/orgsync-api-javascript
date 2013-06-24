# OrgSync API Javascript Client

To install, simply use [Bower](https://github.com/twitter/bower) and add
`'orgsync-api-javascript` to your `bower.json`.

```js
// Create an API instance.
var api = new window.OrgSyncApi({

  // Pass in your auth key.
  key: 'abc123',

  // And optionally a version (currently defaults to 1)
  version: 1
});

// Use the `get` method to request data.
api.get('/communities/2/orgs', function (er, data) {
  if (er) return alert('Failed with error: ' + er);
  alert('Everything went better than expected: ' + JSON.stringify(data));
});

// Or with parameters
api.get('/communities/2/orgs', {page: 2}, function (er, data) { ... });
```
