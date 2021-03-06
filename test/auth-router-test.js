'use strict';

// set env vars
process.env.APP_SECRET = process.env.APP_SECRET || 'slugs are secret hahhah';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// require npm modules
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authdemo:auth-router-test');

// require app modules
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

// setup module constants
const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing module auth-router', function(){
  before((done) => {
    debug('before module auth-roter');
    if (! server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after module auth-roter');
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST /api/signup', function(){
    after((done) => {
      debug('after POST /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done){
      debug('test POST /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        emailAddress: 'test@test.com',
        password: 'test123'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });

    it('should return a status 400', function(done){
      debug('POST 400 test on /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        emailAddress: '',
        password: '54321'
      })
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(400);
        expect(res.badRequest).to.equal(true);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET /api/signin', function(){
    before((done) => {
      debug('before GET /api/signup');
      authController.signup({emailAddress: 'test@test.com', password: '1234'})
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      debug('after GET /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done){
      debug('test GET /api/signup');
      request.get(`${baseURL}/signin`)
      .auth('test@test.com', '1234')
      .then( res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });

    it('should return a status 500', function(done) {
      debug('GET 500 test on /api/signin');
      request.get(`${baseURL}/signin`)
      .auth('wrong@test.com', 1234)
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(500);
        done();
      })
      .catch(done);
    });

    it('should return a status 401', function(done) {
      debug('GET 401 test on /api/signin');
      request.get(`${baseURL}/signin`)
      .auth('test@test.com', 'wrong')
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });
});
