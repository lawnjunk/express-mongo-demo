'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:parse-query');

module.exports = function(req, res, next){
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
        if (isNaN(temp)) throw AppErr.error400('query must be numer');
        if (temp < 0 ) {
          throw AppErr.error400('query must be > 0');
        }
      }
      req.query[key] = temp || queryDefaults[key];
    });

    console.log(req.query);
    req.query.offset += req.query.limit * req.query.page;
    next();
  } catch (err) {
    next(err);
  }
}
