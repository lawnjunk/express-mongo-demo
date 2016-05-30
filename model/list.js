'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');

const listSchema = mongoose.Schema({
  name: {type: String},
});

const List = module.exports = mongoose.model('List', listSchema); 
Promise.promisifyAll(List);
Promise.promisifyAll(List.prototype);
