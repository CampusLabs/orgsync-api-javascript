(function () {
  'use strict';

  var node = typeof window === 'undefined';

  var $ = node ? null : window.jQuery;
  var _ = node ? require('underscore') : window._;
  var superagent = node ? require('superagent') : window.superagent;

  var methods = ['get', 'post', 'patch', 'put', 'delete'];

  var OrgSyncApi = function (options) { _.extend(this, options); };

  _.extend(OrgSyncApi.prototype, {

    // https://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
    cors: XMLHttpRequest && 'withCredentials' in new XMLHttpRequest(),

    urlRoot: 'http://mobile-staging.orgsync.com/user_api/v1',

    req: function (method, path, data, cb) {
      if (!cb) cb = data;
      if (!_.isObject(data)) data = {};
      if (this.key) data.key = this.key;
      var url = this.urlRoot + path;
      if (superagent && this.cors) {
        this.superagentReq(method, url, data, cb);
      }
      return this.jQueryReq(method, url, data, cb);
    },

    superagentReq: function (method, url, data, cb) {
      return superagent[method.toLowerCase()](url)
        .send(data)
        .end(function (er, res) {
          if (er) return cb(er, res);
          if (!res.ok) return cb(new Error(res.body.error), res);
          cb(null, res);
        });
    },

    jQueryReq: function (method, url, data, cb) {
      return $.ajax({
        type: this.cors ? method.toUpperCase() : 'GET',
        url: url,
        dataType: this.cors ? 'json': 'jsonp',
        contentType: 'application/json',
        data: data,
        success: function (res) {
          if (res.error) return cb(new Error(res.error));
          cb(null, res);
        },
        error: function (xhr) { cb(new Error(xhr.responseText)); }
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