'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const listSchema = mongoose.Schema({
  name: {type: String}
});

module.exports = mongoose.model('List', listSchema); 
