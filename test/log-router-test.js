'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'slugs are secret hahhah';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authdemo:auth-router-test');

const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');
const logController = require('../controller/log-controller');

const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api/user`;
const server = require('../server');
request.use(superPromise);

describe('testing the log router', function(){
  before((done) => {
    debug('before module log-router');
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
    debug('after module log-router');
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

  describe('testing api/user/log', () => {
    before((done) => {
      debug('before block router test');
      var date = new Date().getDate();
      authController.signup({emailAddress: 'bob@test.com', password: 'password', firstName: 'Bob', lastName: 'logger'})
      .then(token => {
        this.tempToken = token;
        logController.createLog({userId: '5813b7784f096e0dfe7bbe64', date: date, routeData: [{'lat': 50.969, 'lng': 120.46473}], startAddress: 'NorthWest 57th St., Seattle', endAddress: '3rd Ave, Seattle', distance: 20})
        .then(log => {
          this.tempLog = log;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('POST test after block');
      Promise.all([
        userController.removeAllUsers(),
        logController.removeAllLogs()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('testing POST route', () =>{
      it('should create a log', (done) => {
        var date = new Date().getDate();

        request.post(`${baseURL}/log`)
        .send({date: date, routeData: [{'lat': 127, 'lng': 145}, {'lat': 130, 'lng': 150}], startAddress: '3rd Ave, Seattle', endAddress: 'NorthWest 57th St., Seattle',  distance: 20})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.routeData)).to.equal(true);
          expect(res.body.routeData[0]['lat']).to.equal(127);
          expect(res.body.routeData[0]['lng']).to.equal(145);
          done();
        })
        .catch(done);
      });

      it('should return a 400 bad request', (done) => {
        var date = new Date().getDate();

        request.post(`${baseURL}/log`)
        .send({date: date, startDest: [], endDest: []})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        })
        .catch(done);
      });

      it('should return a 401 unauthorized', (done) => {
        var date = new Date().getDate();

        request.post(`${baseURL}/log`)
        .send({date: date, routeData: [{'lat': 127.3863845, 'lng': 143.735282}], distance: 0})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        })
        .catch(done);
      });
    });

    describe('testing GET all user logs', () => {
      it('should fetch all logs created by user', (done) => {
        request.get(`${baseURL}/log`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          done();
        })
        .catch(done);
      });
    });

    describe('testing GET route', () => {
      it('should fetch a log', (done) => {
        request.get(`${baseURL}/log/${this.tempLog._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.distance).to.equal(20);
          done();
        })
        .catch(done);
      });

      it('should return a 404 not found', (done) => {
        request.get(`${baseURL}/log/123345`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        })
        .catch(done);
      });

      it('should return a 401 unauthorized', (done) => {
        request.get(`${baseURL}/log/${this.tempLog._id}`)
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        })
        .catch(done);
      });
    });

    describe('testing DELETE route', () => {
      it('should delete a log', (done) => {
        request.del(`${baseURL}/log/${this.tempLog._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(204);
          expect(Object.keys(res.body).length).to.equal(0);
          expect(res.body.constructor).to.equal(Object);
          done();
        })
        .catch(done);
      });

      it('should return a 404 not found', (done) => {
        request.del(`${baseURL}/log/123345`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        })
        .catch(done);
      });

      it('should return a 401 unauthorized', (done) => {
        request.del(`${baseURL}/log/${this.tempLog._id}`)
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
});
