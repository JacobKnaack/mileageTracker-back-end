'use strict';

// npm moduels
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('appMileage:server');
const cors = require('cors');

// app modules
const handleError = require('./lib/handle-error');
const parserBearerAuth = require('./lib/parse-bearer-auth');
const authRouter = require('./route/auth-router');
const logRouter = require('./route/log-router');

// constant module variables
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/testDB';

// setup mongo
mongoose.Promise = require('bluebird');
mongoose.connect(mongoURI);

// setup middleware
app.use(morgan('dev'));
app.use(cors());

// setup routes
app.all('/', parserBearerAuth, function(req, res){
  console.log('req.userId', req.userId);
  res.send('booya');
});

app.use('/api', authRouter);
app.use('/api', logRouter);

app.all('*', function(req, res, next){
  debug('404 * route');
  next(httpErrors(404, 'no such route'));
});

app.use(handleError);

// start server
const server = app.listen(port, function(){
  debug('server up on', port);
});

server.isRunning = true;
module.exports = server;
