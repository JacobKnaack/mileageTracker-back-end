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
        logController.createLog({userId: '5813b7784f096e0dfe7bbe64', date: date, startDest: [100, 200], endDest: [300, 400]})
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
        .send({date: date, startDest: [127, 145], endDest: [201, 231]})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.endDest)).to.equal(true);
          expect(res.body.startDest[0]).to.equal(127);
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
        .send({date: date, startDest: [127.463736, 178.637468], endDest: [134.76487, 123.4567]})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
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
          expect(res.body.endDest[1]).to.equal(400);
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
