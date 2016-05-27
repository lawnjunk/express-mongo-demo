'use strict';

const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  name: {type: String},
});

module.exports = mongoose.model('List', listSchema);
