'use strict';

//npm modules
const Router = require('express').Router;
const debug = require('debug')('appMileage:log-router');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

//app modules
const parseBearerAuth = require('../lib/parse-bearer-auth');
const logController = require('../controller/log-controller');

const logRouter = module.exports = new Router();

logRouter.post('/user/log', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST api/log');
  req.body.userId = req.userId;
  logController.createLog(req.body)
  .then(log => {
    res.json(log);
  })
  .catch(next);
});

logRouter.get('/user/log/:logid', parseBearerAuth, function(req, res, next){
  debug('GET api/log');
  logController.fetchLog(req.params.logid)
  .then(log => {
    if(!log) return next(httpErrors(404, 'Log not found'));
    res.json(log);
  })
  .catch(next);
});

logRouter.delete('/user/log/:logid', parseBearerAuth, function(req, res, next){
  debug('DELETE api/log');
  logController.deleteLog(req.params.logid)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
});
