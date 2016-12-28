'use strict';

const mongoose = require('mongoose');

const logSchema = module.exports = mongoose.Schema({
  userId: {type: mongoose.Schema.ObjectId, required: true},
  date: {type: Date},
  routeData: {type: Array, 'default': [], required: true},
  distance: {type: Number, required: true}
});

module.exports = mongoose.model('log', logSchema);
