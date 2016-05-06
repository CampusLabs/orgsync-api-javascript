var assert = require('assert');
var OrgSyncApi = require('./');

var api = new OrgSyncApi({key: 'test'});

assert.strictEqual(api.key, 'test');

assert.strictEqual(
  api.path('/my/:test/path/:id', {test: 'sweet', id: 'bro'}),
  '/my/sweet/path/bro?key=test'
);

assert.strictEqual(
  api.path('/my/array/path', {array: ['sweet', 'bro']}),
  '/my/array/path?key=test&array%5B%5D=sweet&array%5B%5D=bro'
);

assert.strictEqual(
  api.url('/my/:test/path/:id', {test: 'sweet', id: 'bro'}),
  'https://api.orgsync.com/api/v3/my/sweet/path/bro?key=test'
);

assert.strictEqual(
  api.url('/my/:test/path?special=:id', {test: 'sweet', id: 'bro'}),
  'https://api.orgsync.com/api/v3/my/sweet/path?special=bro&key=test'
);
