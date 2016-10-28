'use strict';

//npm modules
const debug = require('debug')('appMileage');
const httpErrors = require('http-errors');

//app modules
const Log = require('../model/log');


exports.createLog = function(logData){
  debug('log controller creating log');
  return new Promise((resolve, reject) =>{
    new Log(logData).save()
    .then(log => resolve(log))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchLog = function(logId) {
  debug('log controller fetching log');
  return new Promise((resolve, reject) => {
    Log.findOne({_id: logId})
    .then(log => resolve(log))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteLog = function(logId) {
  debug('log controller deleting log');
  return new Promise((resolve, reject) => {
    Log.remove({_id: logId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllLogs = function(){
  return Log.remove({});
};
