var assert = require('assert');
var OrgSyncApi = require('./');

var api = new OrgSyncApi();

assert.strictEqual(
  api.resolvePath('/my/:test/path/:id', {test: 'sweet', id: 'bro'}),
  '/my/sweet/path/bro'
);
