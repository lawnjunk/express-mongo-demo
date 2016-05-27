'use strict';

const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const noteSchema = mongoose.Schema({
  content: {type: String},
  timestamp: {type: Date, default: new Date()},
  listId: {type: Schema.ObjectId}
});

module.exports = mongoose.model('Note', noteSchema);
