(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['qs', 'superagent'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('qs'), require('superagent'));
  } else {
    root.OrgSyncApi = factory(root.Qs, root.superagent);
  }
})(this, function (Qs, superagent) {
  'use strict';

  var QS_OPTIONS = {arrayFormat: 'brackets'};

  var extend = function (obj, data) {
    for (var key in data) obj[key] = data[key];
    return obj;
  };

  var OrgSyncApi = function (options) { extend(this, options); };

  var proto = {
    urlRoot: 'https://api.orgsync.com/api/v3',

    path: function (path, data) {
      data = extend({key: this.key}, data);
      var subs = [];
      path = path.replace(/:(\w+)/g, function (__, $1) {
        subs.push($1);
        return data[$1];
      });
      subs.forEach(function (sub) { delete data[sub]; });
      var qs = Qs.stringify(data, QS_OPTIONS);
      return path + (path.indexOf('?') === -1 ? '?' : '&') + qs;
    },

    url: function (path, data, qs) {
      return this.urlRoot + this.path(path, data, qs);
    },

    req: function (method, path, query, body, cb) {
      method = method.toLowerCase();

      if (typeof body === 'function') {
        cb = body;
        body = null;
      }

      if (typeof query === 'function') {
        cb = query;
        query = null;
      }

      var promise;
      if (!cb) {
        promise = new Promise(function (resolve, reject) {
          cb = function (er, res) { if (er) reject(er); else resolve(res); };
        });
      }

      if (method !== 'get' && !body) {
        body = query;
        query = null;
      }

      var req = superagent[method](this.url(path, query));
      if (body) req = req.send(body);

      req.end(function (er, res) {
        var body = (res || {}).body || {};
        if (body.data) return cb(null, body);
        if (method === 'del' && res.status === 204) return cb();
        if (body.error) er = new Error(body.error);
        else if (res && res.error) er = res.error;
        else if (!er) er = new Error('Unknown');
        er.fields = body.error_fields || {};
        cb(er, body);
      });

      return promise || this;
    },

    auth: function (path, data, cb) {
      var self = this;
      data = extend({device_info: 'OrgSync API JavaScript Client'}, data);
      return this.post(path, data, function (er, res) {
        if (!er) self.key = res.key;
        cb(er, res);
      });
    },

    login: function (data, cb) {
      return this.auth('/authentication/login', data, cb);
    },

    register: function (data, cb) {
      return this.auth('/accounts/create', data, cb);
    }
  };

  ['get', 'post', 'patch', 'put', 'del'].forEach(function (method) {
    proto[method] = function (path, data, attachments, cb) {
      return this.req(method, path, data, attachments, cb);
    };
  });

  for (var key in proto) OrgSyncApi.prototype[key] = proto[key];

  return OrgSyncApi;
});
