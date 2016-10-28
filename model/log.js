'use strict';

const mongoose = require('mongoose');

const logSchema = module.exports = mongoose.Schema({
  userId: {type: mongoose.Schema.ObjectId, required: true},
  date: {type: Date},
  startDest: {type: [Number], required: true},
  endDest: {type: [Number], required: true}
});

module.exports = mongoose.model('barrel', logSchema);
