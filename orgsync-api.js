(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['superagent'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('superagent'));
  } else {
    root.OrgSyncApi = factory(root.superagent);
  }
})(this, function (superagent) {
  'use strict';

  var serialize = superagent.serialize['application/x-www-form-urlencoded'];

  var extend = function (obj, data) {
    for (var key in data) obj[key] = data[key];
    return obj;
  };

  var OrgSyncApi = function (options) { extend(this, options); };

  var proto = {
    urlRoot: 'https://api.orgsync.com/api/v3',

    path: function (path, data, qs) {
      data = extend({key: this.key}, data);
      var subs = [];
      path = path.replace(/:(\w+)/g, function (__, $1) {
        subs.push($1);
        return data[$1];
      });
      subs.forEach(function (sub) { delete data[sub]; });
      if (qs !== false) {
        path += (path.indexOf('?') === -1 ? '?' : '&') + serialize(data);
      }
      return path;
    },

    url: function (path, data, qs) {
      return this.urlRoot + this.path(path, data, qs);
    },

    req: function (method, path, data, attachments, cb) {
      method = method.toLowerCase();
      if (!cb) {
        cb = attachments;
        attachments = {};
      }
      if (!cb) {
        cb = data;
        data = {};
      }
      data = extend({key: this.key}, data);
      var url = this.url(path, data, false);

      var req = superagent[method](url);
      req[method === 'get' ? 'query' : 'send'](data);

      for (var key in attachments) {
        var attachment = attachments[key];
        req.attach(key, attachment.file, attachment.name);
      }

      req.end(function (er, res) {
        var body = (res || {}).body || {};
        if (body.data) return cb(null, body);
        if (body.error) er = new Error(body.error);
        else if (res && res.error) er = res.error;
        else if (!er) er = new Error('Unknown');
        er.fields = body.error_fields || {};
        cb(er, body);
      });

      return this;
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
      this.auth('/authentication/login', data, cb);
    },

    register: function (data, cb) {
      this.auth('/accounts/create', data, cb);
    }
  };

  ['get', 'post', 'patch', 'put', 'delete'].forEach(function (method) {
    proto[method] = function (path, data, attachments, cb) {
      return this.req(method, path, data, attachments, cb);
    };
  });

  for (var key in proto) OrgSyncApi.prototype[key] = proto[key];

  return OrgSyncApi;
});
