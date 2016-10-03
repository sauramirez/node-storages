'use strict';

const Storage = require('./base_storage');
const JSFtp = require('jsftp');
const Url = require('url');

class FtpStorage extends Storage {
  /**
   * Args:
   * loc - (string) ftp storage location
   * baseUrl - (string) The base media url
   */
  constructor (loc, baseUrl) {
    super();
    this.loc = loc;
    this.baseUrl = baseUrl;
    this.config = this._decodeLocation(this.loc);
    this._connection = null;
  }

  _decodeLocation (loc) {
    const splittedUrl = Url.parse(loc);
    const config = {};
    if (['ftp:', 'aftp:'].indexOf(splittedUrl.protocol) === -1) {
      throw 'ImproperlyConfigured';
    }
    if (splittedUrl.hostname === '') {
      throw 'ImproperlyConfigured';
    }

    config.active = false;
    if (splittedUrl.protocol === 'aftp:') {
      config.active = true;
    }
    config.path = splittedUrl.path;
    config.host = splittedUrl.hostname;
    config.user = splittedUrl.auth.split(':')[0];
    config.password = splittedUrl.auth.split(':')[1];
    config.port = splittedUrl.port;
    return config;
  }

  _getConnection() {
    if (this._connection !== null) {
      return this._connection;
    }

    this._connection = new JSFtp({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      pass: this.config.password
    });
    return this._connection;
  }

  listdir (path) {
    let conn = this._getConnection();
    return new Promise((resolve, reject) => {
      conn.ls(path, function (err, res) {
        if (err) {
          return reject(err);
        }
        let folders = [];
        res.forEach(function () {
          folders.push(res.name);
        });
        return resolve(folders);
      });
    });
  }

  exists (name) {
    let conn = this._getConnection();
  }
}

module.exports = FtpStorage;
