(function () {
  'use strict';

  var $ = window.jQuery;
  var _ = window._;

  var OrgSyncApi = window.OrgSyncApi = function (options) {
    _.defaults(this, options);
  };

  _.extend(OrgSyncApi.prototype, {
    urlRoot: 'http://mobile-staging.orgsync.com/user_api/v1',

    req: function (method, path, data, cb) {
      if (!cb) cb = data;
      if (!_.isObject(data)) data = {};
      if (this.key) data.key = this.key;
      return $.ajax({
        type: method,
        url: this.urlRoot + path,
        dataType: 'json',
        data: data,
        success: function (res) {
          if (res.error) return cb(new Error(res.error));
          cb(null, res);
        },
        error: function (xhr) { cb(new Error(xhr.responseText)); }
      });
    },

    get: function (path, data, cb) {
      return this.req('GET', path, data, cb);
    },

    post: function (path, data, cb) {
      return this.req('POST', path, data, cb);
    },

    put: function (path, data, cb) {
      return this.req('PUT', path, data, cb);
    },

    delete: function (path, data, cb) {
      return this.req('DELETE', path, data, cb);
    },

    login: function (username, password, cb) {
      var self = this;
      this.post('/authentication/login', {
        device_info: 'OrgSync API JavaScript Client',
        username: username,
        password: password
      }, function (er, res) {
        if (er) return cb(er);
        self.key = res.key;
        cb(null, res);
      });
    }
  });
})();
