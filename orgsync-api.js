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

    req: function (method, path, data, cb) {
      method = method.toLowerCase();
      if (!cb) {
        cb = data;
        data = {};
      }
      data = extend({key: this.key}, data);
      var url = this.url(path, data, false);

      // HACK: This little dance is necessary for IE9. Once IE9 support is
      // dropped, JSONP will be irrelevant and purely superagent can be used.
      try {
        superagent[method](url)
          [method === 'get' ? 'query' : 'send'](data)
          .end(function (er, res) {
            if (er) return cb(er);
            var body = res.body || {};
            if (body.data) return cb(null, body);
            cb(new Error(body.error || res.text || 'Unknown'));
          });
      } catch (er) {
        if (typeof jQuery === 'undefined') throw er;
        jQuery.ajax({
          url: url,
          dataType: 'jsonp',
          data: data,
          success: function (res) {
            if (res.error) return cb(new Error(res.error));
            cb(null, res);
          },
          error: cb
        });
      }
      return this;
    },

    login: function (data, cb) {
      var self = this;
      data = extend({device_info: 'OrgSync API JavaScript Client'}, data);
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
