(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['superagent'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports =
      factory(require('superagent'));
  } else {
    root.OrgSyncApi = factory(root.superagent);
  }
})(this, function (superagent) {
  'use strict';

  var serialize = superagent.serialize['application/x-www-form-urlencoded'];

  var clone = function (data) {
    var copy = {};
    for (var key in data) copy[key] = data[key];
    return copy;
  };

  var OrgSyncApi = function (options) {
    for (var key in options) this[key] = options[key];
  };

  var proto = {
    urlRoot: 'https://api.orgsync.com/api/v3',

    path: function (path, data, qs) {
      data = clone(data);
      if (!data.key && this.key) data.key = this.key;
      path = path.replace(/:(\w+)/g, function (__, $1) { return data[$1]; });
      if (qs || qs == null) {
        path += (path.indexOf('?') === -1 ? '?' : '&') + serialize(data);
      }
      return path;
    },

    url: function (path, data, qs) {
      return this.urlRoot + this.path(path, data, qs);
    },

    req: function (method, path, data, cb) {
      method = method.toLowerCase();
      if (!cb) {
        cb = data;
        data = {};
      }
      data = clone(data);
      if (!data.key && this.key) data.key = this.key;
      var action = method === 'query'
      superagent[method](this.url(path, data, false))
        [method === 'get' ? 'query' : 'send'](data)
        .end(function (er, res) {
          if (er) return cb(er);
          if (res.body.error) return cb(new Error(res.body.error));
          cb(null, res.body);
        });
      return this;
    },

    login: function (data, cb) {
      var self = this;
      data = clone(data);
      data.device_info = 'OrgSync API JavaScript Client';
      return this.post('/authentication/login', data, function (er, res) {
        if (er) return cb(er);
        self.key = res.body.key;
        cb(null, res);
      });
    }
  };

  ['get', 'post', 'patch', 'put', 'delete'].forEach(function (method) {
    proto[method] = function (path, data, cb) {
      return this.req(method, path, data, cb);
    };
  });

  for (var key in proto) OrgSyncApi.prototype[key] = proto[key];

  return OrgSyncApi;
});
