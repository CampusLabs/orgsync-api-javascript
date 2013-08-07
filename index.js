(function () {
  'use strict';

  var node = typeof window === 'undefined';

  var _ = node ? require('underscore') : window._;
  var superagent = node ? require('superagent') : window.superagent;

  var methods = ['get', 'post', 'patch', 'put', 'delete'];

  var OrgSyncApi = function (options) { _.extend(this, options); };

  _.extend(OrgSyncApi.prototype, {
    urlRoot: 'http://mobile-staging.orgsync.com/user_api/v1',

    req: function (method, path, data, cb) {
      if (!cb) cb = data;
      if (!_.isObject(data)) data = {};
      if (this.key) data.key = this.key;
      return superagent[method.toLowerCase()](this.urlRoot + path)
        .send(data)
        .end(function (er, res) {
          if (er) return cb(er, res);
          if (!res.ok) return cb(new Error(res.body.error), res);
          cb(null, res);
        });
    },

    login: function (username, password, cb) {
      var self = this;
      this.post('/authentication/login', {
        device_info: 'OrgSync API JavaScript Client',
        username: username,
        password: password
      }, function (er, res) {
        if (er) return cb(er);
        self.key = res.body.key;
        cb(null, res);
      });
    }
  }, _.reduce(methods, function (obj, method) {
    obj[method] = function (path, data, cb) {
      return this.req(method, path, data, cb);
    };
    return obj;
  }, {}));

  node ? module.exports = OrgSyncApi : window.OrgSyncApi = OrgSyncApi;
})();
