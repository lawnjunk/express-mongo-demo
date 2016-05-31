'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:parse-query');

module.exports = function(req, res, next){
  debug('parseQuery');
  try {
    const queryDefaults = {
      limit: 100,
      offset: 0,
      page: 0
    };

    Object.keys(queryDefaults).forEach(function(key){
      let temp;
      if (req.query[key]) {
        temp = Number(req.query[key]);
        if (isNaN(temp)) throw AppErr.error400(`query ${key} must be numer`);
        if (temp < 0 ) {
          throw AppErr.error400(`query ${key} must be > 0`);
        }
        if (key === 'limit' && temp < 1){
          throw AppErr.error400('query limit must be one or greater');
        }
      }
      req.query[key] = temp || queryDefaults[key];
    });

    next();
  } catch (err) {
    next(err);
  }
};
