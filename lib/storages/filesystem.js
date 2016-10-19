'use strict';

const Storage = require('./base_storage');
const Fs = require('fs');
const Path = require('path');
const Exec = require('child_process').exec;

const internals = {};

internals.File = class {
  constructor () {
  }
};

exports = module.exports = internals.FilesystemStorage = class extends Storage {

  constructor (location) {
    super();
    this.location = location;
  }

  _getAbsolutePath (path) {
    if (Path.isAbsolute(path)) {
      return path;
    }
    return Path.join(process.cwd, path);
  }

  listdir (path) {
    return new Promise((resolve, reject) => {
      Exec(`ls ${path}`, (err, stdout) => {
        if (err) {
          return reject(err);
        }
        return resolve(stdout);
      });
    });
  }

  exists(name) {
    return new Promise((resolve, reject) => {
      Fs.exists(name, (exists) => {
        if (exists) {
          return resolve(exists);
        }
        return reject(new Error(`${name} does not exist`));
      });
    });
  }
};
