'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:parse-query');

module.exports = function(req, res, next){
  try {
    let limit = Number(req.query.limit) || 100;
    if (isNaN(limit)) throw AppErr.error400('limit must be a number');
    if (limit < 1 ) throw AppErr.error400('limit must be greater than 0');
    let offset = Number(req.query.offset) || 0;
    if (isNaN(offset)) throw AppErr.error400('offset must be a number');
    if (offset < 0 ) throw AppErr.error400('offset must be 0 or greater');
    req.query.limit = limit;
    req.query.offset = offset;
    debug('limit', limit);
    debug('offset', offset);
    next();
  } catch (err) {
    next(err);
  }
}
