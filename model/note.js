'use strict';

const shortid = require('shortid');
const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  noteID: {type: String, default: shortid()},
  content: {type: String},
  timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Note', noteSchema);
