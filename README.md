# OrgSync API Javascript Client

Currently jQuery is the only dependency.

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
```
