(function () {
  'use strict';

  var $ = window.jQuery;

  var OrgSyncApi = window.OrgSyncApi = function (options) {
    if (!options) options = {};
    this.key = options.key;
    var version = this.version = options.version || 1;
    this.urlRoot = 'http://mobile-staging.orgsync.com/user_api/v' + version;
  };

  OrgSyncApi.prototype.get = function (path, cb) {
    var data = {};
    if (this.key) data.key = this.key;
    return $.ajax({
      type: 'GET',
      url: this.urlRoot + path,
      dataType: 'jsonp',
      data: data,
      success: function (res) {
        if (res.error) return cb(new Error(res.error));
        cb(null, res);
      },
      error: function (xhr) { cb(new Error(xhr.responseText)); }
    });
  };
})();
