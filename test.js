var assert = require('assert');
var OrgSyncApi = require('./');

var api = new OrgSyncApi({key: 'test'});

assert.strictEqual(api.key, 'test');

assert.strictEqual(
  api.path('/my/:test/path/:id', {test: 'sweet', id: 'bro'}, false),
  '/my/sweet/path/bro'
);

assert.strictEqual(
  api.path('/my/:test/path/:id', {test: 'sweet', id: 'bro'}, true),
  '/my/sweet/path/bro?key=test'
);

assert.strictEqual(
  api.url('/my/:test/path/:id', {test: 'sweet', id: 'bro'}, false),
  'https://api.orgsync.com/api/v3/my/sweet/path/bro'
);

assert.strictEqual(
  api.url('/my/:test/path/:id', {test: 'sweet', id: 'bro'}, true),
  'https://api.orgsync.com/api/v3/my/sweet/path/bro?key=test'
);

assert.strictEqual(
  api.url('/my/:test/path?special=:id', {test: 'sweet', id: 'bro'}),
  'https://api.orgsync.com/api/v3/my/sweet/path?special=bro&key=test'
);
